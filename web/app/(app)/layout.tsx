'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'
import { profile as profileApi } from '@/lib/api'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    profileApi.get()
      .then(p => { setUserName(p.name); setUserEmail(p.email) })
      .catch(() => router.push('/login'))
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} userEmail={userEmail} />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
