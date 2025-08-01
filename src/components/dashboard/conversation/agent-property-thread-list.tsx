import React, { useState } from 'react'
import ChatThread from './chat-thread'
import socket from 'lib/socket'
import { property } from './data'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'

interface AgentPropertyListProps {
  agent: Agent
  propertyId: string
  lastMessage: string
  timeStamp: string
  onPropertySelect: (property: any, agent: Agent) => void
  setConversationId: (id: any) => void
  setStatusMessage: (message: any) => void
  activeAgent: any
}

export default function PropertyThreadList({
  agent,
  propertyId,
  lastMessage,
  timeStamp,
  onPropertySelect,
  setConversationId,
  setStatusMessage,
  activeAgent
}: AgentPropertyListProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [agentState] = useAtom(agentReadWriteAtom)
  const { user } = agentState
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState('')

  const joinConversation = async (createConversationDto: any) => {
    socket.emit(
      'createOrJoinConversation',
      createConversationDto,
      (response: any) => {
        if (response.status === 'success') {
          setConversationId(response.data._id)
          setStatusMessage(response.message)
        } else {
          setStatusMessage(response.message)
        }
      }
    )
  }


  return (
    <div className="">
      <div
        className={` ${activeAgent?.id === agent?.id ? 'bg-slate-50' : ''}  flex cursor-pointer px-4 p-3 w-full  border-b items-center justify-between`}
        //onClick={() => setIsOpen(!isOpen)}
        onClick={() => {
          setSelectedAgent(agent?.id)
          setActivePropertyId(property[0].id)
          onPropertySelect(property[0], agent)
          joinConversation({
            propertyId: property[0].id,
            participants: [user?.id, agent?.id]
          })
        }}>
        <ChatThread
          firstname={agent?.firstName}
          lastname={agent?.lastName}
          propertyID={propertyId}
          timestamp={timeStamp}
          lastMessage={lastMessage}
          main={false}
        />
      </div>
    </div>
  )
}
