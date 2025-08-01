'use client';

import MessageBoxComponent from "components/messages/MessageBox";
import { useAtom } from "jotai";
import { useUserAgentMessageApi } from "lib/api/useMessageApi";
import { useRouter, useSearchParams } from "next/navigation";
import { SocketContext } from "providers/socket.context";
import { useContext, useEffect, useState } from "react";
import { agentReadWriteAtom } from "store/atoms/agent-atom";
import { threadReadWriteAtom } from "store/atoms/threads";


interface ThreadInterface {
    id: string;
    threadName: string;
    propertyId: string;
    buyerAgentId: string;
    sellerAgentId: string;
    unreadCount: number;

}
const MessageBox = () => {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const params = useSearchParams()
    const { socket, state, setState } = useContext(SocketContext)
    const [, setThreadState] = useAtom(threadReadWriteAtom);
    const [loading, setLoading] = useState(false);
    const [threads, setThreads] = useState<ThreadInterface[] | []>([]);
    const [isRead, setIsRead] = useState(true);
    const [search, setSearch] = useState("");
    const [threadParticipants, setThreadParticipant] = useState<any>([])

    const { getAllUserAgentThreadsMutation, getAllThreadsByUserAgentMutation } = useUserAgentMessageApi()

    const [agentData] = useAtom(agentReadWriteAtom);
    const userData: any = agentData.user;

    const getAllUserAgentMessageThreadsByUser = async () => {
        try {
            setLoading(true);
            setThreads([]);
            const data = {
                userId: userData?.id,
                threadName: search,
                isRead: isRead
            }
            getAllThreadsByUserAgentMutation.mutate(data, {
                onSuccess: (data) => {
                    setThreadState({ messageThread: data?.data?.get_user_and_agent_threads })
                    setLoading(false);
                },
                onError: (error) => {
                    console.log("Error in mutation: ", error);
                    setLoading(false);
                },
            })
        } catch (error) {
            console.log("error : ", error);
        }
    }
    useEffect(() => {
        getAllUserAgentMessageThreadsByUser()
    }, [isRead, search, userData])

    useEffect(() => {
        return () => {
            setState((prev: any) => ({
                ...prev,
                selectedChannel: {
                    id: null,
                    propertyName: ""
                }
            }))
            setThreadState({ messageThread: null })
        }
    }, []);

    return <>
        <MessageBoxComponent
            loading={loading}
            threads={threads}
            search={search}
            setSearch={setSearch}
            isRead={isRead}
            setIsRead={setIsRead}
        />
    </>
};

export default MessageBox