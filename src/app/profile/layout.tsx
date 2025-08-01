import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Navbar } from 'app/ui/dashboard/nav-bar';
import AuthLayout from 'providers/AuthLayout';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
  return(
     <MantineProvider>
      <AuthLayout>
      <div className='flex-auto bg-primary-100'>
        <Navbar isAgentDashboard={false} />
        {children}
        </div>
        </AuthLayout>
     </MantineProvider>
     );
}

export default layout;
