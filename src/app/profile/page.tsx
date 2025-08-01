'use client';
import { Tabs } from '@mantine/core';
import BillingTab from 'components/profile/BillingTab';
import MyDetailsTab from 'components/profile/MyDetail';
import PasswordTab from 'components/profile/PasswordTab';
import PlanTab from 'components/profile/PlanTab';


export default function AccountSettings() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-48">
      <h1 className="text-3xl font-bold mb-4">Account & Settings</h1>
      <p className="text-sm text-gray-500 mb-6">4.55 pm 21 Jul 2023</p>

      <Tabs defaultValue="details" classNames={{ tab: 'font-semibold' }}>
        <Tabs.List className="mb-6 border-b">
          <Tabs.Tab value="details">My Details</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
          {/* <Tabs.Tab value="team">Team</Tabs.Tab> */}
          {/* <Tabs.Tab value="plan">Plan</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab> */}
        </Tabs.List>

        <Tabs.Panel value="details">
          <MyDetailsTab />
        </Tabs.Panel>

        <Tabs.Panel value="password">
          <PasswordTab />
        </Tabs.Panel>

        {/* <Tabs.Panel value="team">
          <TeamTab />
        </Tabs.Panel> */}

        <Tabs.Panel value="plan">
          <PlanTab />
        </Tabs.Panel>

        <Tabs.Panel value="billing">
          <BillingTab />
        </Tabs.Panel>
      </Tabs>
    </main>
  );
}
