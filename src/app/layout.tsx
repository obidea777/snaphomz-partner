import type { Metadata } from 'next'
import { satoshi } from 'utils/fonts'
import './globals.css'
import { Providers } from 'components/providers/providers'
import { Toaster } from 'sonner'
import { MantineProvider } from '@mantine/core'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Head from 'next/head'
import AuthLayout from 'providers/AuthLayout'

export const metadata: Metadata = {
  title: 'Snaphomz Partner - Signup ',
  description: 'Snaphomz Estate Agent Registeration'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID )
  return (
    <html lang="en" className={satoshi.variable}>
      <Head>
        <link rel="icon" href="/assets/images/oc-Logo-1.svg" />
      </Head>
      <body className="box-border bg-[#FAF9F5]">
        <Providers>
        <GoogleOAuthProvider
          clientId={ "AIzaSyAD1nloXcpFm5mvgyRdvgwFFpin7dEwwwc" as string}
        >
          <MantineProvider>
            <Toaster position='top-right' richColors />
            {/* <ToastProvider> */}
            <AuthLayout>
            {children}
            </AuthLayout>
           
            {/* </ToastProvider> */}
          </MantineProvider>
          </GoogleOAuthProvider>
        </Providers>
      </body>
    </html>
  )
}
