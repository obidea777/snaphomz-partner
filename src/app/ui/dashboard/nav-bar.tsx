// 'use client'

// import { useEffect, useState } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import NavLinks from 'app/ui/dashboard/nav-links'
// import NavRightSide from 'app/ui/dashboard/nav-right'
// import { SearchInput } from 'components/common/inputs/SearchInput'

// interface NavbarInterface {
//   isAgentDashboard?: boolean
// }
// const Navbar = (props: NavbarInterface) => {
//   const [isScrolled, setIsScrolled] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50)
//     }

//     window.addEventListener('scroll', handleScroll)

//     return () => {
//       window.removeEventListener('scroll', handleScroll)
//     }
//   }, [])

//   return (
//     <nav
//       className={`w-full py-6 flex items-center justify-between h-[100px] fixed top-0 z-10 px-12 transition-colors duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
//       <Link href="/partner-dashboard" className="block w-64">
//         <Image
//           src="/assets/images/snaphomz-logo.svg"
//           alt="logo"
//           height={60}
//           width={180}
//         />
//       </Link>
//       <section className="md:w-9/12 flex items-center justify-end">
//         {props.isAgentDashboard ? (
//           <div className="w-full me-6 sm:w-1/3">
//             <SearchInput placeholder="Search property" />
//           </div>
//         ) : (
//           <section className="mr-12 flex items-center">
//             <NavLinks />
//           </section>
//         )}
//         <NavRightSide />
//       </section>
//     </nav>
//   )
// }

// export { Navbar }
// app/ui/dashboard/nav-bar.tsx
'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Breadcrumb from 'components/common/Breadcrumb'
import NavLinks from './nav-links'
import NavRightSide from './nav-right'
import { SearchInput } from 'components/common/inputs/SearchInput'

type BreadcrumbItem = {
  label: string
  href?: string
}

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [{ label: 'Home', href: '/' }]
  let accumulated = ''

  segments.forEach((segment, idx) => {
    accumulated += `/${segment}`
    // turn "partner-dashboard" → "Partner Dashboard"
    const label = decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())

    const isLast = idx === segments.length - 1
    items.push(
      isLast
        ? { label }
        : { label, href: accumulated }
    )
  })

  return items
}

interface NavbarProps {
  isAgentDashboard?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({ isAgentDashboard }) => {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const breadcrumbs = generateBreadcrumbs(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  console.log(pathname)
  

  return (
    <nav
      className={`
        fixed top-0 z-[100]  w-full px-6  py-2
        flex flex-col bg-[#F7F2EB] transition-colors duration-300
        ${scrolled ? 'bg-white shadow-md' : 'bg-[#F7F2EB]'}
      `}
    >
      {/* top row: logo & links/right-side */}
      <div className="flex items-center justify-between h-[100px]">
        <Link href="/partner-dashboard" className="block w-64">
          <Image
            src="/assets/images/snaphomz-logo.svg"
            alt="logo"
            height={60}
            width={180}
          />
        </Link>

        <div className="flex items-center space-x-6">
          {isAgentDashboard ? (
            <div className="w-full sm:w-1/3">
              <SearchInput placeholder="Search property" />
            </div>
          ) : (
            <NavLinks />
          )}

          <NavRightSide />
        </div>
      </div>

      {/* second row: dynamic breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="w-full border-t pt-3">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
    </nav>
  )
}
