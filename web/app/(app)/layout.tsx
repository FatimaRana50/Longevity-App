import { Sidebar } from '@/components/layout/Sidebar'
import { BottomNav } from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const userName = 'Explorer'
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userName={userName} />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
