import NavRightSide from 'app/ui/dashboard/nav-right'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import '../globals.css'

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
    <section className="box-border bg-[#FAF9F5] px-14">
      <nav className="w-full py-6 flex items-center justify-between">
        <Link href="/" className="block w-32">
          <Image
            src="/assets/images/snaphomz-logo.svg"
            alt="logo"
            height={60}
            width={180}
          />
        </Link>
        <section className="md:w-9/12 flex items-center justify-end">
          <NavRightSide hasbutton={false} />
        </section>
      </nav>
      {children}
    </section>
  )
}
