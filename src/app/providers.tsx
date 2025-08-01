'use client';

import { Toaster } from 'sonner';
import { MantineProvider } from '@mantine/core';

// import '@mantine/charts/styles.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-phone-input-2/lib/style.css';
import './embla.css';
import './globals.css';
import dynamic from "next/dynamic";

// Import the PropertyRequestProvider
import { PropertyRequestProvider } from '../providers/PropertyRequestModal';

const SocketProvider = dynamic(() => import("../providers/socket.context"), {
  ssr: false, // Prevents SSR execution
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider>
      <SocketProvider>
        {/* Wrap the application with the PropertyRequestProvider */}
        <PropertyRequestProvider>
          {children}
        </PropertyRequestProvider>
      </SocketProvider>
      <Toaster position='top-right' richColors />
    </MantineProvider>
  );
}
