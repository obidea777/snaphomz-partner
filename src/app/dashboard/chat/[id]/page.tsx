'use client';

import ChatBoxComponent from "components/dashboard/chat-box/chat-box";
import { useAtom } from "jotai";
import { useAgentConversationApi } from "lib/api/useConversationApi";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
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
    const params = useParams()
    const id = params?.id
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [threads, setThreads] = useState<ThreadInterface[] | []>([]);
    const [isRead, setIsRead] = useState(true);
    const [threadData,setThreadData] = useState<ThreadInterface| null>(null)
    const [search, setSearch] = useState("");
    const [agentData] = useAtom(agentReadWriteAtom);
    const {
        getAllThreadsMutation,
        getAllThreadsByUserMutation,
        getAllThreadByIdMutation
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
                userId: userData?.id,
                threadName: search,
                isRead: isRead
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

    const getThreadById = async()=>{
        try{
            getAllThreadByIdMutation.mutateAsync(""+id,{
                onSuccess:(response:any)=>{
                    setThreadData(response?.data?.get_threads_by_id)
                }
            })
        }catch(error){
            console.log(error);
            
        }
    }

    useEffect(() => {
        if (agentData.is_authenticated) {
            getAllConversationThreadsByUser()
        }
    }, [isRead, search, agentData])

    useEffect(()=>{
        if(id){
            getThreadById()
        }
    },[id])
    return <>
        <ChatBoxComponent
            threadData={threadData}
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