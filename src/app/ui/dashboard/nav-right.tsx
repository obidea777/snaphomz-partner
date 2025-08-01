'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import NotificationDropdown from 'components/common/notification-dropdow'
import { useAtom } from 'jotai'
import { useAuthApi } from 'lib/api/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'

type NavsideRightProps = {
  hasbutton?: boolean
}

const NavRightSide: React.FC<NavsideRightProps> = ({ hasbutton = true }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false)
  const router = useRouter()
  const { LogoutAction } = useAuthApi()
  const handleMouseEnter = () => setDropdownVisible(true)
  const handleMouseLeave = () => setDropdownVisible(false)
  const [agentState, setAgentState] = useAtom(agentReadWriteAtom)
  const handleSwitchAgentType = () => {
    const newAgentType =
      agentState?.user?.agentType === 'buyer_agent'
        ? 'seller_agent'
        : 'buyer_agent'

    // Update the agentType in the state
    setAgentState({
      ...agentState,
      user: agentState.user
        ? { ...agentState.user, agentType: newAgentType }
        : undefined
    })
    router.push(
      agentState?.user?.agentType === 'seller_agent'
        ? '/dashboard/buy'
        : '/dashboard/sell'
    )
  }

  console.log(agentState?.user)

  return (
    <section className="items-center flex gap-4 justify-end">
      <NotificationDropdown />

      <div className="rounded-full h-10 w-10 items-center justify-center flex bg-black overflow-hidden">
        {agentState?.user?.profile ? (
          <Image
            src={agentState.user.profile}
            alt="Profile"
            width={24}
            height={24}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="text-sm text-white uppercase">
            {agentState?.user?.firstName?.[0] || 'N'}
            {agentState?.user?.lastName?.[0] || 'A'}
          </p>
        )}
      </div>
      <section
        className="relative flex items-center gap-2 cursor-pointer"
        onMouseEnter={handleMouseEnter}>
        <p className="text-sm text-black capitalize font-medium">
          {agentState?.user?.firstName}
        </p>
        <Image
          height={13}
          width={13}
          src="/assets/images/icons/dropdownArrow.svg"
          alt="Dropdown Arrow"
          className=""
        />
        {isDropdownVisible && (
          <div
            className="absolute top-full mt-6 right-0 bg-white border border-gray-200 shadow-lg rounded-lg z-50 w-56"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <ul className="flex flex-col">
              <Link href={'/profile'} className="px-7 py-4 hover:bg-gray-100 cursor-pointer">
                Profile
              </Link>
              <Link href={'/shared-properties'} className="px-7 py-4 hover:bg-gray-100 cursor-pointer">
                Shared Properties
              </Link>
              <li className="px-7 py-4 hover:bg-gray-100 cursor-pointer">
                Settings
              </li>
              <li
                className="px-7 py-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => LogoutAction()}>
                Logout
              </li>
            </ul>
          </div>
        )}
      </section>
    </section>
  )
}

export default NavRightSide
