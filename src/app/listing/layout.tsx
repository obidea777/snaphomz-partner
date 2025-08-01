import { Navbar } from 'app/ui/dashboard/nav-bar'
import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Snaphomz Agent Listing',
  description: 'Snaphomz Estate Agent'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="box-border bg-[#FAF9F5] h-screen">
      <div className='bg-white'>
      <Navbar />
      </div>
   
      {children}
    </section>
  )
}
