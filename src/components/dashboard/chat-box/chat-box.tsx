"use client"

import Image from "next/image"
import {
  ChevronLeft,
  Search,
  HandHelpingIcon as Help,
  MoreVertical,
  Send,
  Star,
  Wifi,
  CookingPotIcon as Kitchen,
  Car,
  Wind,
  Maximize2,
  X,
  MessageCircle,
  Paperclip,
  Download,
  FileText,
  FolderOpenDot,
  Plus,
  Smile,
  CheckCheck,
  Check,
  CircleCheck,
  Play,
  Maximize,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  View,
  Eye,
} from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import KingBedIcon from "@mui/icons-material/KingBed"
import BathtubIcon from "@mui/icons-material/Bathtub"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "components/ui/dialog"
import { format, isSameDay, subDays } from "date-fns"
import { initialState, SocketContext } from "providers/socket.context"
import { FaHome, FaMapMarkerAlt } from "react-icons/fa"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { error, success } from 'components/alert/notify';
import { ScrollArea } from "components/ui/scroll-area"
import { Badge } from "components/ui/badge"
import useDebounce from "lib/debounce"
import { useAgentConversationApi } from "lib/api/useConversationApi"
import { decryptMessage, encryptMessage } from "lib/math-utilities"
import { useAtom } from "jotai"
import { agentReadWriteAtom } from "store/atoms/agent-atom"
import { propertyReadWriteAtom } from "store/atoms/property"
import Modal from "components/common/Modal"
import EmojiPicker from "emoji-picker-react"
import { v4 as uuidv4 } from 'uuid';
import FaqBuyerModal from "../faq-buyer-modal"
import FaqSellerModal from "../faq-seller-modal"
import { useFAQApi } from "lib/api/useFAQApi"
import { Loader } from "@mantine/core"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "components/ui/accordion"
import { usePropertyServiceAPI } from "lib/api/property"
import { useRepoManagementApi } from "lib/api/useRepoManagement"
import { claimPropertyAtom } from "hooks/claimPropertyAtom"

interface User {
  id: string
  username: string
  message: string
  image: string
}
interface Message {
  id: string;
  isRead?: boolean;
  threadId: string
  message: string;
  senderId: string
  receiverId: string
  createdAt?: string
  seen?: boolean
  messageType?: string;
  fileType?: string
  parentMessageId?: string | null
  file?: {
    name?: string
    url?: string
    type?: string
  }
}

interface Thread {
  id: string
  propertyOwnerId: string;
  listingId?: string;
  threadName?: string
  image?: string;
  propertyName?: string;
  message?: string
  lastSeen?: string
  unreadCount?: number
  propertyAddress?: string
  propertyId?: string
  buyerAgent?: {
    id?: string
    firstName?: string
    lastName?: string
  }
  sellerAgent?: {
    id?: string
    firstName?: string
    lastName?: string
  }
  lastMessage?: string
  lastMessageAt?: string | null
  isTyping?: boolean
  members?: any[]
  threadId?: string | null
  isActive?: boolean
}
interface PropertyData {
  media?: {
    primaryListingImageUrl?: string
  }
  listingId?: string
  property?: {
    bathroomsTotal?: number
    bedroomsTotal?: number
  }
  address?: {
    unparsedAddress?: string
  }
  courtesyOf?: string
  publicRemarks?: string
}

// Update the interface for the MediaPreview type
export interface MediaPreview {
  type: string;
  url: string;
  name?: string;
  loaded?: boolean;
  loading?: boolean;
  error?: boolean;
}

interface BuyerQuestionInterface {
  id: string;
  question: string;
  answer: string;
  user: {
    image?: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }
}

