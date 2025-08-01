'use client';

import ChatBoxComponent from "components/dashboard/chat-box/chat-box";
import { useAtom } from "jotai";
import { useAgentConversationApi } from "lib/api/useConversationApi";
import { useRouter } from "next/navigation";
import { SocketContext } from "providers/socket.context";
import { use, useContext, useEffect, useState } from "react";
import { agentReadWriteAtom } from "store/atoms/agent-atom";

interface ThreadInterface {
    id: string;
    threadName: string;
    propertyId: string;
    buyerAgentId: string;
    sellerAgentId: string;
    unreadCount: number;

}
const ChatBox = () => {
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const { socket, state, setState } = useContext(SocketContext)
    const [loading, setLoading] = useState(false);
    const [threads, setThreads] = useState<ThreadInterface[] | []>([]);
    const [isRead, setIsRead] = useState(true);
    const [search, setSearch] = useState("");
    const [agentData] = useAtom(agentReadWriteAtom);
    const {
        getAllThreadsMutation,
        getAllThreadsByUserMutation
    } = useAgentConversationApi()
    const userData = agentData.user;    
    const getAllConversationThreads = async () => {
        try {
            getAllThreadsMutation.mutate(null, {
                onSuccess: (data) => {
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

    const getAllConversationThreadsByUser = async () => {
        try {
            setLoading(true);
            setThreads([]);
            const data = {
                userId:userData?.id,
                threadName:search,
                isRead:isRead
            }
            getAllThreadsByUserMutation.mutate(data, {
                onSuccess: (data) => {
                    setThreads(data?.data?.get_threads_by_user)
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


    // useEffect(() => {
    //     if (socket) {
    //       // Join all threads when the thread list is fetched
    //       threads.forEach((thread: ThreadInterface) => {
    //         socket.emit('joinThread', thread.id);
    //       });
    //     }
    //   }, [socket, threads]);

    useEffect(() => {
        if(agentData.is_authenticated){
            getAllConversationThreadsByUser()
        }
    }, [isRead,search,agentData])

    
    return <>
        <ChatBoxComponent
            loading={loading}
            threads={threads}
            search={search}
            setSearch={setSearch}
            isRead={isRead}
            setIsRead={setIsRead}
        />
    </>
};

export default ChatBox;