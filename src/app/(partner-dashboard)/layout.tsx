import { Navbar } from 'app/ui/dashboard/nav-bar'
import type { Metadata } from 'next'
import '../globals.css'
import DashboardSidebar from 'components/dashboard/dashboar-sidebar'
import AuthLayout from 'providers/AuthLayout'
import { Providers } from 'app/providers'
import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css';
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
    <MantineProvider>
    <section className="box-border bg-[#FAF9F5] min-h-screen">
     
      <Navbar isAgentDashboard={true} />
      <aside
        className="fixed top-14 mt-24 left-0 z-10 bg-inherit p-4 w-[250px] h-full transition-transform duration-300 ease-in-out"
      >
        <DashboardSidebar />
      </aside>
      <main className="pt-16 lg:ml-[250px] p-6 transition-all duration-300">
        {children}
      </main>
      
    </section>
    </MantineProvider>

   
  )
}
