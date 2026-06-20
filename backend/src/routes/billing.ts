import { Router, Request, Response } from 'express'
import Stripe from 'stripe'
import { supabase } from '../services/supabase'
import { requireAuth, AuthRequest } from '../middleware/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const router = Router()

// POST /billing/checkout — create Stripe Checkout session
router.post('/checkout', requireAuth, async (req, res: Response) => {
  const { userId, userEmail } = req as AuthRequest
  const { plan } = req.body  // 'monthly' | 'annual'

  const priceId = plan === 'annual'
    ? process.env.STRIPE_PRICE_ANNUAL!
    : process.env.STRIPE_PRICE_MONTHLY!

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: userEmail,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.ALLOWED_ORIGINS?.split(',')[0]}/profile?upgraded=1`,
    cancel_url: `${process.env.ALLOWED_ORIGINS?.split(',')[0]}/profile`,
    metadata: { user_id: userId },
  })

  res.json({ data: { url: session.url }, error: null })
})

// POST /billing/portal — Stripe Customer Portal
router.post('/portal', requireAuth, async (req, res: Response) => {
  const { userId } = req as AuthRequest
  const { data: profile } = await supabase
    .from('profiles').select('stripe_customer_id').eq('id', userId).single()

  if (!profile?.stripe_customer_id) {
    return res.status(400).json({ data: null, error: { message: 'No billing account found' } })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.ALLOWED_ORIGINS?.split(',')[0]}/profile`,
  })

  res.json({ data: { url: session.url }, error: null })
})

// POST /billing/webhook — Stripe webhook (no auth middleware, uses raw body)
router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).send('Webhook signature invalid')
  }

  const session = event.data.object as Stripe.Checkout.Session | Stripe.Subscription

  switch (event.type) {
    case 'checkout.session.completed': {
      const s = session as Stripe.Checkout.Session
      const userId = s.metadata?.user_id
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'premium',
          stripe_customer_id: s.customer as string,
        }).eq('id', userId)
        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_customer_id: s.customer as string,
          stripe_subscription_id: s.subscription as string,
          status: 'active',
          plan: s.metadata?.plan ?? 'monthly',
        }, { onConflict: 'user_id' })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = session as Stripe.Subscription
      await supabase.from('profiles')
        .update({ subscription_status: 'cancelled' })
        .eq('stripe_customer_id', sub.customer as string)
      break
    }
    case 'invoice.payment_failed': {
      const inv = session as unknown as Stripe.Invoice
      await supabase.from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', inv.customer as string)
      break
    }
  }

  res.json({ received: true })
})

export default router
