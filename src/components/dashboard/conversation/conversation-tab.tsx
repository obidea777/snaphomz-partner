'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Dot, EllipsisVertical, Loader2, Paperclip, X } from 'lucide-react'
import Link from 'next/link'
import PropertyThreadList from './agent-property-thread-list'
import MessageSkeleton from './message-skeleton'
import { Button } from 'components/common/buttons/Button'
import { SearchInput } from 'components/common/inputs/SearchInput'
import socket from 'lib/socket'
import AgentPropertyList from './agent-property-list'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import {
  useGetConnectedAgentMessageThreads,
  useGetConnectedUserAgents
} from 'hooks/useGetConnectedAgents'
import CustomAvatar from 'components/ui/avatar'
import { getInitials } from 'utils/styleUtilities'
import Image from 'next/image'

export default function ConversationTab() {
  const [activeProperty, setActiveProperty] = useState<Property | null>(null)
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [conversationId, setConversationId] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [statusMessage, setStatusMessage] = useState('')
  const [sendingMessage, _] = useState(false)
  const [agentState] = useAtom(agentReadWriteAtom)
  const { user } = agentState

  // Custom hooks
  const { data: connectedAgentsData, isLoading: agentsLoading } =
    useGetConnectedUserAgents()

  const { data: messageThreads, isLoading: threadsLoading } =
    useGetConnectedAgentMessageThreads(user?.id || '')
  const connectedAgents: any = connectedAgentsData

  const filteredAgents = connectedAgents?.filter((chat: any) =>
    chat?.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // console.log(connectedAgents?.find(agent => agent.id === messageThreads[0]?.participants?.find((part:string) => part != user?.id)) )
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = async () => {
    if (
      (newMessage.trim() !== '' || selectedFiles.length > 0) &&
      conversationId
    ) {
      let fileUrls: string[] = []

      // if (selectedFiles.length > 0) {
      //   fileUrls = await uploadFiles(selectedFiles);
      // }

      if (newMessage.trim() !== '' || fileUrls.length > 0) {
        // sendMessage({
        //   message: messageId,
        //   content: newMessage,
        //   documents: fileUrls.length > 0 ? fileUrls : undefined,
        // });


        sendMessage()

        setNewMessage('')
        setSelectedFiles([])
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }

        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
          100
        )
      }
    }
  }

  const sendMessage = () => {
    if (conversationId && newMessage.trim()) {
      socket.emit(
        'sendMessage',
        { conversationId, message: newMessage, userId: user?.id },
        (response: any) => {
          if (response.status === 'success') {
            setNewMessage('')
          }
          setStatusMessage(response.message)
        }
      )
    }
  }

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files
      if (files) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)])
      }
    },
    []
  )

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }, [])

  const uploadToPresignedUrl = async ({
    file,
    presignedUrl
  }: {
    file: File
    presignedUrl: string
  }) => {
    const response = await axios.put(presignedUrl, file, {
      headers: { 'Content-Type': file.type }
    })
    return response.data
  }

  const uploadFiles = async (files: File[]) => {
    console.log(files)
  }

  const handlePropertySelect = useCallback((property: any, agent: any) => {
    setActiveProperty(property)
    setActiveAgent(agent)
    setMessages([])
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }),
      100
    )
  }, [])


  useEffect(() => {
    const fetchedMessages =
      messageThreads?.find((thread: any) => thread?._id === conversationId)
        ?.messages || []
    setMessages(fetchedMessages)
  }, [conversationId])

  // Listen for new messages
  useEffect(() => {
    socket.on('newMessage', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // Cleanup
    return () => {
      socket.off('newMessage')
    }
  }, [])

  console.log(messages)
  // Render helpers
  const renderMessageContent = (message: Message) => 
  
    {
      return(
        <div
        className={`rounded-xl text-white p-4 py-3 shadow-sm font-satoshi ${
          message?.sender === user?.id
            ? ' bg-black text-white '
            : 'bg-white text-black'
        }
        `}>
        <p className="whitespace-pre-wrap break-words text-sm font-normal">
          {message.content}
        </p>
        {message.documents && message.documents.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-500">Attached files:</p>
            {message.documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-500 hover:underline">
                Attachment {index + 1}
              </a>
            ))}
          </div>
        )}
      </div>
      )

    }
   

  

  // if (agentsLoading) return <MessageSkeleton />;
  return (
    <section className="pt-20 border-t ">
      <section className="grid grid-cols-10 mt-4 border-top bg-white min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-hidden mr-3">
        {/* Sidebar */}
        <div className="col-span-3">
          <section className="h-full rounded-tl-xl">
            <section className="p-3 px-6 border-b">
              <p className="text-[18px] font-medium">Message</p>
            </section>

            {/* <SearchInput
          inputClassName='rounded-tl-xl '
          label='Search message or people'
          placeholder='Search message or people'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        /> */}
            <div className="space-y-3 py-2">
              {/* <div className='flex justify-end'>
            <Bell className='h-8 w-8' />
          </div> */}

              <div className="h-full flex flex-col  overflow-scroll  transition-all duration-100 scrollbar-thumb-[#E8804C]">
                {messageThreads?.length > 0 &&
                  messageThreads
                    ?.slice()
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .map((thread: any) => (
                      <PropertyThreadList
                        key={thread._id}
                        agent={connectedAgents?.find(
                          (agent: any) =>
                            agent.id ===
                            thread?.participants?.find(
                              (part: string) => part != user?.id
                            )
                        )}
                        propertyId={thread?.propertyId}
                        timeStamp={thread?.updatedAt}
                        lastMessage={thread?.lastMessage}
                        onPropertySelect={handlePropertySelect}
                        setConversationId={setConversationId}
                        setStatusMessage={setStatusMessage}
                        activeAgent={activeAgent}
                      />
                    ))}
                {/* {filteredAgents?.length > 0 ? (
             <>
              {filteredAgents?.map((chat:any) => (
                <AgentPropertyList
                  key={chat._id}
                  agent={chat}
                  properties={chat?.properties}
                  onPropertySelect={handlePropertySelect}
                  setConversationId={setConversationId}
                  setStatusMessage={setStatusMessage}
                  activeAgent={activeAgent}
                />
              ))}
            </>
          ) : (
            <div className='flex h-[400px] justify-center pt-[7.7rem]'>
              <p className='text-lg font-bold'>No users found!</p>
            </div>
          )} */}
              </div>
            </div>
          </section>
        </div>

        {/* Main content */}
        <div className="col-span-7 flex bg-slate-50 flex-col">
          <div className="flex h-full flex-col rounded-br-lg rounded-tr-lg border-l-[.5px] border-grey-670 bg-grey-190">
            {/* Message display area */}
            <div className="relative h-[400px]  flex-grow pb-6">
              {!activeProperty ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-center text-lg">Select a property.</p>
                </div>
              ) : // ) : messagesLoading ? (
              //   <div className='flex h-full items-center justify-center'>
              //     <Loader2 className='animate-spin' />
              //   </div>
              messages && messages.length > 0 ? (
                <>
                  <div className="sticky top-0 z-10 py-1 flex  items-center justify-between border-b  bg-white px-4  font-bold">
                    <div className="flex gap-2">
                      <CustomAvatar
                        className="h-[2rem] w-[2rem] text-md text-white"
                        alt="avatar-image"
                        size={'2.8rem'}>
                        {getInitials(
                          activeAgent?.firstName,
                          activeAgent?.lastName
                        ) || 'SH'}
                      </CustomAvatar>
                      <div className="flex flex-col gap-0">
                        <span className="text-sm ">
                          {activeAgent?.firstName} {activeAgent?.lastName}
                        </span>
                        <span className="flex text-xs items-center font-normal -mt-1">
                          Online
                          <Dot color="green" />
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Image
                        src="https://ssl.cdn-redfin.com/photo/595/mbphotov2/22C/genMid.BB7F4F02C22C_1_0.jpg"
                        className=" rounded-md"
                        alt="avatar-image"
                        width={50}
                        height={30}
                      />
                      <div className="flex flex-col gap-0">
                        <span className="text-sm ">Bakers Street</span>
                        <span className="flex text-xs items-center font-normal -mt-1">
                          California
                        </span>
                      </div>

                      <EllipsisVertical />
                    </div>

                    {/* <Link
                                            href={`/dashboard/buyer/property/${activeProperty._id}`}
                                            className='font-bold text-[#E8804C]'
                                        >
                                            View Property
                                        </Link> */}
                  </div>
                  <div className="h-full pb-10 overflow-scroll transition-all duration-100 scrollbar-thumb-[#E8804C]">
                    {messages
                      .slice()
                      .sort(
                        (a: Message, b: Message) =>
                          new Date(a.timestamp).getTime() -
                          new Date(b.timestamp).getTime()
                      )
                      .map((message: Message) => (
                        <div
                          key={message._id}
                          className={`font-satoshi flex flex-col px-8 pt-6 ${
                            message?.sender === user?.id
                              ? 'items-end  '
                              : 'items-start'
                          }`}>
                          <div className="flex flex-col gap-1">
                            {renderMessageContent(message)}
                            <p className="mt-1 text-right text-[10px] text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="font-bold">
                    Send a message to start a conversation
                  </p>
                </div>
              )}
            </div>

            {/* Message input area */}
            {activeProperty && (
              <div className="relative  items-center shadow-md mb-4 rounded-full flex items-center mx-4 bg-white px-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="h-10 w-full flex-grow resize-none py-2  pr-20 focus:outline-none"
                  placeholder="Type a message..."
                  style={{ lineHeight: '1.2rem' }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <div className="absolute   right-0 flex h-full items-center pr-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <Button
                    className="bg-transparent px-4 text-black hover:bg-transparent"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!activeProperty || isUploadingFile}>
                    <Paperclip />
                  </Button>
                  {selectedFiles.length > 0 && (
                    <div className="mr-2 flex flex-wrap items-center">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="mr-2 flex items-center rounded-full bg-gray-200 px-2 py-1 text-sm">
                          <span className="max-w-[100px] truncate">
                            {file.name}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="ml-1 text-gray-500 hover:text-gray-700">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    className="h-10 uppercase"
                    onClick={handleSendMessage}
                    disabled={
                      !activeProperty ||
                      // sendingMessage ||
                      isUploadingFile ||
                      newMessage.trim() === ''
                    }>
                    {sendingMessage || isUploadingFile ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}
