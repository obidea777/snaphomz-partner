import { MantineProvider } from '@mantine/core'
import FaqBuyerModal from 'components/dashboard/faq-buyer-modal'
import { SideNav } from 'components/dashboard/sell/SideNav'
import Image from 'next/image'
import Link from 'next/link'
import '@mantine/core/styles.css';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <MantineProvider>
    <section className=" pt-16">
      <section className="flex">
        {/* SIDE NAV */}
        <section className="xl:w-[300px] fixed z-10 lg:w-[250px] mt-10 left-0 h-[calc(100vh-100px)] pl-12">
          <section className="flex items-center my-6 mb-14">
            <Link href="/dashboard/buy" className="flex items-center gap-6">
              <Image
                src="/assets/images/icons/arrow-left.svg"
                alt="logo"
                height={19}
                width={18}
              />

              <p className="text-[#5A5A5A] text-md font-medium">
                Back to dashboard
              </p>
            </Link>
          </section>
          <SideNav />
        </section>

        <section className="px-14 xl:ml-[300px] lg:ml-[250px] w-full pt-24 h-screen">
          {children}
        </section>
        <FaqBuyerModal />
      </section>
    </section>
    </MantineProvider>
  )
}
