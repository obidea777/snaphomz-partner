'use client'

import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from 'components/common/buttons/Button'
import { useSideNavItems, SideNavItemProps } from './hook'
import { cn } from 'utils/styleUtilities'

interface SideNavItemWithSubItems extends SideNavItemProps {
  subItems?: SideNavItemProps[] // Optional subitems array
}


interface SideNavProps {
  type?: string;
  // Default 'buy', but can be passed as a prop
}

const SideNav: React.FC<SideNavProps> = ({ type = 'buy'  }) => {
  const pathname = usePathname();
  const params = useParams();
  const pId = params?.id
  console.log(params)

  const sideNavItems: SideNavItemWithSubItems[] = useSideNavItems({type ,pId })
  const [expanded, setExpanded] = useState<Set<number>>(new Set()) // Track expanded items

  const toggleSubItems = (index: number) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev)
      if (newExpanded.has(index)) {
        newExpanded.delete(index)
      } else {
        newExpanded.add(index)
      }
      return newExpanded
    })
  }

  return (
    <section className="flex flex-col gap-y-4 w-full h-full border-r border-[#C2C2C2]">
      {sideNavItems.map((items, index) => {
        const isActive = pathname === items.link
        const hasSubItems = items.subItems && items.subItems.length > 0
        return (
          <div key={index}>
            <Link
              href={items.link}
              className={cn(
                'flex w-10/12 md:justify-start rounded-lg capitalize',
                {
                  'bg-[#FFD6C2]': isActive,
                  'hover:bg-[#FFD6C2]': !isActive
                }
              )}
              onClick={() => hasSubItems && toggleSubItems(index)} // Toggle subitems on click
            >
              <Button
                className={cn(
                  'gap-x-4 py-2 px-4 justify-start bg-inherit w-full',
                  {
                    'text-[#E14B00]': isActive,
                    'text-black': !isActive,
                    'hover:text-[#E14B00]': !isActive
                  }
                )}
              >
                <div className="flex justify-center items-center bg-white rounded-full h-10 w-10">
                  <Image
                    src={items.Icon}
                    alt={items.alt}
                    width={18}
                    height={20}
                  />
                </div>
                <p className="font-bold text-base flex items-center capitalize">
                  {items.Title}
                </p>
              </Button>
            </Link>

            {/* Render subitems if available and expanded */}
            {hasSubItems && expanded.has(index) && (
              <div className="pl-8 mt-2">
                {items.subItems?.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    className={cn(
                      'flex w-10/12 mb-2 md:justify-start rounded-lg capitalize',
                      {
                        'bg-[#FFD6C2]': pathname === subItem.link,
                        'hover:bg-[#FFD6C2]': pathname !== subItem.link
                      }
                    )}
                  >
                    <Button
                      className={cn(
                        'gap-x-4 py-2 px-4 justify-start bg-inherit w-full',
                        {
                          'text-[#E14B00]': pathname === subItem.link,
                          'text-black': pathname !== subItem.link,
                          'hover:text-[#E14B00]': pathname !== subItem.link
                        }
                      )}
                    >
                      <div className="flex justify-center items-center bg-white rounded-full h-8 w-8">
                        <Image
                          src={subItem.Icon}
                          alt={subItem.alt}
                          width={16}
                          height={16}
                        />
                      </div>
                      <p className="font-bold text-sm flex items-center capitalize">
                        {subItem.Title}
                      </p>
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}

export { SideNav }
