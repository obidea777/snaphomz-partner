'use client';

import { ReactNode, useState, createContext, useEffect, useContext } from "react";
import { Socket, io as socketio } from "socket.io-client";
import IdleTimeout from "./IdleTimeout";
import NewNotification from "components/dashboard/chat-box/notification-bar";
import { useAtom } from "jotai";
import { agentReadWriteAtom } from "store/atoms/agent-atom";
import { getAuthToken } from "lib/storage";
import { error, success } from "components/alert/notify";
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button } from "components/ui/button";
import Modal from "components/common/Modal";
import { usePropertyServiceAPI } from "lib/api/property";

type SocketContextType = {
  socket: Socket | null;
  state: typeof initialState;
  setState: React.Dispatch<React.SetStateAction<typeof initialState>>;
};

export const initialState = {
  isReadThreadId: null,
  notification: {
    user: null,
    property: null,
    message: "",
    channelId: null,
    isVisible: false
  },
  newMessage: null,
  selectedChannel: {
    id: "",
    propertyName: '',
  },
  messageUnreadCount: [],
  conversationUnreadCount: [],
};

interface PropertyRequestData {
  id?: string;
  propertyImage?: string;
  propertyName?: string;
  propertyAddress?: string;
  userName?: string;
  userEmail?: string;
}

interface PropertyRequestContextType {
  showPropertyRequest: (propertyData: any, userData: any) => void;
  closePropertyRequest: () => void;
  isVisible: boolean;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  state: initialState,
  setState: () => {},
});

const PropertyRequestContext = createContext<PropertyRequestContextType>({
  showPropertyRequest: () => {},
  closePropertyRequest: () => {},
  isVisible: false,
});

export const usePropertyRequest = () => useContext(PropertyRequestContext);

const getInitials = (name?: string) => {
  return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "";
};

export default function SocketProvider({ children }: { children: ReactNode }) {
  const SOCKET_URL = process.env.NEXT_PUBLIC_AUTH_SERIVCE_SOCKET_URL || "http://localhost:4000";
  const [agentData] = useAtom(agentReadWriteAtom);
  const [state, setState] = useState(initialState);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requestData, setRequestData] = useState<PropertyRequestData | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateAgentInvitations } = usePropertyServiceAPI();

  const token = getAuthToken() || localStorage.getItem("userAccessToken");
  const user = agentData.user;
  const isLogin = agentData.is_authenticated;

  const showPropertyRequest = (propertyData: any, userData: any) => {
    setRequestData({
      id: propertyData?.id,
      propertyImage: propertyData?.media?.primaryListingImageUrl || "/placeholder.jpg",
      propertyName: propertyData?.courtesyOf || "Property Name",
      propertyAddress: propertyData?.address?.unparsedAddress || "Property Address",
      userName: `${userData?.firstName || ""} ${userData?.lastName || ""}`,
      userEmail: userData?.email || "user@example.com"
    });
    setShowModal(true);
  };

  const closePropertyRequest = () => setShowModal(false);

  const updateInvitationRequests = (type: string) => {
    setLoading(true);
    updateAgentInvitations.mutate({
      agentId: agentData.user?.id,
      invitationType: type,
      id: requestData?.id,
    }, {
      onSuccess: () => {
        success({ message: `Invitation ${type} successfully` });
        setShowModal(false);
        setLoading(false);
      },
      onError: () => {
        error({ message: `Failed to ${type} invitation` });
        setShowModal(false);
        setLoading(false);
      }
    });
  };

  // Connect socket once token is available
  useEffect(() => {
    if (isLogin && token && !socket) {
      const newSocket = socketio(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 20,
        forceNew: true,
        transports: ['websocket', 'polling'],
        auth: { token: `Bearer ${token}` },
      });

      setSocket(newSocket);
      newSocket.emit("userConnected", user?.id);

      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [isLogin, token]);

  useEffect(() => {
    if (!socket) return;

    socket.on("thread_marked_as_read", ({ threadId }) => {
      setState(prev => ({ ...prev, isReadThreadId: threadId }));
    });

    socket.on("recievedMessage", (newMessage: any) => {
      if (newMessage?.threadId !== state.selectedChannel?.id) {
        setState(prev => ({
          ...prev,
          conversationUnreadCount: [
            ...prev.conversationUnreadCount,
            {
              threadId: newMessage.threadId,
              count: (prev.conversationUnreadCount.find((c: any) => c.threadId === newMessage.threadId)?.count ?? 0) + 1
            }
          ],
          notification: {
            user: newMessage?.user?.userName,
            property: newMessage?.property?.propertyName,
            message: newMessage?.message,
            channelId: newMessage?.threadId,
            isVisible: true,
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          newMessage,
        }));
      }
    });

    socket.on("request_recieved", (data: any) => {
      showPropertyRequest(data?.property, data?.user);
    });

    return () => {
      socket.off("thread_marked_as_read");
      socket.off("recievedMessage");
      socket.off("request_recieved");
    };
  }, [socket, state.selectedChannel]);

  return (
    <SocketContext.Provider value={{ socket, state, setState }}>
      <IdleTimeout timeout={600000}>{children}</IdleTimeout>
      <NewNotification state={state} socket={socket} setState={setState} />
      {showModal && requestData && (
        <Modal closeModal={closePropertyRequest} isOpen={showModal} useChildStyle>
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden">
            <div className="relative w-full h-48">
              <Image
                src={requestData.propertyImage || "/placeholder.jpg"}
                alt={requestData.propertyName || ""}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-1 mb-4 text-gray-600">
                <LocationOnIcon className="text-gray-500 text-sm" />
                <h2 className="text-xl font-bold mb-1">{requestData.propertyAddress}</h2>
              </div>
              <div className="border-t border-b py-4 my-4">
                <h3 className="font-semibold mb-2">User Information</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">{getInitials(requestData.userName)}</span>
                  </div>
                  <div>
                    <p className="font-medium">{requestData.userName}</p>
                    <p className="text-sm text-gray-500">{requestData.userEmail}</p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                This user is requesting access to view this property. Do you want to approve or reject?
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50" disabled={loading} onClick={() => updateInvitationRequests("rejected")}>
                  Reject
                </Button>
                <Button className="bg-orange-600 text-white hover:bg-green-700" disabled={loading} onClick={() => updateInvitationRequests("accepted")}>
                  Accept
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </SocketContext.Provider>
  );
}
