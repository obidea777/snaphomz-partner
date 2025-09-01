'use client';

import { Pagination } from "@mantine/core";
import { success } from "components/alert/notify";
import { useAtom } from "jotai";
import { usePropertyServiceAPI } from "lib/api/property";
import { usePartnerPropertyInviteRequests, useUserAgentMessageApi } from "lib/api/useMessageApi";
import { encryptMessage } from "lib/math-utilities";
import { useRouter } from "next/navigation";
import { SocketContext } from "providers/socket.context";
import React, { useContext, useEffect, useState } from "react";
import { agentReadWriteAtom } from "store/atoms/agent-atom";
import { v4 as uuidv4 } from 'uuid';

const PENDINGRequests: React.FC = () => {
  const router = useRouter()
  const [inviteRequests, setInviteRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<"PENDING" | "ACCEPTED" | "REJECTED">("PENDING");
  const [agentData] = useAtom(agentReadWriteAtom);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState<"PENDING" | "ACCEPTED" | "REJECTED">("PENDING");
  const { socket, state, setState } = useContext(SocketContext)
  const [page, setPage] = useState<number>(1)
  const requests = [
    {
      id: 1,
      name: "Katherine Paul",
      role: "buyer",
      address: "94040 San Antonio 61 Sheffield Court",
      avatar: "/user1.jpg", // Use actual image URL or initials
    },
    {
      id: 2,
      name: "Scarlett Johnson",
      role: "seller",
      address: "94040 San Antonio 61 Sheffield Court",
      avatar: "SJ",
    },
    {
      id: 3,
      name: "Blake Hamilton",
      role: "buyer",
      address: "94040 San Antonio 61 Sheffield Court",
      avatar: "BH",
    },
  ];
  const {updatePartnerPropertyInviteRequest} = useUserAgentMessageApi()
  const {data:partnerInvites} = usePartnerPropertyInviteRequests()

 
  const updateInvitation = (id: string, status: string, threadId:string) => {
    const payload = {
      id,
      status,
      threadId,

    }
    console.log(payload)
    updatePartnerPropertyInviteRequest.mutate(payload, {
      onSuccess: (response) => {
        // setLoading(false)
        // setSelectedRequest(null)
        // setSelectedRequestType(null)
        // success({message: `Invitation ${invitationType} successfully`})
        // const payload = {
        //   propertyName:data?.engagement?.propertyName,
        //   agentName:`${agentData?.user?.firstName} ${agentData?.user?.lastName}`,
        //   status:invitationType,
        //   userId:data?.userId
        // }
        // if(socket){
        //   socket.emit('invitation_update',payload);
        // }
        
      },
      onError: (error) => {
        console.log('Error in mutation: ', error)
        setLoading(false)
      }
    })
  }

  console.log(inviteRequests, console.log(partnerInvites))

  // useEffect(() => {
  //   if (agentData?.user?.id) {
  //     getInvitationRequests()
  //   }
  // }, [agentData, filter])

  const indexOfLastProperty = page * 5
  const indexOfFirstProperty = indexOfLastProperty - 5
  const currentInviteRequest = partnerInvites?.slice(indexOfFirstProperty, indexOfLastProperty)

  return (
    <div className=" p-6 rounded-lg  w-full  mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">PENDING Request</h2>
        <span className="bg-orange-500 text-white px-2 py-1 text-sm rounded-full">
          {requests.length}
        </span>
      </div>
      <div className="flex mt-4 justify-start space-x-4 mb-6">
        {["PENDING", "ACCEPTED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-1 rounded-full border ${filter === status
              ? "bg-black text-white"
              : "border-black text-black hover:bg-gray-100"
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>
      {/* Request List */}
      <div className="mt-4 space-y-4 min-h-[200px]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
          </div>
        ) : partnerInvites?.length ? (
          currentInviteRequest?.slice()?.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
            >
              {/* Left Side */}
              <div className="flex items-center space-x-4">
                {req?.user?.image ? (
                  <img src={req?.user?.image} alt={req?.user?.firstName} className="w-10 h-10 rounded-full" />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold rounded-full">
                    {`${req?.createdBy?.firstName?.charAt(0).toUpperCase()}${req?.createdBy?.lastName?.charAt(0).toUpperCase()}`}
                  </div>
                )}

                <div>
                  <p className="text-sm">
                    <strong>{req?.createdBy?.firstName} {req?.createdBy?.lastName} </strong> has invited you to engage this property as a{" "}
                    <span className="font-semibold">Buyer agent.</span>
                  </p>
                  <p className="text-xs text-gray-500">{req?.address}</p>
                  <a href="#" className="text-orange-500 text-sm">
                    View Property
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              {
                req?.status==="PENDING"? <div className="flex space-x-2">
                <button 
                  className="bg-black text-white px-4 py-1 rounded-md"
                  disabled={req?.id === selectedRequest && selectedRequestType === "ACCEPTED"}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedRequest(req.id);
                    updateInvitation(req.id, "ACCEPTED",req.threadId)
  
                  }}>
                  Accept
                </button>
                <button 
                className="border border-black text-black px-4 py-1 rounded-md"
                disabled={req?.id === selectedRequest && selectedRequestType==="REJECTED"}
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedRequest(req.id);
                    updateInvitation(req.id, "REJECTED",req?.threadId)
                  }}
                >
                  Decline
                </button>
              </div>:null
              }
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No {filter} requests.</p>
        )}
               <Pagination
        value={page}
        onChange={setPage}
        total={Math.ceil(inviteRequests.length / 5)}
        color="orange"
        size='lg'
        boundaries={0}
        radius={'xl'}
        mb={24}
      />

      </div>


      
    </div>
  );
};

export default PENDINGRequests;
