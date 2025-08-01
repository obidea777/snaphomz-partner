'use client'

import { url } from 'inspector'
import { storeCookie } from 'lib/storage'
import { Users, Building2, UserCircle, MessagesSquare, HeartHandshake, Server } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AUTH_ROLE } from 'shared/constants/env'

const menuItems = [
  { icon: Building2, label: 'Overview', active: true,url:"/partner-dashboard"},
    { icon: MessagesSquare, label: 'Messages', url: '/dashboard/messages' },
  { icon: MessagesSquare, label: 'Conversation', url: '/dashboard/chat' },
    // { icon: UserCircle, label: 'Invite' },
    { icon: HeartHandshake, label: 'Social',url:"/snapz" },
    { icon: Building2, label: 'Task',url:"/dashboard/task" },
    // { icon: Users, label: 'Teams', IsAvailable: true },

  // { icon: Users, label: 'Leads' },
  { icon: Building2, label: 'Buy', url: '/dashboard/buy' },
  { icon: Building2, label: 'Sell', url: '/dashboard/sell' },
  // { icon: UserCircle, label: 'Leads' },
  // { icon: Users, label: 'Vendors' },
  // { icon: Users, label: 'Investors' },
  // // { icon: MessagesSquare, label: 'Messages' },
  // { icon: HeartHandshake, label: 'Snapz',url:"/snapz" },

  // { icon: Users, label: 'Teams', IsAvailable: true },
  // { icon: Server, label: 'Concierge Services', IsAvailable: true },

]

export default function DashboardSidebar() {
  const router = useRouter()
  const parmas = useSearchParams();
  const handleOnClick = (userType: string) => {
    storeCookie({ key: AUTH_ROLE, value: userType })
  }
  return (
    <div className="grid  h-70 grid-cols-2 gap-4 border-r border-gray-200 pr-6 ">
      {menuItems.map((item, index) => (
        <button
  onClick={(e) => {
    e.preventDefault();
    if (item?.url) {
      router.push(item?.url);
      handleOnClick(item?.label);
    }
  }}
  key={index}
  className={`flex flex-col items-center justify-center gap-1 px-4 py-4 rounded-lg text-base font-semibold w-full transition-all relative ${
    item.active
      ? 'bg-orange-50 text-orange-500'
      : 'hover:bg-gray-100 text-gray-700'
  } ${item?.IsAvailable ? 'cursor-not-allowed opacity-60' : ''}`}
>
  <item.icon />
  {item.label}
  
  {/* Show "Coming Soon" on hover if not available */}
  {item.IsAvailable && (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 hover:bg-white transition-opacity duration-300">
      <span className="text-gray-500">Coming Soon...</span>
    </div>
  )}
</button>


      ))}
    </div>
  )
}
