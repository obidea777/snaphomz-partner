import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { satoshi } from 'utils/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Snaphomz Agent Offer',
  description: 'Snaphomz Estate Agent'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="box-border bg-[#FAF9F5]">
      <nav className="bg-pink w-full py-6 flex items-center justify-between px-14">
        <Link href="/" className="block w-32">
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
