import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Snaphomz Partner Dashboard',
  description: 'Snaphomz Estate Agent'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="box-border bg-[#FAF9F5]">
      <nav
        className={`w-full py-6 flex items-center justify-between h-[100px] fixed top-0 z-10 px-12 transition-colors duration-300`}>
        <Link href="/" className="block w-64">
          <Image
            src="/assets/images/snaphomz-logo.svg"
            alt="logo"
            height={60}
            width={180}
          />
        </Link>
      </nav>
      {children}
    </section>
  )
}
