'use client'
import { Providers } from 'components/providers/providers'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  // const router = useRouter()
  // const [agentData] = useAtom(agentReadWriteAtom)
  
  // if(agentData?.is_authenticated) {
  //   router.push('/partner-dashboard')
  // }
  return (
    <html lang="en" >
      <Head>
        <link rel="icon" href="/assets/images/oc-Logo-1.svg" />
      </Head>
      <body className="box-border bg-[#FAF9F5]">
        <Providers>
          <main className='h-[100vh] overflow-hidden'>
            <nav className="h-[100px] w-full py-6 flex items-center justify-between px-14">
              <Link href="/" className="block w-64">
                <Image
                  src="/assets/images/snaphomz-logo.svg"
                  alt="logo"
                  height={60}
                  width={180}
                />
              </Link>
            </nav>
            <section className="flex items-start flex-wrap h-[100vh-100px]">
              <section className="md:w-1/2 max-h-full">
                <img src="/assets/images/signupHero.svg" alt="hero" />
              </section>
              {children}
            </section>
          </main>
        </Providers>
      </body>
    </html>
  )
}

export default Layout