export default function ChatBoxComponent(props: any) {
  const { threads, setIsRead, setSearch, loading } = props
  const router = useRouter()
  const { socket, state, setState } = useContext(SocketContext)
  const [isDetails, setIsDetails] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeButton, setActiveButton] = useState("all")
  const [message, setMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [fileErrorMsg, setFileErrorMsg] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<Thread | null>(null)
  const [agentData] = useAtom(agentReadWriteAtom);
  const [receiverId, setRecieverId] = useState<string>("")
  const [messageLoading, setMessageLoading] = useState(false)
  const [showThreads, setShowThreads] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showDetails, setShowDetails] = useState(false) // Added state variable
  const [propertyData, setPropertyData] = useState<any>(null)
  const [allMessages, setAllMessages] = useState<Message[]>([])
  const [selectedThread, setSelectedThread] = useState('');
  const [conversationLoading, setConversationLoading] = useState(false)
  const debounce = useDebounce()
  const imageTypes = ["image/jpeg", "image/png", "image/jpg"]
  const videoTypes = ["video/mp4", "video/webm", "video/ogg"]
  const allowedFileTypes = [...imageTypes, ...videoTypes, "application/pdf"]
  const [userDetails, setUserDetails] = useState(null);
  const {
    getAllConversationMessagesMutation,
    addParticipant,
    searchMessages
  } = useAgentConversationApi()
  const userData = agentData.user;
  const scrollContainerRef = useRef(null);
  const PROPERTY_DETAIL_SEARCH_AI_URL = process.env.NEXT_PUBLIC_AI_BACKEND_BASE_URI || "https://preprod-ai.snaphomz.com"
  const [email, setEmail] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [firstTime, setFirstTime] = useState(true)
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef(null);
  const [showNewMessageTag, setShowNewMessageTag] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [allMediaFiles, setAllMediaFiles] = useState<{ type?: string, url?: string, name?: string }[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [buyerFaqQuestions, setBuyerFaqQuestions] = useState<BuyerQuestionInterface[]>([])
  const [sellerFaqQuestions, setSellerFaqQuestions] = useState<BuyerQuestionInterface[]>([])
  const [inviteOpen, setInviteOpen] = useState(false);
  const [currentThread, setCurrentThread] = useState<Thread>()
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const endMessageRef = useRef<HTMLDivElement>(null);
  const [currentUser] = useAtom(agentReadWriteAtom);
  const { getAllFaqsByUserMutation } = useFAQApi(() => {
    setIsModalOpen(false);
  });
  const imageMimeType = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/svg+xml",
    "image/tiff",
    "image/x-icon",
    "image/heic",
    "image/heif",
  ]
  const videoMimeType = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/x-matroska",
    "video/3gpp",
    "video/mp2t",
    "video/x-m4v",
  ]
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const { uploadNewFile } = usePropertyServiceAPI()
  const { createRepoWithUploadedFile } = useRepoManagementApi()
  const [currentProperty] = useAtom(claimPropertyAtom)
  const toggleAnswer = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };
  const toggleUploadMenu = () => {
    setShowUploadMenu((prev) => !prev);
  };
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  const handleThreadSelection = (thread: Thread) => {
    setCurrentThread(thread)
    if (socket) {
      socket.emit('mark_as_read', { threadId: thread?.id })
    }
    if (selectedThread === thread?.id) {
      return null;
    }
    setIsDetails(false)
    setSelectedThread(thread?.id);
    // setSelectedThread("")
    setShowThreads(false)
    setShowChat(true)
    setPage(1)
    if (userData?.id === thread?.buyerAgent?.id) {
      setRecieverId(thread?.sellerAgent?.id || "")
      setUserDetails(thread?.sellerAgent)
    } else {
      setUserDetails(thread?.buyerAgent)
      setRecieverId(thread?.buyerAgent?.id || "")
    }
    getAllConversationThreads(thread?.id)
    getPropertyDetails(thread.propertyId, thread?.listingId)
    setState((prev: any) => ({
      ...prev,
      selectedChannel: {
        id: thread?.id,
        propertyName: thread.propertyName,
      }
    }))
  }
  const handleBackToThreads = () => {
    setShowThreads(true)
    setShowChat(false)
    setSelectedChannel(null)
  }
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  const typing = useCallback(
    debounce((id) => {
      if (socket) {
        socket.emit("typing", { user: "username", typing: false, recipient: id })
      }
    }, 2000),
    [],
  )
  const getAllConversationThreads = async (threadId: string) => {
    try {
      setConversationLoading(true);
      setAllMessages([]);
      getAllConversationMessagesMutation.mutate(threadId, {
        onSuccess: (data) => {
          const messages = data?.data?.conversationsByThread || [];
          const decryptedMessages = messages?.map((message: Message) => {
            const decryptedMessage = decryptMessage(message.message);
            return {
              ...message,
              message: decryptedMessage,
            };
          });
          setAllMessages(decryptedMessages || []);
          setConversationLoading(false);
        },
        onError: (error) => {
          console.log("Error in mutation: ", error);
          setConversationLoading(false);
        },
      });
    } catch (error) {
      console.log("error : ", error);
      setConversationLoading(false);
    }
  };
  const handleSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
      searchMessaages(value)
    }, 1000),
    [],
  )
  const handleTyping = (status: boolean) => {
    if (socket) {
      socket.emit("typing", { user: "username", typing: status, recipient: receiverId })
      setTimeout(() => {
        socket.emit("typing", { user: "username", typing: false, recipient: receiverId })
      }, 1000);
      typing(receiverId)
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      setFileErrorMsg("")
      setSelectedFile(null)

      const maxSize = 20 * 1024 * 1024

      if (!allowedFileTypes.includes(file.type)) {
        setFileErrorMsg("Invalid file type. Only JPG, PNG, MP4, WebM, OGG and PDF are allowed.")
        return
      }
      if (file.size > maxSize) {
        setFileErrorMsg("File size exceeds the 20MB limit.")
        return
      }

      setSelectedFile(file)
    }
  }

  const getPropertyDetails = async (id: any, listingId: any) => {
    try {
      setMessageLoading(true)
      setPropertyData(null)
      const payload = {
        propertyId: +id,
        listingId: +listingId,

      }
      const response = await fetch(`${PROPERTY_DETAIL_SEARCH_AI_URL}/api/get_data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      const data = await response.json()

      setPropertyData(data?.data)
      setMessageLoading(false)
      setShowDetails(true)
      return data
    } catch (error) {
      console.log("error : ", error)
    }
    setMessageLoading(false)
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    setMessage(value)

    if (!isTyping) {
      handleTyping(true)
    }

    if (value.trim() === "") {
      handleTyping(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  const getBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (file: File) => {
    try {
      const { key } = await uploadNewFile(file, currentUser.user?.id, currentThread?.propertyId);
      const payload = {
        uploadedFile: {
          fileName: file?.name,
          fileSize: file?.size,
          fileUrl: key,
          fileType: file?.type
        },
        createRepoManagementInput: {
          name: 'proof-document',
          url: '/proof-document',
          propertyId: currentThread?.propertyId,
          createdBy: userData.id,
          parentFolderName: 'proof-document',
          isArchived: false
        }
      };
      createRepoWithUploadedFile?.mutate(payload, {
        onSuccess: (data) => {
          console.log(data)
        },
        onError: (err) => {
          error({ message: err?.message || 'Upload failed' });
        },
      });
      return key;
    } catch (err: any) {
      console.error("File upload failed:", err);
      throw new Error('File upload failed');
    }
  };

  const handleSendMessage = async () => {
    try {

      if (message.trim() !== "" || selectedFile) {
        const encryptedMessage = encryptMessage(message)
        const newMessage = {
          id: uuidv4(),
          threadId: state?.selectedChannel.id || "",
          message: encryptedMessage,
          isRead: false,
          senderId: userData?.id,
          receiverId: receiverId,
          createdAt: new Date().toISOString(),
        } as Message;

        let fileData = null;

        if (selectedFile) {
          handleFileUpload(selectedFile)
          const base64Content = await getBase64(selectedFile);
          const fileType = selectedFile.type;
          fileData = {
            name: selectedFile.name,
            type: fileType,
            size: selectedFile.size,
            content: base64Content,
            sender: userData,
          };
          socket?.emit("save_file", fileData, (response: any) => {
            if (response?.success) {
              const message = encryptMessage(response.data.message);
              socket?.emit(
                "sendMessage",
                {
                  ...newMessage,
                  ...response?.data,
                  message
                },
                {
                  reciepent: receiverId,
                  userName: `${userData?.firstName} ${userData?.lastName}`,
                },
              );
              setTimeout(() => {
                setAllMessages((prev) => [
                  {
                    ...newMessage,
                    ...response?.data
                  },
                  ...prev,
                ]);
              }, 1000)
            }
          })
        }
        if (message.trim() !== "") {
          socket?.emit(
            "sendMessagetoThread",
            {
              ...newMessage,
              messageType: "text",
              fileType: "text",
            },
            {
              reciepent: receiverId,
              userName: `${userData?.firstName} ${userData?.lastName}`,
            },
          );
          setAllMessages((prev) => [{ ...newMessage, message }, ...prev]);
        }
        // if (messagesEndRef.current) {
        //   messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        // }

        setSelectedFile(null);
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setTimeout(() => {
      setFirstTime(false)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100)
    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  };

  const handleTrheadsName = (user: any) => {
    const str1 = "Byuer (" + user?.buyerAgent.firstName + " " + user?.buyerAgent.lastName + ")"
    const str2 = "Seller (" + user?.sellerAgent.firstName + " " + user?.sellerAgent.lastName + ")"
    return <>
      <h3 className="font-semibold text-sm sm:text-base truncate">{str1}</h3>
      <h3 className="font-semibold text-sm sm:text-base truncate">{str2}</h3>
    </>
  }

  const getAllFaqData = () => {
    getAllFaqsByUserMutation.mutate({ userId: currentThread?.propertyOwnerId, agentType: "BUYER_AGENT" }, {
      onSuccess: (response: any) => {
        setBuyerFaqQuestions(response)
      },
      onError: (err) => {
        console.log("Error : ", err);

      }
    })
  }

  const getAllSeelerFaqData = () => {
    getAllFaqsByUserMutation.mutate({ userId: "586a1ef1-86da-426d-8c67-50f3bd9bc51a", agentType: "SELLER_AGENT" }, {
      onSuccess: (response: any) => {
        setSellerFaqQuestions(response)
      },
      onError: (err) => {
        console.log("Error : ", err);

      }
    })
  }

  const searchMessaages = (message: string) => {
    console.log("Selected Thread : ", currentThread);

    searchMessages.mutate({
      threadId: currentUser?.user?.id,
      searchText: message,
    }, {
      onSuccess: (response: any) => {
        console.log("Response : ", response);

      }
    });
  }

  useEffect(() => {
    if (socket) {
      socket?.on('thread_marked_as_read', (data: any) => {
        if (selectedThread === data?.threadId) {
          // setAllMessages(allMessages);
          const updatedMessages = allMessages.map((msg) =>
            msg.isRead ? msg : { ...msg, isRead: true }
          );
          setAllMessages(updatedMessages);
        }
      })
      socket.on("recievedMessage", (newMessage: Message) => {
        setShowNewMessageTag(true)
        setAllMessages(prevMessages => [newMessage, ...prevMessages]);
      })
      socket.on("typingStatus", (typing: boolean) => {
        setIsTyping(typing)
      })
      const interval = setInterval(saveAllMessages, 5000);
      return () => {
        socket.off("recievedMessage")
        socket.off("thread_marked_as_read")
        clearInterval(interval);
        saveAllMessages();
      }
    }
    return () => {
      setState((prev: any) => ({
        ...prev,
        selectedChannel: {
          id: null,
          propertyName: ""
        }
      }))
    }
  }, [socket])

  useEffect(() => {
    if (state?.newMessage) {
      setShowNewMessageTag(true)
      setTimeout(() => {
        setAllMessages(prevMessages => [{
          ...state.newMessage,
          message: decryptMessage(state.newMessage.message),
        }, ...prevMessages]);
      }, 2000)
      setState((prev: any) => ({
        ...prev,
        newMessage: null
      }));
      if (socket) {
        socket?.on('thread_marked_as_read', (data: any) => {
          console.log("thread : ", data);
        })

        if (selectedThread === state?.newMessage?.threadId) {
          socket.emit('mark_as_read', { threadId: selectedThread })
        }
      }
    }
  }, [state.newMessage])

  useEffect(() => {
    if (state?.isReadThreadId === selectedThread) {
      const hasUnread = allMessages.some((msg) => !msg.isRead);
      if (!hasUnread) return;

      const updatedMessages = allMessages.map((msg) =>
        msg.isRead ? msg : { ...msg, isRead: true }
      );

      setAllMessages(updatedMessages);
    }
  }, [state?.isReadThreadId, selectedThread, allMessages]);


  const lightColors = ["bg-blue-200", "bg-green-200", "bg-red-200", "bg-yellow-200", "bg-purple-200"];

  const getStaticColor = (name: string) => {
    const index = name?.charCodeAt(0) % lightColors.length;
    return lightColors[index];
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase();
  };
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessages]);

  const saveAllMessages = () => {
    if (socket) {
      socket.emit("save_messages", (msg) => {
        console.log("Save message event called");
      });
    }
  }
  setTimeout(() => {
    if (messagesEndRef.current && firstTime) {
      setFirstTime(false)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 100)

  const extractMediaFiles = useCallback(() => {
    const mediaFiles = allMessages
      .filter(message =>
        (message.fileType && (
          (imageTypes.includes(message.fileType)) ||
          (message.fileType.startsWith('video/'))
        )) && message.message
      )
      .map(message => ({
        type: message.fileType,
        url: message.message,
        name: message.fileType.split('/')[1]
      }));

    setAllMediaFiles(mediaFiles as { type?: string, url?: string, name?: string }[]);
  }, [allMessages]);

  useEffect(() => {
    if (allMessages.length > 0) {
      extractMediaFiles();
    }
  }, [allMessages, extractMediaFiles]);

  const openMediaPreview = useCallback((fileUrl: string, fileType: string) => {
    if (fileUrl) {

      setMediaPreview({
        type: fileType || '',
        url: fileUrl,
        name: fileType.split('/')[1] || 'media',
        loading: true
      });

      if (fileType && imageMimeType.includes(fileType)) {
        if (fileUrl.startsWith('data:')) {
          setZoomLevel(1);
          setMediaPreview({
            type: fileType,
            url: fileUrl,
            name: fileType.split('/')[1] || 'media',
            loaded: true
          });
          return;
        }

        const img = document.createElement('img');
        img.crossOrigin = "anonymous";
        img.src = fileUrl;

        img.onload = () => {
          setZoomLevel(1);
          setMediaPreview({
            type: fileType,
            url: fileUrl,
            name: fileType.split('/')[1] || 'media',
            loaded: true
          });
        };

        img.onerror = (e) => {
          console.error("Failed to load image:", e);

          const imgFallback = document.createElement('img');
          imgFallback.src = fileUrl;

          imgFallback.onload = () => {
            setZoomLevel(1);
            setMediaPreview({
              type: fileType,
              url: fileUrl,
              name: fileType.split('/')[1] || 'media',
              loaded: true
            });
          };

          imgFallback.onerror = () => {
            console.error("All loading attempts failed for image");
            setMediaPreview({
              type: fileType,
              url: '/placeholder.jpg',
              name: fileType.split('/')[1] || 'media',
              loaded: false,
              error: true
            });
          };
        };
      } else {
        // For non-images, just set directly
        setZoomLevel(1);
        setMediaPreview({
          type: fileType || '',
          url: fileUrl,
          name: fileType.split('/')[1] || 'media',
          loading: false
        });
      }

      // Find index of the current media in the media files array
      const index = allMediaFiles.findIndex(mediaFile =>
        mediaFile.url === fileUrl
      );

      if (index !== -1) {
        setCurrentMediaIndex(index);
      }
    }
  }, [allMediaFiles, imageMimeType]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!mediaPreview) return;

      switch (e.key) {
        case 'Escape':
          closeMediaPreview();
          break;
        case 'ArrowRight':
          if (currentMediaIndex < allMediaFiles.length - 1) {
            goToNextMedia();
          }
          break;
        case 'ArrowLeft':
          if (currentMediaIndex > 0) {
            goToPrevMedia();
          }
          break;
        case '+':
        case '=':
          handleZoom(true);
          break;
        case '-':
          handleZoom(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mediaPreview, currentMediaIndex, allMediaFiles.length]);

  const goToNextMedia = () => {
    if (currentMediaIndex < allMediaFiles.length - 1) {
      const nextIndex = currentMediaIndex + 1;
      setCurrentMediaIndex(nextIndex);
      setZoomLevel(1);
      setMediaPreview({
        type: allMediaFiles[nextIndex].type || '',
        url: allMediaFiles[nextIndex].url || '',
        name: allMediaFiles[nextIndex].name
      });
    }
  };

  const goToPrevMedia = () => {
    if (currentMediaIndex > 0) {
      const prevIndex = currentMediaIndex - 1;
      setCurrentMediaIndex(prevIndex);
      setZoomLevel(1);
      setMediaPreview({
        type: allMediaFiles[prevIndex].type || '',
        url: allMediaFiles[prevIndex].url || '',
        name: allMediaFiles[prevIndex].name
      });
    }
  };

  const handleInvite = () => {
    const data = {
      threadId: selectedThread,
      email: email
    }
    addParticipant.mutateAsync(data, {
      onSuccess: (response: any) => {
        setInviteOpen(false)
        if (response?.success) {
          success({ message: response?.message })
        } else {
          error({ message: response?.message })
        }

      },
      onError: (err: any) => {
        console.log("error : ", err);
        // error({message: error})
        // error({ message: err });
      }
    })
  }
  const handleZoom = (zoomIn: boolean) => {
    if (zoomIn) {
      setZoomLevel(prev => Math.min(prev + 0.25, 3));
    } else {
      setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
    }
  };

  const closeMediaPreview = () => {
    setMediaPreview(null);
    setZoomLevel(1);
  };

  const handleControllerClick = (message) => {
    const element = messagesEndRef.current[message];
    console.log("Element : ", element);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    console.log("Controller clicked for message:", message.id);
  };

  const groupedMessages: { [date: string]: Message[] } = allMessages.reduce((acc: { [date: string]: Message[] }, message) => {
    const date = format(new Date(message?.createdAt), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(message);
    return acc;
  }, {});

  function isToday(date: Date): boolean {
    const today = new Date();
    return isSameDay(date, today);
  }

  function isYesterday(date: Date): boolean {
    const yesterday = subDays(new Date(), 1);
    return isSameDay(date, yesterday);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUploadMenu &&
        uploadMenuRef.current &&
        !uploadMenuRef.current.contains(event.target as Node)
      ) {
        setShowUploadMenu(false);
      }
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUploadMenu, showEmojiPicker]);


  useEffect(() => {
    return () => {
      setState(initialState)
    }
  }, [])

  useEffect(() => {
    endMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groupedMessages]);

  useEffect(() => {
    // if (currentThread?.propertyOwnerId) {
    //   getAllFaqData()
    //   getAllSeelerFaqData()
    // }
    if (props?.threadData) {
      handleThreadSelection(props?.threadData)
    }
  }, [props?.threadData, currentThread])

  return (
    <div className="mt-36 max-w-full overflow-hidden">
      <header className="border-b px-2 sm:px-4 py-2 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer sm:gap-4" onClick={() => router.back()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <span className="font-semibold text-sm sm:text-base">Back</span>
        </div>
        <div className="flex justify-center items-center w-full max-w-[65%] sm:max-w-xl">
          <div className="shadow relative flex w-full bg-white-100 h-8 sm:h-10 rounded-full">
            <Search className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
            <Input
              placeholder="Search"
              className="pl-8 sm:pl-12 pr-2 sm:pr-4 bg-transparent text-gray-700 placeholder-gray-500 w-full focus:outline-none appearance-none border-0 text-xs sm:text-sm"
              onChange={(e) => {
                handleSearch(e.target.value)
              }}
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <Help className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </header>
      <section>
        <div className="flex flex-col border-l md:flex-row bg-gray-100 h-[calc(100vh-9rem)] max-h-[calc(100vh-9rem)]">
          {/* Threads Section */}
          <div className={`w-full md:w-96 bg-white border-r ${showThreads ? "block" : "hidden md:block"} overflow-hidden`}>
            <div className="p-3 sm:p-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-sm sm:text-base">Messages</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              </Button>
            </div>

            <div className="p-2 sm:p-4 border-b flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <div className="flex w-full sm:w-60 gap-2 rounded-full bg-gray-100 p-1 shadow-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsRead(false)
                    setActiveButton("all")
                  }}
                  className={`h-8 sm:h-10 w-full text-xs sm:text-sm text-gray-600 rounded-full px-2 sm:px-4 py-1 sm:py-2 ${activeButton === "all" ? "bg-white shadow text-gray-800" : ""
                    }`}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsRead(true)
                    setActiveButton("unread")
                  }}
                  className={`h-8 sm:h-10 w-full text-xs sm:text-sm text-gray-600 rounded-full px-2 sm:px-4 py-1 sm:py-2 ${activeButton === "unread" ? "bg-white shadow text-gray-800" : ""
                    }`}
                >
                  Unread
                </Button>
              </div>
              {/* <Button
                size="sm"
                variant="outline"
                onClick={() => setInviteOpen(true)}
                className="h-8 sm:h-10 w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
              >
                Invite an partner &nbsp; <Plus size={14} className="sm:size-4" />
              </Button> */}
            </div>
            {props?.loading ? <div className="flex items-center justify-center h-32">
              <svg
                className="animate-spin h-6 w-6 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            </div> : <ScrollArea className="overflow-auto gap-2 mb-12 h-[calc(96vh-15rem)] sm:h-[calc(96vh-16rem)] w-full p-2 sm:p-4 bg-white">
              {threads?.length ? (
                threads?.map((thread: Thread) => {
                  return (
                    <div
                      key={thread.id}
                      className={`relative flex w-full mt-2 items-center gap-2 rounded-md sm:gap-3 p-2 sm:p-4  ${currentThread?.id === thread?.id ? 'bg-[#16161d] text-white' : "bg-gray-100"}  hover:shadow-md cursor-pointer transition-colors`}
                      onClick={() => handleThreadSelection(thread)}
                    >
                      {/* Last Seen Timestamp (Top Right Corner) */}
                      <span className={`absolute top-1 sm:top-2 right-1 sm:right-3 text-[8px] sm:text-xs ${currentThread?.id === thread?.id ? ' text-white' : "text-black"}  `}>
                        20 mins ago
                      </span>
                      <br />
                      {/* User Avatar (Image or Initials) */}
                      {thread?.image ? (
                        <Image
                          src={thread?.image || "/placeholder.svg"}
                          alt="User Avatar"
                          width={50}
                          height={50}
                          priority
                          unoptimized
                          className="rounded-full object-cover w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] flex-shrink-0"
                        />
                      ) : (
                        <div
                          className={`rounded-full flex items-center justify-center text-gray-700 font-semibold text-xs sm:text-sm w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] md:w-[50px] md:h-[50px] flex-shrink-0 bg-gray-800 text-white`}
                        >
                          {getInitials(thread.propertyName || "")}
                        </div>
                      )}

                      {/* Thread Details */}
                      <div className="flex-1 min-w-0">
                        {/* Name Section */}
                        <p className="font-semibold color-white text-xs sm:text-sm md:text-base truncate">
                          {thread.buyerAgent?.firstName}
                          {thread.sellerAgent && ` & ${thread.sellerAgent?.firstName}`}
                        </p>

                        <p className="text-[10px] sm:text-xs text-gray-500 truncate w-[120px] sm:w-[160px] md:w-[200px]">
                          {decryptMessage(thread?.message || "")}
                        </p>

                        {/* Capsules Section */}
                        <div className="text-[8px] sm:text-xs flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2 flex-wrap">
                          {/* Property Capsule */}
                          <span className="flex items-center gap-1 border border-orange-400 bg-white text-gray-700 px-1 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] md:text-xs h-4 sm:h-6">
                            <FaHome className="text-orange-600 text-[8px] sm:text-xs" />
                            <span className="truncate max-w-[60px] sm:max-w-[100px]">{thread?.propertyName}</span>
                          </span>

                          {/* Location Capsule */}
                          <span className="flex items-center gap-1 bg-orange-100  bg-[#FAF9F5] text-gray-600 px-1 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] md:text-xs h-4 sm:h-6">
                            <FaMapMarkerAlt className="text-orange-600  text-[8px] sm:text-xs" />
                            <span className="truncate max-w-[60px] sm:max-w-[100px]">{thread?.propertyAddress}</span>
                          </span>
                        </div>
                      </div>

                      {/* Unread Count Badge */}
                      {(thread.unreadCount || 0) > 0 && (
                        <Badge className="text-[8px] sm:text-xs md:text-sm text-black bg-white px-1 sm:px-2 py-0.5 sm:py-1 me-2 sm:me-6 h-4 sm:h-6 min-w-4 sm:min-w-6 flex items-center justify-center">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center mt-6 text-gray-400">
                  <p className="text-sm sm:text-lg font-semibold">No threads available</p>
                  <p className="text-xs sm:text-sm">It seems like you have not started any conversations yet.</p>
                </div>
              )}
            </ScrollArea>}
          </div>

          {/* Chat Section */}
          <div
            className={`flex-1 flex flex-col bg-[#FAF9F5]  ${showChat ? "block" : "hidden md:block"} max-h-full overflow-hidden`}
          >
            {/* Mobile Header for Chat */}
            <header className="border-b px-3 py-2 mt-4 flex items-center justify-between md:hidden">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBackToThreads}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-sm truncate max-w-[200px]">
                  {state?.selectedChannel?.propertyName || ""}
                </span>
              </div>
            </header>

            <div className="flex-1 bg-gray-50 mt-2 flex">
              {state.selectedChannel.id ? (
                <div className=" flex-1 flex flex-col max-h-full overflow-hidden">
                  {!messageLoading ? (
                    <>
                      <div className="p-2  sm:p-4 border-b flex justify-between items-center flex-wrap sm:flex-nowrap gap-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {userDetails?.imageUrl ? (
                            <Image
                              src={userDetails.imageUrl || "/placeholder.svg"}
                              alt="User Avatar"
                              width={40}
                              height={40}
                              className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10"
                              priority
                              unoptimized
                            />
                          ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-full">
                              {getInitials(userDetails?.firstName || "")}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-xs sm:text-sm truncate max-w-[100px] sm:max-w-full">
                                {userDetails?.firstName} {userDetails?.lastName}
                              </span>
                              <span className="text-[10px] sm:text-xs text-green-500">Online</span>
                            </div>
                            {isTyping && <span className="text-xs sm:text-sm text-green-600">Typing...</span>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Image
                              src={propertyData?.media?.primaryListingImageUrl || "/placeholder.jpg"}
                              alt="Property"
                              width={48}
                              height={32}
                              className="rounded-lg object-cover w-12 h-8 sm:w-16 sm:h-10"
                              priority
                              unoptimized
                            />
                            <div className="hidden sm:block">
                              <span className="text-xs sm:text-sm truncate max-w-[80px] sm:max-w-[120px] inline-block">
                                {propertyData?.courtesyOf}
                              </span>
                            </div>
                          </div>
                          {/* <div className="relative">
                            <button className="p-1 sm:p-2 rounded-full hover:bg-gray-100" onClick={() => {
                              toggleDropdown()
                            }}>
                              <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                            {isDropdownOpen && (
                              <div
                                className="absolute right-0 mt-2 w-36 sm:w-48 bg-white rounded-md shadow-lg border z-50"
                                onMouseLeave={closeDropdown}
                              >
                                <ul className="py-1">
                                  <li>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100"
                                      onClick={() => {
                                        closeDropdown()
                                        setIsDetails(!isDetails)
                                        setBuyerFaq(false)
                                        setSellerFaq(false)
                                        setShowDetails(!showDetails)
                                      }}
                                    >
                                      Property Details
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100"
                                      onClick={() => {
                                        closeDropdown()
                                        getAllFaqData()
                                        setBuyerFaq(true)
                                        setIsDetails(false);
                                        setSellerFaq(false)
                                      }}
                                    >
                                      Buyer FAQ Details
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100"
                                      onClick={() => {
                                        closeDropdown()
                                        setBuyerFaq(false)
                                        setIsDetails(false);
                                        setSellerFaq(true)
                                        getAllSeelerFaqData()
                                      }}
                                    >
                                      Seller FAQ Details
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div> */}
                        </div>
                      </div>

                      <div className="relative bg-gray-50">
                        <ScrollArea
                          ref={scrollContainerRef}
                          className="ms-2 me-2 sm:ms-5 sm:me-5 overflow-auto h-[calc(96vh-16rem)] sm:h-[calc(96vh-18rem)]"
                        >
                          <div className="space-y-2 bg-[##F7F2EB] sm:space-y-4 me-4 py-2">
                            {/* Loading Indicator for Older Messages */}
                            {/* {hasMoreMessages && (
                              <div className="text-center py-2">
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-t-2 border-blue-500 mx-auto"></div>
                              </div>
                            )} */}

                            {/* No More Messages Indicator */}
                            {!hasMoreMessages && allMessages.length > 0 && (
                              <div className="text-center py-2">
                                <p className="text-xs sm:text-sm text-gray-500">No more messages to load</p>
                              </div>
                            )}

                            {/* Messages */}
                            {Object.entries(groupedMessages).length > 0 ? (
                              [...allMessages].reverse().map((message, index, arr) => {
                                const isSender = message.senderId === userData?.id;
                                const isLastMessage = index === allMessages.length - 1;
                                const messageDate = new Date(message.createdAt);
                                const showDateHeader =
                                  index === 0 ||
                                  format(new Date(arr[index - 1].createdAt), "yyyy-MM-dd") !==
                                  format(messageDate, "yyyy-MM-dd");

                                const displayDate = isToday(messageDate)
                                  ? "Today"
                                  : isYesterday(messageDate)
                                    ? "Yesterday"
                                    : format(messageDate, "dd MMM yyyy");

                                return (
                                  <div key={message.id || index}>
                                    {/* Day Separator */}
                                    {showDateHeader && (
                                      <div className="text-center py-2">
                                        <span className="text-gray-500 text-xs sm:text-sm font-medium bg-white px-3 py-1 rounded-full shadow">
                                          {displayDate}
                                        </span>
                                      </div>
                                    )}

                                    {/* Message Bubble */}
                                    <div
                                      className={`flex gap-2 sm:gap-3 mt-2 sm:mt-4 items-start ${isSender ? "justify-end" : ""
                                        }`}
                                      ref={isLastMessage ? messagesEndRef : null}
                                    >
                                      {/* Avatar */}
                                      {!isSender && (
                                        <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-full shrink-0">
                                          {getInitials(userData?.firstName || "")}
                                        </div>
                                      )}

                                      <div
                                        className={`relative p-2 font-medium rounded-2xl shadow max-w-[75%] sm:max-w-[80%] text-xs sm:text-sm bg-black text-white `}
                                      >
                                        {/* Message content */}
                                        {message.messageType !== "file" && (
                                          <p className="break-words">{message.message}</p>
                                        )}

                                        {/* File message */}
                                        {message.messageType === "file" && (
                                          <div className="rounded-lg flex items-center gap-2 sm:gap-3 mt-1">
                                            {message.fileType && imageMimeType.includes(message.fileType) ? (
                                              <div
                                                className="relative cursor-pointer group"
                                                onClick={() =>
                                                  openMediaPreview(message.message, message.fileType)
                                                }
                                              >
                                                <Image
                                                  src={message.message || ""}
                                                  alt="Uploaded Image"
                                                  width={140}
                                                  height={140}
                                                  unoptimized
                                                  priority
                                                  className="rounded-lg max-w-[100px] sm:max-w-[120px] hover:opacity-90 transition-opacity"
                                                />
                                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                                  <Maximize className="w-4 h-4 text-white" />
                                                </div>
                                              </div>
                                            ) : message.fileType &&
                                              videoMimeType?.includes(message.fileType) ? (
                                              <video
                                                controls
                                                className="rounded-lg max-w-[100px] sm:max-w-[120px]"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  openMediaPreview(message.message, message.fileType);
                                                }}
                                              >
                                                <source src={message.message} type={message.fileType} />
                                                Your browser does not support the video tag.
                                              </video>
                                            ) : (
                                              <div className="flex items-center gap-2 text-xs sm:text-sm">
                                                <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-gray-600" />
                                                <span className="truncate max-w-[100px] sm:max-w-full">
                                                  {message.message.slice(0, 20)}
                                                </span>
                                                <a
                                                  href={message.message}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-500 hover:underline"
                                                >
                                                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                                                </a>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* Timestamp and read indicator */}
                                        <div className="flex justify-end items-center gap-1 mt-1">
                                          <span className="text-[10px] sm:text-xs text-gray-400">
                                            {message.createdAt
                                              ? format(new Date(message.createdAt), "HH:mm")
                                              : format(new Date(), "HH:mm")}
                                          </span>
                                          {isSender && (
                                            <span className="text-blue-500 inline-flex">
                                              {message.isRead ? (
                                                <CircleCheck className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 text-white rounded-lg" />
                                              ) : (
                                                <CircleCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                              )}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Sender avatar */}
                                      {isSender && (
                                        <div className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-full shrink-0">
                                          {getInitials(userData?.firstName || "")}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-center text-xs sm:text-sm text-gray-500">No messages yet.</p>
                            )}

                            {selectedFile && (
                              <div className="mx-4 mt-2 mb-3 relative">
                                <div className="bg-gray-100 rounded-lg p-3 pr-10">
                                  <div className="flex items-start">
                                    {selectedFile.type && imageTypes.includes(selectedFile.type) ? (
                                      <div className="mr-3">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative bg-[#FAF9F5] rounded-md overflow-hidden">
                                          <img
                                            src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      </div>
                                    ) : selectedFile.type && selectedFile.type.startsWith("video/") ? (
                                      <div className="mr-3">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[#FAF9F5] rounded-md relative">
                                          <Play className="w-8 h-8 text-gray-500" />
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="mr-3">
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-[#FAF9F5] rounded-md">
                                          <FileText className="w-8 h-8 text-gray-500" />
                                        </div>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                      <p className="text-xs text-gray-500 capitalize">{selectedFile.type.split("/")[0]}</p>
                                    </div>
                                  </div>
                                  <button
                                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#FAF9F5] text-gray-500"
                                    onClick={() => setSelectedFile(null)}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div ref={endMessageRef} />
                        </ScrollArea>
                        {/* 
                        {showNewMessageTag && (
                          <button
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm shadow-md animate-bounce"
                            onClick={() => {
                              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                              setShowNewMessageTag(false)
                            }}
                          >
                            New Message ↓
                          </button>
                        )} */}
                      </div>
                      <div className="p-2 bg-gray-50 sm:p-4 border-t relative">
                        {fileErrorMsg && (
                          <div className="absolute -top-10 left-0 right-0 bg-red-100 text-red-600 p-2 text-xs sm:text-sm text-center">
                            {fileErrorMsg}
                          </div>
                        )}
                        <div className="flex items-center bg-[##F7F2EB] gap-1 sm:gap-2">

                          <div className="relative">
                            <button
                              className="cursor-pointer  p-1 sm:p-2 rounded-full hover:bg-[#FAF9F5]"
                              onClick={toggleUploadMenu}
                            >
                              <FolderOpenDot className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
                            </button>
                            {showUploadMenu && (
                              <div
                                ref={uploadMenuRef}
                                className="absolute bottom-full left-0 mb-2 bg-white  rounded-lg z-10 w-48"
                              >
                                <div className="p-2 shadow text-xs sm:text-sm">
                                  <p className="font-medium mb-1">Upload file</p>
                                  <div className="space-y-2">
                                    <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                      <Paperclip className="h-4 w-4 text-blue-500" />
                                      <span>Image</span>
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="image/jpeg,image/png,image/jpg"
                                      />
                                    </label>
                                    <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                      <Play className="h-4 w-4 text-red-500" />
                                      <span>Video</span>
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="video/mp4,video/webm,video/ogg"
                                      />
                                    </label>
                                    <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span>Document</span>
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept="application/pdf"
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <button
                              type="button"
                              className="p-1 sm:p-2 rounded-full bg-[#FAF9F5] hover:bg-[#FAF9F5]"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                            </button>
                            {showEmojiPicker && (
                              <div
                                ref={emojiPickerRef}
                                className="absolute bottom-12 left-0 z-10 scale-75 sm:scale-100 origin-bottom-left">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                              </div>
                            )}
                          </div>

                          <form
                            className="flex-1 py-1 sm:py-2 px-2 sm:px-4"
                            onSubmit={(e) => {
                              e.preventDefault()
                              handleSendMessage()
                            }}
                          >
                            <Input
                              className="flex-1 py-1 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm border-none rounded-lg focus:outline-none"
                              placeholder="Write Message"
                              value={message}
                              onChange={handleInputChange}
                            />
                          </form>

                          {/* Send Button */}
                          <Button
                            size="icon"
                            className="bg-black border-none text-white rounded-lg flex h-8 w-8 sm:h-10 sm:w-auto sm:px-3 sm:gap-2 items-center justify-center"
                            onClick={handleSendMessage}
                          >
                            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Send</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* <Loader color="orange" /> */}

                      <div className="flex mt-5 justify-center items-center h-40">
                        {/* <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-blue-500"></div> */}
                        <Loader color="orange" size="xl" />
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  {/* <div className="text-center mt-6 text-gray-400">
                            <p className="text-lg font-semibold">No thread is Selected</p>
                            <p className="text-sm">It seems like you haven't started any conversations yet.</p>
                        </div> */}

                </>
              )}
            </div>
          </div>

          {/* Property Details Section */}
          {selectedThread ? <Accordion type="multiple" className="w-md max-w-md mx-auto border rounded-md">
            <AccordionItem value="item-1">
              <AccordionTrigger>Property Details</AccordionTrigger>
              <AccordionContent>
                <div
                  className={`w-full md:w-96 bg-gray-50 border-l ${showDetails ? "block" : "hidden md:block"} max-h-full overflow-hidden`}
                >
                  {/* <div className="p-2 sm:p-4 border-b flex justify-between items-center">
                    <h2 className="font-semibold text-sm sm:text-base">Property Details</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 sm:h-9 sm:w-9"
                      onClick={() => {
                        setIsDetails(false)
                        setShowDetails(false)
                      }}
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div> */}
                  <ScrollArea className="h-[calc(100vh-16rem)] sm:h-[calc(100vh-17rem)] px-2 sm:px-0">
                    <div className="p-2 sm:p-4">
                      <div className="relative">
                        <Image
                          src={propertyData?.media?.primaryListingImageUrl || ""}
                          alt={`Property Image`}
                          width={400}
                          height={100}
                          className="rounded-lg w-full h-auto object-cover"
                          priority
                          unoptimized={true}
                        />
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-1">
                            <LocationOnIcon className="text-primary text-base sm:text-lg" />
                            <div>
                              <h3 className="font-semibold text-sm sm:text-lg">{propertyData?.address?.unparsedAddress}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground">{propertyData?.courtesyOf}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                            <span className="text-xs sm:text-sm">4.6</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="flex justify-between items-center mt-3 sm:mt-4">
                          <div className="flex gap-1 sm:gap-2">
                            {/* Bedroom Capsule */}
                            <div className="bg-[#FAF9F5] text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1 flex items-center gap-1">
                              <BathtubIcon className="text-base sm:text-lg" />
                              <span>{propertyData?.property?.bathroomsTotal} Bath</span>
                            </div>
                            {/* Bathroom Capsule */}
                            <div className="bg-[#FAF9F5] text-xs sm:text-sm rounded-full px-2 sm:px-3 py-1 flex items-center gap-1">
                              <KingBedIcon className="text-base sm:text-lg" />
                              <span>{propertyData?.property?.bedroomsTotal} Bed</span>
                            </div>
                          </div>
                          {/* Heart Icon */}
                          <FavoriteBorder className="text-gray-500 hover:text-red-500 cursor-pointer text-lg sm:text-xl" />
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-4">
                        <h4 className="font-semibold text-sm sm:text-lg">Overview</h4>
                        <span className="text-xs sm:text-sm">
                          {propertyData?.publicRemarks
                            ? propertyData?.publicRemarks.length > 100
                              ? propertyData?.publicRemarks.slice(0, 100) + "..."
                              : propertyData?.publicRemarks
                            : ""}
                          {propertyData?.publicRemarks && propertyData?.publicRemarks.length > 100 && (
                            <Button
                              variant="link"
                              className="text-blue-600 ml-1 sm:ml-2 p-0 h-auto text-xs sm:text-sm"
                              onClick={() => setIsModalOpen(true)}
                            >
                              View More
                            </Button>
                          )}
                        </span>

                        {/* Modal for full description */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogContent className="bg-white max-w-[90vw] sm:max-w-lg rounded-lg">
                            <DialogHeader>
                              <DialogTitle className="text-sm sm:text-base">Property Overview</DialogTitle>
                              <DialogDescription className="text-xs sm:text-sm">
                                {propertyData?.publicRemarks}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogClose asChild>
                              <Button className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm">Close</Button>
                            </DialogClose>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="mt-4 sm:mt-6">
                        <h4 className="font-medium text-sm sm:text-base mb-2">Amenities</h4>
                        <div className="grid grid-cols-2 gap-2 sm:gap-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Wifi</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Kitchen className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Kitchen</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Workspace</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Free parking</span>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Wind className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="text-xs sm:text-sm">Air conditioning</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                  {/* <div className="px-2 sm:px-4 pb-4">
                <Button
                  className="shadow bg-orange-500 hover:bg-orange-600 w-full mt-3 sm:mt-6 text-xs sm:text-sm py-1 sm:py-2 h-auto"
                  onClick={() => {
                    router.push(`/buy/${propertyData?.id}/prop/preview`)
                  }}
                >
                  View details
                </Button>
              </div> */}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger
                onClick={() => {
                  console.log("Clickeddd");
                  getAllFaqData()
                }}
              >Buyer FAQ Details</AccordionTrigger>
              <AccordionContent>
                <div
                  className={`w-full md:w-96 bg-gray-50 border-l ${showDetails ? 'block' : 'hidden md:block'
                    } max-h-full overflow-hidden`}
                >
                  {/* <div className="p-2 sm:p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold text-sm sm:text-base">Buyer FAQ Details</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-9 sm:w-9"
                  onClick={() => {
                    setBuyerFaq(false)
                    setIsDetails(false)
                    setShowDetails(false)
                  }}
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div> */}
                  {
                    buyerFaqQuestions?.length ? <>
                      <ScrollArea className="h-[calc(100vh-12rem)] px-4 py-6">
                        {/* Centered User Image */}
                        <div className="flex flex-col items-center justify-center text-center">
                          {buyerFaqQuestions?.[0]?.user?.image ? (
                            <Image
                              src={buyerFaqQuestions?.[0]?.user?.image}
                              alt="User Image"
                              width={100}
                              height={100}
                              className="rounded-full w-24 h-24 object-cover mb-4 border"
                              unoptimized
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold mb-4 border">
                              {buyerFaqQuestions?.[0]?.user?.firstName
                                ? buyerFaqQuestions?.[0]?.user?.firstName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)
                                : '-'}
                            </div>
                          )}
                          <h3 className="font-semibold text-lg">{buyerFaqQuestions?.[0]?.user?.firstName || '-'} {buyerFaqQuestions?.[0]?.user?.lastName || '-'}</h3>
                          <p className="text-sm text-muted-foreground">{buyerFaqQuestions?.[0]?.user?.email || 'john.doe@example.com'}</p>
                          <p className="text-sm text-muted-foreground">{buyerFaqQuestions?.[0]?.user?.phone || '+1 234 567 890'}</p>
                        </div>


                        {/* Q&A Section */}
                        {/* Q&A Section */}
                        <div className="mt-6">
                          <h4 className="font-medium text-sm sm:text-base mb-2">Questionnaire</h4>
                          <div className="space-y-4">
                            {buyerFaqQuestions.map((qa, idx) => {
                              const isOpen = openIndexes.includes(idx);
                              return (
                                <div key={idx} className="border rounded p-3 bg-white shadow-sm">
                                  <button
                                    onClick={() => toggleAnswer(idx)}
                                    className="flex justify-between items-center w-full text-left"
                                  >
                                    <span className="font-medium text-sm text-gray-800">
                                      {qa.question}
                                    </span>
                                    <span className="text-xl font-bold text-gray-600">
                                      {isOpen ? '−' : '+'}
                                    </span>
                                  </button>
                                  {isOpen && (
                                    <p className="text-sm text-muted-foreground mt-2">{qa?.answer || '-'}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </ScrollArea>

                      {/* Footer Action */}
                      <div className="px-4 pb-4">
                        <Button
                          className="shadow bg-orange-500 hover:bg-orange-600 w-full mt-6 text-sm py-2 h-auto"
                          onClick={() => {
                            router.push(`/dashboard/users/${userData?.id || '123'}`)
                          }}
                        >
                          View Full Profile
                        </Button>
                      </div>
                    </> : <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      Buyer FAQ Details not found
                    </div>
                  }

                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger
                onClick={() => {
                  getAllSeelerFaqData()
                }}
              >Seller FAQ Details</AccordionTrigger>
              <AccordionContent>
                <div
                  className={`w-full md:w-96 bg-gray-50 border-l ${showDetails ? 'block' : 'hidden md:block'} max-h-full overflow-hidden`}
                >
                  {sellerFaqQuestions?.length > 0 ? (
                    <>
                      <ScrollArea className="h-[calc(100vh-12rem)] px-4 py-6">
                        {/* Centered User Image */}
                        <div className="flex flex-col items-center justify-center text-center">
                          {sellerFaqQuestions?.[0]?.user?.image ? (
                            <Image
                              src={sellerFaqQuestions?.[0]?.user?.image}
                              alt="User Image"
                              width={100}
                              height={100}
                              className="rounded-full w-24 h-24 object-cover mb-4 border"
                              unoptimized
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold mb-4 border">
                              {sellerFaqQuestions?.[0]?.user?.firstName
                                ? sellerFaqQuestions?.[0]?.user?.firstName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                                  .slice(0, 2)
                                : '-'}
                            </div>
                          )}
                          <h3 className="font-semibold text-lg">
                            {sellerFaqQuestions?.[0]?.user?.firstName || '-'} {sellerFaqQuestions?.[0]?.user?.lastName || '-'}
                          </h3>
                          <p className="text-sm text-muted-foreground">{sellerFaqQuestions?.[0]?.user?.email || 'john.doe@example.com'}</p>
                          <p className="text-sm text-muted-foreground">{sellerFaqQuestions?.[0]?.user?.phone || '+1 234 567 890'}</p>
                        </div>

                        {/* Q&A Section */}
                        <div className="mt-6">
                          <h4 className="font-medium text-sm sm:text-base mb-2">Questionnaire</h4>
                          <div className="space-y-4">
                            {sellerFaqQuestions.map((qa, idx) => {
                              const isOpen = openIndexes.includes(idx);
                              return (
                                <div key={idx} className="border rounded p-3 bg-white shadow-sm">
                                  <button
                                    onClick={() => toggleAnswer(idx)}
                                    className="flex justify-between items-center w-full text-left"
                                  >
                                    <span className="font-medium text-sm text-gray-800">
                                      {qa.question}
                                    </span>
                                    <span className="text-xl font-bold text-gray-600">
                                      {isOpen ? '−' : '+'}
                                    </span>
                                  </button>
                                  {isOpen && (
                                    <p className="text-sm text-muted-foreground mt-2">{qa?.answer || '-'}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </ScrollArea>

                      {/* Footer Action */}
                      <div className="px-4 pb-4">
                        <Button
                          className="shadow bg-orange-500 hover:bg-orange-600 w-full mt-6 text-sm py-2 h-auto"
                          onClick={() => {
                            router.push(`/dashboard/users/${userData?.id || '123'}`)
                          }}
                        >
                          View Full Profile
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      Seller FAQ Details not found
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion> : null}
        </div>
      </section>
      {inviteOpen && (
        <Modal closeModal={() => setInviteOpen(false)} isOpen={inviteOpen}>
          <div className="p-3 sm:p-6 bg-white max-w-[90vw] sm:max-w-md mx-auto rounded-lg">
            <h2 className="text-base sm:text-xl font-bold mb-2 sm:mb-4 text-center">Invite an partner</h2>
            <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4 text-center">
              Enter the partners email below to send an invitation.
            </p>
            <Input
              type="email"
              placeholder="partner's email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-3 sm:mb-4 p-2 sm:p-3 border rounded-lg w-full text-xs sm:text-sm"
            />
            <div className="flex justify-between mt-2 sm:mt-4">
              <Button
                variant="ghost"
                onClick={() => setInviteOpen(false)}
                className="px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!email}
                className="px-2 sm:px-4 py-1 sm:py-2 bg-orange-600 text-white rounded-lg disabled:opacity-50 text-xs sm:text-sm"
              >
                Send Invite
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Media Preview Modal */}
      {mediaPreview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={closeMediaPreview}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white z-20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation controls */}
            {/* {allMediaFiles.length > 1 && (
              <>
                <button
                  onClick={goToPrevMedia}
                  disabled={currentMediaIndex === 0}
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full ${currentMediaIndex === 0 ? 'bg-gray-500/30 cursor-not-allowed' : 'bg-black/50 hover:bg-black/70 cursor-pointer'} text-white z-20`}
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={goToNextMedia}
                  disabled={currentMediaIndex === allMediaFiles.length - 1}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full ${currentMediaIndex === allMediaFiles.length - 1 ? 'bg-gray-500/30 cursor-not-allowed' : 'bg-black/50 hover:bg-black/70 cursor-pointer'} text-white z-20`}
                >
                  <ArrowRight className="h-6 w-6" />
                </button>
              </>
            )} */}

            {/* Zoom controls for images */}
            {mediaPreview.type &&
              imageMimeType.includes(mediaPreview.type) &&
              !mediaPreview.loading &&
              !mediaPreview.error && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 rounded-full px-4 py-2 z-20">
                  <button
                    onClick={() => handleZoom(false)}
                    className="text-white hover:text-gray-200"
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <span className="text-white text-sm">{Math.round(zoomLevel * 100)}%</span>
                  <button
                    onClick={() => handleZoom(true)}
                    className="text-white hover:text-gray-200"
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                </div>
              )}

            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm z-20 max-w-[80%] truncate">
              {mediaPreview.name || "Media Preview"}
            </div>

            <div className="max-w-full max-h-full overflow-auto">
              {/* Loading indicator */}
              {mediaPreview.loading && (
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                  <p className="text-white text-sm">Loading image...</p>
                </div>
              )}

              {/* Error message */}
              {mediaPreview.error && (
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-red-600/20 p-8 rounded-lg text-center">
                    <p className="text-white text-lg mb-2">Failed to load image</p>
                    <p className="text-gray-300 text-sm">The image could not be loaded due to an error.</p>
                  </div>
                </div>
              )}

              {/* Image preview */}
              {mediaPreview.type &&
                imageMimeType.includes(mediaPreview.type) &&
                !mediaPreview.loading &&
                !mediaPreview.error ? (
                <div
                  className="relative flex items-center justify-center w-full h-full"
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <img
                    src={mediaPreview.url || "/placeholder.svg"}
                    alt="Image Preview"
                    className="max-w-full max-h-[90vh] object-contain"
                    onLoad={() => console.log("Image loaded successfully")}
                    onError={(e) => {
                      console.error("Image failed to display in preview:", e)
                      setMediaPreview((prev) => (prev ? { ...prev, error: true } : null))
                    }}
                  />
                </div>
              ) : mediaPreview.type && videoMimeType.includes(mediaPreview.type) ? (
                <div className="relative max-w-4xl w-full">
                  <video
                    src={mediaPreview.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[90vh]"
                    onError={(e) => {
                      console.error("Video failed to load:", e)
                      setMediaPreview((prev) => (prev ? { ...prev, error: true } : null))
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                !mediaPreview.loading &&
                !mediaPreview.error && (
                  <div className="bg-white rounded-lg p-8 text-center max-w-lg">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-medium mb-2">File preview not available</p>
                    <p className="text-gray-500 mb-6">{mediaPreview.name}</p>
                    <a
                      href={mediaPreview.url}
                      download
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4 mr-2" /> Download File
                    </a>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const hashCode = (str: string) => str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

