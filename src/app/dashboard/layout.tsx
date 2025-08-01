import { Navbar } from 'app/ui/dashboard/nav-bar'
import type { Metadata } from 'next'
import '../globals.css'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
import Breadcrumb from 'components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Snaphomz Partner Dashboard',
  description: 'Snaphomz Estate Agent'
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Settings" }
  ]
  
  return (
    <MantineProvider>
    <section className="box-border bg-[#FAF9F5]">
      <Navbar />
      <div className="mt-16 px-12"> 
          {/* <Breadcrumb
            items={breadcrumbItems}
            key='br_01'
          /> */}
        </div>
      {children}
    </section>
    </MantineProvider>
  )
}
