'use client'

import DashboardContent from 'components/dashboard/content'

export default function DashboardPage() {
  return (
    <div className="mt-16 ms-16 ">
      <div className="px-4 py-6 flex gap-8">
        <main className="flex-1">
          <DashboardContent />
        </main>
      </div>
    </div>
  )
}
