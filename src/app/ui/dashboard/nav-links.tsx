'use client'

import { useAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { cn } from 'utils/styleUtilities'

const NavLinks = () => {
  const pathname = usePathname()
  const [agentState] = useAtom(agentReadWriteAtom)

  // Add the sell or buy link dynamically based on agentType
  const agentSpecificLinks = []
  if (agentState.user?.agentType === 'seller_agent') {
    agentSpecificLinks.push({ name: 'sell', link: '/dashboard/sell' })
  } else if (agentState.user?.agentType === 'buyer_agent') {
    agentSpecificLinks.push({ name: 'buy', link: '/dashboard/buy' })
  }

  // Combine agent-specific links with common links
  const allLinks = [
    ...agentSpecificLinks,
    { name: 'messages', link: '/dashboard/messages' },
    { name: 'conversation', link: '/dashboard/chat' },
    { name: 'requests', link: '/requests' },
   
  ]

  return (
    <>
      {allLinks.map((link) => (
        <Link
          key={link.name}
          href={link.link}
          className={cn(
            'grow capitalize text-sm font-medium font-satoshi hover:text-black md:flex-none md:justify-start md:p-2 md:px-3 text-[#7E7E7E]',
            {
              'border-b-[3px] text-black border-solid border-black pb-2':
                pathname.includes(link.link)
            }
          )}>
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}
    </>
  )
}

export default NavLinks
