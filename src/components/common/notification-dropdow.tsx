import { useEffect, useState } from 'react';
import {
  Menu,
  UnstyledButton,
  Indicator,
  Text,
  ScrollArea,
  Box,
} from '@mantine/core';
import { BellDot, CheckCheck } from 'lucide-react';
import { useAtom } from 'jotai';
import { agentReadWriteAtom } from 'store/atoms/agent-atom';
import { useGetAccessRequestsByUserId, useRepoManagementApi } from 'lib/api/useRepoManagement';
import { useResendVerificationEmail } from 'hooks/useOnboarding';


export default function NotificationDropdown() {
  const [agentState] = useAtom(agentReadWriteAtom);
  const userId = agentState?.user?.id;

  // const { data: accessRequests = [], refetch } = useGetAccessRequestsByUserId(userId);
  const accessRequests =[]
  const unreadCount = accessRequests?.filter((n) => n.status === 'PENDING').length;

  const {updateAccessRequestStatus:{
    mutate,
    isPending
  }} = useRepoManagementApi()

 
  const handleStatusUpdate = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    const payload = {
      requestId: id,
      status,
      accessType: 'OWNER',
    };
  
    mutate(payload, {
      onSuccess: () => {
        // ✅ Refetch access requests after successful mutation
        // refetch();
      },
    });
  };

  return (
    <Menu shadow="md" radius={'lg'} width={280} position="bottom-end">
      <Menu.Target>
        <UnstyledButton>
          <Indicator color="red" size={12} disabled={!unreadCount}>
            <BellDot size={24} />
          </Indicator>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <ScrollArea h={350}>
          {accessRequests.length === 0 && (
            <Box p="md">
              <Text size="sm" color="dimmed">
                No notifications
              </Text>
            </Box>
          )}

          {accessRequests.map((req) => (
            <Box
              key={req.id}
              p="xs"
              className="bg-slate-50 p-2 mb-1 flex flex-col gap-2 rounded-md"
            >
              <div className="flex items-start gap-2">
                <CheckCheck strokeWidth={1} size={16} />
                <Text size="sm">
                  Access request for <strong>{req.repo?.name}</strong>
                </Text>
              </div>
              {req.status === 'PENDING' && (
                <div className="flex gap-2 text-[10px] justify-end">
                  <button
                    disabled={isPending}
                    onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                    className="p-2 bg-green-600 py-1 text-white rounded-md"
                  >
                    Accept
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                    className="p-2 bg-red-600 py-1 text-white rounded-md"
                  >
                    Reject
                  </button>
                </div>
              )}
              {req.status !== 'PENDING' && (
                <div className="text-[10px] text-right text-gray-500 italic">
                  Status: {req.status}
                </div>
              )}
            </Box>
          ))}
        </ScrollArea>
      </Menu.Dropdown>
    </Menu>
  );
}
