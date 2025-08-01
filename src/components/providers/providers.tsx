'use client'

import { Provider } from 'jotai'
import { ReactNode } from 'react'
import queryClient from 'lib/querryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import dynamic from "next/dynamic";

const SocketProvider = dynamic(() => import("providers/socket.context"), {
  ssr: false, // Prevents SSR execution
});
export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {' '}
      <Provider>
        <SocketProvider>
          {children}
        </SocketProvider>
      </Provider>
    </QueryClientProvider>
  )
}
