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
    Play,
    Smile,
    Maximize,
    Eye,
    ZoomOut,
    ZoomIn,
    SendHorizontal,
} from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { format, isSameDay, subDays } from "date-fns"
import { SocketContext } from "providers/socket.context"
import { FaHome, FaMapMarkerAlt } from "react-icons/fa"
import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { ScrollArea } from "components/ui/scroll-area"
import { Badge } from "components/ui/badge"
import useDebounce from "lib/debounce"
import { useAgentConversationApi } from "lib/api/useConversationApi"
import { decryptMessage, encryptMessage, generateColorFromName } from "lib/math-utilities"
import { useAtom } from "jotai"
import { agentReadWriteAtom } from "store/atoms/agent-atom"
import { propertyReadWriteAtom } from "store/atoms/property"
import Modal from "components/common/Modal"
import EmojiPicker from "emoji-picker-react"
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
import InviteUserModal from "./Invite-user-modal"
import { useUserAgentMessageApi } from "lib/api/useMessageApi"
import { threadReadWriteAtom } from "store/atoms/threads"
import { MediaPreview } from "components/dashboard/chat-box/chat-box"
import { Loader } from "@mantine/core"
import { claimPropertyAtom } from "hooks/claimPropertyAtom"
import { useRepoManagementApi } from "lib/api/useRepoManagement"
import { usePropertyServiceAPI } from "lib/api/property"
import { error } from "components/alert/notify"


interface User {
    id: string
    username: string
    message: string
    image: string
}
interface Message {
    createdAt?: string;
    fileType?: string;
    messageType?: string;
    threadId: string
    message: string
    senderId: string
    receiverId: string
    timestamp?: string
    seen?: boolean
    parentMessageId?: string | null
    file?: {
        name?: string
        url?: string
        type?: string
    }
}

interface Thread {
    id: string
    threadName?: string
    image?: string;
    propertyName?: string;
    message?: string
    lastSeen?: string
    unreadCount?: number
    propertyAddress?: string
    propertyId?: string
    listingId?: string
    participants?: any
    user?: {
        id?: string
        firstName?: string
        lastName?: string
    }
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

export default function MessageBoxComponent(props: any) {
    const { threads, setIsRead, setSearch, loading, threadId } = props
    const router = useRouter()
    const [threadState, setThreadState] = useAtom(threadReadWriteAtom);
    const { socket, state, setState } = useContext(SocketContext)
    const [isDetails, setIsDetails] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [activeButton, setActiveButton] = useState("all")
    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)
    const closeDropdown = () => setIsDropdownOpen(false)
    const [message, setMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [fileErrorMsg, setFileErrorMsg] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [selectedChannel, setSelectedChannel] = useState<Thread | null>(null)
    //   const propertyDetails = useSelector((state: { property: any }) => state.property)
    const [propertyInformations] = useAtom(propertyReadWriteAtom);
    const propertyDetails = propertyInformations.selectedProperty;
    const [agentData] = useAtom(agentReadWriteAtom);
    const [receiverId, setRecieverId] = useState<string>("")
    const [messageLoading, setMessageLoading] = useState(false)
    const [showThreads, setShowThreads] = useState(true)
    const [receiverDetail, setRecieverDetail] = useState<any>({})
    const [senderDetail, setSenderDetail] = useState<any>({})
    const [showChat, setShowChat] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [propertyData, setPropertyData] = useState<any>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const messagesEndRef = useRef(null);
    const [firstTime, setFirstTime] = useState(false);
    const debounce = useDebounce()
    const imageTypes = ["image/jpeg", "image/png", "image/jpg"]
    const scrollRef = useRef<HTMLDivElement>(null)
    const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [allMediaFiles, setAllMediaFiles] = useState<{ type?: string, url?: string, name?: string }[]>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [selectedThread, setSelectedThread] = useState<any>("")
    const [threadParticipants, setThreadParticipant] = useState<any>([])
    const [selectedThreadDetail, setSelectedThreadDetail] = useState<any>("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const PROPERTY_DETAIL_SEARCH_AI_URL = process.env.NEXT_PUBLIC_AI_BACKEND_BASE_URI || "https://preprod-ai.snaphomz.com"
    const pathname = useSearchParams();
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const TYPE = pathname.get('type');
    const endMessageRef = useRef<HTMLDivElement>(null);
    const uploadMenuRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const { getAllUserAgentMessagesMutation, addParticipantsToThread, getThreadById } = useUserAgentMessageApi()
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
    const allowedFileTypes = [...imageMimeType, ...videoMimeType, "application/pdf"]
    const { uploadNewFile } = usePropertyServiceAPI()
    const { createRepoWithUploadedFile } = useRepoManagementApi()
    const [currentProperty] = useAtom(claimPropertyAtom)
    const toggleUploadMenu = () => {
        setShowUploadMenu((prev) => !prev);
    };

    const handleFileUpload = async (file: File) => {
        try {
            const { key } = await uploadNewFile(file, agentData.user?.id, selectedThreadDetail?.propertyId);
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
                    propertyId: selectedThreadDetail?.propertyId,
                    createdBy: agentData.user.id,
                    parentFolderName: 'proof-document',
                    isArchived: true
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

    const handleThreadSelection = (thread: Thread, participants: any) => {
        if (selectedThreadDetail?.id === thread?.id)
            return null
        // router.push(`/dashboard/messages`)
        setIsDetails(false)
        setShowThreads(false)
        setShowChat(true)
        setThreadParticipant(participants)
        setSelectedThreadDetail(thread)
        // if (socket) {
        //     socket.emit("joinThread", thread?.id);
        // }

        setSelectedThread(thread?.id)

        getAllThreadMessage(thread?.id)

        if (agentData?.user?.id === thread?.buyerAgent?.id) {
            setRecieverId(thread?.user?.id || "")
            setRecieverDetail(thread?.user)
        }
        if (agentData?.user?.id === thread?.sellerAgent?.id) {
            setRecieverId(thread?.user?.id || "")
            setRecieverDetail(thread?.user)
        }
        else if (agentData?.user?.id === thread?.user?.id) {
            setRecieverId(thread?.buyerAgent?.id || "")
            setRecieverDetail(thread?.buyerAgent)
        }
        getPropertyDetails(thread?.listingId, thread.propertyId)
        setState((prev: any) => ({
            ...prev,
            selectedChannel: {
                id: thread?.id,
                propertyName: thread.propertyName,
            }
        }))
    }

    const handleEmojiClick = (emoji) => {
        setMessage((prev) => prev + emoji.emoji);
    };

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

    const getThreadDetails = async (id: string) => {
        getThreadById.mutateAsync(id ?? threadId, {
            onSuccess: async (data: any) => {
                console.log("Threads : ", data);
                const participants = await [
                    ...(data?.buyerAgent ? [data.buyerAgent] : []),
                    ...(data?.sellerAgent ? [data.sellerAgent] : []),
                    ...(data?.user ? [data.user] : []),
                    ...(Array.isArray(data?.participants) ? data.participants.map((p: any) => p.user) : []),
                ];
                handleThreadSelection(data, participants)
            }
        })
    }

    const getAllThreadMessage = async (threadId: string) => {
        try {
            setMessages([]);
            getAllUserAgentMessagesMutation.mutate(threadId, {
                onSuccess: (data) => {
                    const decryptedMessages = data?.data?.messagesByThread?.map((message: Message) => {
                        const decryptedMessage = decryptMessage(message.message);
                        console.log("Message Detail Checking", message, threadParticipants)
                        return {
                            ...message,
                            message: decryptedMessage,
                        };
                    });
                    setMessages(decryptedMessages || []);
                },
                onError: (error) => {
                    console.log("Error in mutation: ", error);
                },
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };
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

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearch(value)
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

            const validTypes = ["image/jpeg", "image/png", "application/pdf"]
            const maxSize = 5 * 1024 * 1024

            if (!allowedFileTypes.includes(file.type)) {
                setFileErrorMsg("Invalid file type. Only JPG, PNG, and PDF are allowed.")
                return
            }
            if (file.size > maxSize) {
                setFileErrorMsg("File size exceeds the 5MB limit.")
                return
            }

            setSelectedFile(file)
        }
    }

    const getPropertyDetails = async (id: any, propertyId: any) => {
        try {
            setMessageLoading(true)
            setPropertyData(null)
            const payload = {
                listingId: parseInt(id) || "",
                propertyId: parseInt(propertyId)
            }
            const response = await fetch(`${PROPERTY_DETAIL_SEARCH_AI_URL}/api/get_data` || "http://13.60.114.186:9000/api/get_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            })
            const data = await response.json()
            console.log(data)
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

    const closeMediaPreview = () => {
        setMediaPreview(null);
        setZoomLevel(1);
    };

    const handleZoom = (zoomIn: boolean) => {
        if (zoomIn) {
            setZoomLevel(prev => Math.min(prev + 0.25, 3));
        } else {
            setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
        }
    };

    const getBase64 = (file: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSendMessage = async () => {
        try {
            const encryptedMessage = encryptMessage(message)
            if (encryptedMessage.trim() !== "" || selectedFile) {
                const newMessage = {
                    threadId: state?.selectedChannel.id || "",
                    message: encryptedMessage,
                    senderId: agentData?.user?.id,
                    roomId: selectedThreadDetail?.roomId,
                    receiverId: receiverId,
                    createdAt: new Date().toISOString(),
                } as Message
                let fileData = null;
                if (selectedFile) {
                    handleFileUpload(selectedFile);
                    const base64Content = await getBase64(selectedFile);
                    const fileType = selectedFile.type;
                    fileData = {
                        name: selectedFile.name,
                        type: fileType,
                        size: selectedFile.size,
                        content: base64Content,
                        sender: agentData?.user,
                    };
                    socket?.emit("save_file", fileData, async (response: any) => {
                        const messageData = await response.data;
                        const message = encryptMessage(response.data.message);
                        if (response?.success) {
                            socket?.emit(
                                "sendMessagetoThread",
                                {
                                    ...newMessage,
                                    ...response?.data,
                                    message
                                },
                                {
                                    reciepent: receiverId,
                                    userName: agentData?.user?.firstName + " " + agentData?.user?.lastName,
                                },
                                null,
                            )

                            setTimeout(() => {
                                setMessages((prev) => [
                                    {
                                        ...newMessage,
                                        ...messageData
                                    },
                                    ...prev,
                                ]);
                            }, 2000)
                        }
                    })
                    // const reader = new FileReader()
                    // reader.readAsDataURL(selectedFile as Blob)
                    // reader.onload = () => {
                    //     const data = {
                    //         name: selectedFile?.name || "",
                    //         type: selectedFile?.type,
                    //         size: selectedFile?.size,
                    //         content: reader.result,
                    //         sender: userData,
                    //     }
                    //     socket?.emit(
                    //         "sendMessagetoThread",
                    //         newMessage,
                    //         {
                    //             reciepent: receiverId,
                    //             userName: userData?.firstname + " " + userData?.lastname,
                    //         },
                    //         data,
                    //     )
                    //     setMessages((prevMessages) => [
                    //         { ...newMessage, message, file: { url: reader.result as string, name: "", type: selectedFile?.type } },
                    //         ...prevMessages,
                    //     ])
                    // }
                }
                else {
                    socket?.emit(
                        "sendMessagetoThread",
                        newMessage,
                        {
                            reciepent: receiverId,
                            userName: agentData?.user?.firstName + " " + agentData?.user?.lastName,
                        },
                        null,
                    )
                }
                setSelectedFile(null)
                if (message.trim() !== "") {
                    setMessages((prevMessages) => [
                        { ...newMessage, message },
                        ...prevMessages,
                    ])
                }
                setMessage("")
            }
            setTimeout(() => {
                setFirstTime(false)
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }, 1000)
        } catch (error) {
            console.log("error : ", error)
        }
    }

    const handleTrheadsName = (user: any) => {
        const str1 = "Byuer (" + user?.buyerAgent.firstName + " " + user?.buyerAgent.lastName + ")"
        const str2 = "Seller (" + user?.sellerAgent.firstName + " " + user?.sellerAgent.lastName + ")"
        return <>
            <h3 className="font-semibold text-sm sm:text-base truncate">{str1}</h3>
            <h3 className="font-semibold text-sm sm:text-base truncate">{str2}</h3>
        </>
    }

    const saveAllMessages = () => {
        if (socket) {
            const threadId = pathname.get('threadId')
            socket.emit("save_user_agent_messages", selectedThreadDetail?.id);
        }
    }

    const groupedMessages: { [date: string]: Message[] } = messages.reduce((acc: { [date: string]: Message[] }, message) => {
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
        if (socket) {
            // socket?.on('thread_marked_as_read', (data: any) => {
            //   if (selectedThread === data?.threadId) {
            //     // setAllMessages(allMessages);
            //     const updatedMessages = allMessages.map((msg) =>
            //       msg.isRead ? msg : { ...msg, isRead: true }
            //     );
            //     setAllMessages(updatedMessages);
            //   }
            // })
            // socket.on("recievedMessage", (newMessage: Message) => {
            //   setShowNewMessageTag(true)
            //   console.log("Data : ", selectedThread, newMessage);
            //   setAllMessages(prevMessages => [newMessage, ...prevMessages]);
            // })
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
    }, [socket, selectedThreadDetail])

    // useEffect(() => {
    //     if (socket) {
    //         socket.emit("joinThread", selectedThread);
    //     }
    // }, [selectedThread])

    useEffect(() => {
        if (socket) {
            socket.on("recievedMessage", (newMessage: Message) => {
                setMessages((prevMessages) => [
                    newMessage,
                    ...prevMessages,
                ])
            })
            socket.on("typingStatus", (typing: boolean) => {
                setIsTyping(typing)
            })
            return () => {
                socket.off("recievedMessage")
                socket.off("typingStatus");
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
    },
        [socket])
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
        const handleUnload = () => {
            if (socket) {
                if (TYPE === "messages") {
                    const threadId = pathname.get('threadId')
                    socket.emit("save_user_agent_messages", selectedThreadDetail?.id);
                }
                else {
                    socket.emit("save_messages");
                }
            }
        };
        window.addEventListener("beforeunload", handleUnload);
        window.addEventListener("popstate", handleUnload);
        return () => {
            window.removeEventListener("beforeunload", handleUnload);
            window.removeEventListener("popstate", handleUnload);
        };
    }, [socket]
    );
    setTimeout(() => {
        if (messagesEndRef.current && firstTime) {
            setFirstTime(false)
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, 100)
    useEffect(() => {
        if (state?.newMessage) {
            const message = decryptMessage(state?.newMessage?.message)
            state.newMessage.message = message;
            setMessages((prevMessages) => [
                state.newMessage,
                ...prevMessages,
            ])
            setState((prev: any) => ({
                ...prev,
                newMessage: null
            }))
        }
    }, [state.newMessage])

    useEffect(() => {
        if (threadId) {
            getThreadDetails(threadId);
        }
    }, [threadId])

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
        endMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [groupedMessages]);
    return (
        <div className="mt-36 max-w-full ">
            <header className="border-b px-2 sm:px-4 py-2 flex items-center justify-between bg-white shadow-sm">
                <div className="flex cursor-pointer items-center gap-4" onClick={() => router.back()}>
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold">Back</span>
                </div>
                <div className="flex justify-center items-center w-full">
                    <div className="shadow relative flex w-full max-w-xl bg-white-100 h-10 rounded-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <Input
                            placeholder="Search"
                            className="pl-12 pr-4 bg-transparent text-gray-700 placeholder-gray-500 w-full focus:outline-none appearance-none border-0"
                            onChange={(e) => {
                                handleSearch(e.target.value)
                            }}
                        />
                    </div>
                </div>
                <Button variant="ghost" size="icon">
                    <Help className="h-5 w-5" />
                </Button>
            </header>
            <section>
                <div className="flex flex-col border-l md:flex-row bg-gray-100 h-[calc(100vh-9rem)] max-h-[calc(100vh-9rem)]">
                    <div className={`w-full md:w-96 bg-white border-r ${showThreads ? "block" : "hidden md:block"} overflow-hidden`}>
                        {/* Header */}
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold text-lg text-gray-800">Messages</h2>
                            <Button variant="ghost" size="icon">
                                <MessageCircle className="h-6 w-6 text-gray-600" />
                            </Button>
                        </div>

                        {/* Toggle Buttons */}
                        <div className="p-4 border-b flex justify-center items-center">
                            <div className="flex w-full max-w-[240px] gap-2 rounded-full bg-gray-100 p-1 shadow-sm">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsRead(false);
                                        setActiveButton("all");
                                    }}
                                    className={`h-9 flex-1 text-sm text-gray-600 rounded-full px-3 ${activeButton === "all" ? "bg-white shadow text-gray-800" : ""}`}
                                >
                                    All
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                        setIsRead(true);
                                        setActiveButton("unread");
                                    }}
                                    className={`h-9 flex-1 text-sm text-gray-600 rounded-full px-3 ${activeButton === "unread" ? "bg-white shadow text-gray-800" : ""}`}
                                >
                                    Unread
                                </Button>
                            </div>
                        </div>

                        {/* Threads List */}
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
                        </div> : <ScrollArea className="px-4 py-2 overflow-auto h-[calc(96vh-16rem)]">
                            {threadState?.messageThread?.length ? (
                                threadState?.messageThread.map((thread: Thread) => {
                                    const participants = [
                                        ...(thread?.buyerAgent ? [thread.buyerAgent] : []),
                                        ...(thread?.sellerAgent ? [thread.sellerAgent] : []),
                                        ...(thread?.user ? [thread.user] : []),
                                        ...(Array.isArray(thread?.participants) ? thread.participants.map(p => p.user) : []),
                                    ];

                                    const initials = getInitials(
                                        `${thread?.buyerAgent?.firstName || ''} ${thread?.user?.firstName || thread?.sellerAgent?.firstName || ''}`
                                    );

                                    return (
                                        <div
                                            key={thread.id}
                                            className={`relative flex w-full overflow-hidden   mt-3 items-start gap-3 p-4 rounded-md ${selectedThreadDetail?.id === thread?.id ? 'bg-[#16161d] text-white' : "bg-gray-100"}  hover:shadow-md cursor-pointer transition-colors`}
                                            onClick={() => handleThreadSelection(thread, participants)}
                                        >
                                            {/* Timestamp */}
                                            <span className={`absolute top-1 sm:top-2 right-1 sm:right-3 text-[8px] sm:text-xs ${selectedThreadDetail?.id === thread?.id ? ' text-white' : "text-black"}  `}>
                                                20 mins ago
                                            </span>

                                            {/* Avatar */}
                                            {thread?.image ? (
                                                <Image
                                                    src={thread.image}
                                                    alt="User Avatar"
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full object-cover w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
                                                />
                                            ) : (
                                                <div
                                                    className={`rounded-full flex items-center justify-center font-semibold w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-gray-800 text-white `}
                                                >
                                                    {initials}
                                                </div>
                                            )}

                                            {/* Thread Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm sm:text-base truncate">
                                                    {thread.buyerAgent?.firstName} & {thread?.user?.firstName || thread.sellerAgent?.firstName}
                                                </p>

                                                <p className="text-xs sm:text-sm text-gray-500 truncate w-full">
                                                    {true ? thread.message : "typing..."}
                                                </p>

                                                {/* Participants */}
                                                <div className="flex flex-wrap gap-1 text-[10px] text-gray-500 truncate w-full">
                                                    {participants.map((p: any, i: number) => (
                                                        <span key={i} className="truncate">{p?.firstName}{i < participants.length - 1 && ','}</span>
                                                    ))}
                                                </div>

                                                {/* Tags */}
                                                <div className="text-xs flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="flex items-center gap-1 border border-orange-400 bg-white text-gray-700 px-3 py-1 rounded-full text-[10px] sm:text-xs h-6">
                                                        <FaHome className="text-orange-600 text-xs" />
                                                        <span className="truncate max-w-[100px]">{thread.propertyName}</span>
                                                    </span>
                                                    <span className="flex  items-center bg-orange-100 overflow-hidden w-24 gap-1 bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-[10px] sm:text-xs h-6">
                                                        <FaMapMarkerAlt className="text-orange-600 text-xs" />
                                                        <span className="truncate max-w-[100px]">{thread.propertyAddress}</span>
                                                    </span>
                                                </div>
                                                {/* {(thread.messages?.length || 0) > 0 && (
                                                    <div className="absolute top-2 right-5 translate-x-1/2 -translate-y-1/2">
                                                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-white bg-orange-600 rounded-full shadow">
                                                            {thread.messages?.length}
                                                        </span>
                                                    </div>
                                                )} */}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center mt-6 text-gray-400">
                                    <p className="text-lg font-semibold">No threads available</p>
                                    <p className="text-sm">It seems like you have not started any conversations yet.</p>
                                </div>
                            )}
                        </ScrollArea>}
                    </div>
                    <div className={`flex-1  flex flex-col bg-gray-50 ${showChat ? "block" : "hidden md:block"} max-h-full overflow-hidden`}>
                        <header className="border-b px-4 py-2 flex items-center justify-between md:hidden">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" size="icon" onClick={handleBackToThreads}>
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                                <span className="font-semibold">{state?.selectedChannel?.propertyName || ""}</span>
                            </div>
                        </header>
                        <div className="flex-1 flex">
                            {state.selectedChannel.id ? (
                                <div className="bg-muted flex-1 flex flex-col ">
                                    {!messageLoading ? (
                                        <>
                                            <div className="p-4 border-b  flex justify-between items-center">
                                                <div className="flex items-center gap-3">

                                                    {selectedThread?.image ? (
                                                        <Image
                                                            src={selectedThread?.image}
                                                            alt="User Avatar"
                                                            width={50}
                                                            height={50}
                                                            className="rounded-full object-cover w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
                                                        />
                                                    ) : (
                                                        <div
                                                            className={`rounded-full flex items-center justify-center text-gray-700 font-semibold w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] bg-gray-800 text-white `
                                                            }
                                                        >
                                                            {getInitials(
                                                                `${selectedThread?.buyerAgent?.firstName?.[0] || ""} ${selectedThread?.user?.firstName?.[0] || selectedThread?.sellerAgent?.firstName?.[0] || ""}`
                                                            )}
                                                        </div>

                                                    )}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 min-w-0">
                                                                {/* Name */}
                                                                <p className="font-semibold text-sm sm:text-base truncate">{selectedThreadDetail.buyerAgent?.firstName} & {selectedThreadDetail?.user?.firstName || selectedThreadDetail?.sellerAgent?.firstName}</p>

                                                                <span className="truncate max-w-[100px] flex text-[10px]">{threadParticipants?.map((participant: any, idx: number) => <p key={idx}>{participant?.firstName}, </p>)}</span>
                                                            </div>
                                                            {/* <span className="text-xs text-green-500">Online</span> */}
                                                        </div>
                                                        {isTyping && <span className="text-sm text-green-600">Typing...</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center  gap-3">
                                                        <Image
                                                            src={propertyData?.media?.photosList?.[0]?.lowRes || "/placeholder.jpg"}
                                                            alt="Property"
                                                            width={60}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                            priority
                                                            unoptimized
                                                        />
                                                        <div>
                                                            <span className="text-xs">{propertyData?.courtesyOf}</span>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <button className="p-2 rounded-full hover:bg-gray-100" onClick={toggleDropdown}>
                                                            <MoreVertical className="h-5 w-5" />
                                                        </button>
                                                        {isDropdownOpen && (
                                                            <div
                                                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border"
                                                                onMouseLeave={closeDropdown}
                                                                style={{ zIndex: 100 }}
                                                            >
                                                                <ul className="py-1">
                                                                    <li>
                                                                        <button
                                                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                                                            onClick={() => {
                                                                                closeDropdown()
                                                                                setIsDetails(!isDetails)
                                                                                setShowDetails(!showDetails)
                                                                            }}
                                                                        >
                                                                            Property Details
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <InviteUserModal
                                                                            threadId={selectedThread}
                                                                        />
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <ScrollArea className="ms-2 mb-2 me-2 sm:ms-5 sm:me-5 overflow-auto h-[calc(96vh-16rem)] sm:h-[calc(96vh-18rem)]">
                                                <div className="space-y-6 me-4">
                                                    {Object.entries(groupedMessages)
                                                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                                                        .map(([dateKey, dayMessages]) => {
                                                            const parsedDate = new Date(dateKey);
                                                            // const label = "Today"
                                                            const label = isToday(parsedDate)
                                                                ? "Today"
                                                                : isYesterday(parsedDate)
                                                                    ? "Yesterday"
                                                                    : format(parsedDate, "EEEE, MMMM d");

                                                            return (
                                                                <div key={dateKey}>
                                                                    <div className="text-center py-2">
                                                                        <span className="text-gray-500 text-xs sm:text-sm font-medium bg-white px-3 py-1 rounded-full shadow">
                                                                            {label}
                                                                        </span>
                                                                    </div>


                                                                    <div className="space-y-4">
                                                                        {[...dayMessages]
                                                                            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                                                                            .map((message, index) => {
                                                                                const isSender = message.senderId === agentData?.user?.id;
                                                                                const isLastMessage = index === dayMessages?.length - 1;
                                                                                const formattedTime = format(new Date(message.createdAt), "hh:mm a");
                                                                                const receiver = threadParticipants.find(
                                                                                    (p) => p.id === message.senderId && p.id !== agentData?.user?.id
                                                                                );

                                                                                return (
                                                                                    <div
                                                                                        key={index}
                                                                                        className={`flex gap-3 mt-4 items-start border-red ${isSender ? 'justify-end' : ''}`}
                                                                                        ref={isLastMessage ? messagesEndRef : null}
                                                                                    >
                                                                                        {!isSender && receiver && (
                                                                                            <div
                                                                                                className="w-7 h-7 mt-4 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-300 text-white text-xs sm:text-sm font-semibold rounded-full shrink-0 bg-gray-800 text-white"

                                                                                            >
                                                                                                {getInitials(`${receiver?.firstName} ${receiver?.lastName}` || '')}
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="w-full flex flex-col gap-1">
                                                                                            {/* Time aligned to sender/receiver side */}
                                                                                            <div className={`text-xs text-gray-400 px-2 ${isSender ? "text-right" : "text-left"}`}>
                                                                                                {formattedTime}
                                                                                            </div>

                                                                                            {/* Message container taking full width */}
                                                                                            <div className={`w-full flex ${isSender ? "justify-end" : "justify-start"}`}>
                                                                                                <div
                                                                                                    className={`p-3 sm:p-4 font-medium rounded-2xl shadow-md text-xs sm:text-sm max-w-full sm:max-w-[90%] 
        ${isSender ? "bg-black text-white " : "bg-black text-white "}`}
                                                                                                >
                                                                                                    {/* Text message */}
                                                                                                    {message?.messageType !== "file" && message.message && (
                                                                                                        <p className="whitespace-pre-wrap break-words">{message.message}</p>
                                                                                                    )}

                                                                                                    {/* File message */}
                                                                                                    {message?.messageType === "file" && (
                                                                                                        <div className="rounded-lg flex items-center gap-3 p-2">
                                                                                                            {message.fileType && imageMimeType.includes(message.fileType) ? (
                                                                                                                <div
                                                                                                                    className="relative cursor-pointer group"
                                                                                                                    onClick={() => openMediaPreview(message.message, message.fileType)}
                                                                                                                >
                                                                                                                    <Image
                                                                                                                        src={message.message || ""}
                                                                                                                        alt="Uploaded Image"
                                                                                                                        width={140}
                                                                                                                        height={140}
                                                                                                                        unoptimized={true}
                                                                                                                        priority
                                                                                                                        className="rounded-lg max-w-[120px] hover:opacity-90 transition-opacity"
                                                                                                                    />
                                                                                                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                                                                                                        <Maximize className="w-4 h-4 text-white" />
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            ) : message.fileType && videoMimeType?.includes(message.fileType) ? (
                                                                                                                <video
                                                                                                                    controls
                                                                                                                    className="rounded-lg max-w-[120px]"
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
                                                                                                                    <FileText className="w-5 h-5 text-gray-600" />
                                                                                                                    <span className="truncate max-w-[100px] sm:max-w-full">
                                                                                                                        {message.message.slice(0, 20)}
                                                                                                                    </span>
                                                                                                                    <a
                                                                                                                        href={message.message}
                                                                                                                        target="_blank"
                                                                                                                        rel="noopener noreferrer"
                                                                                                                        className="text-blue-500 hover:underline"
                                                                                                                    >
                                                                                                                        <Eye className="w-4 h-4 text-orange-500" />
                                                                                                                    </a>
                                                                                                                </div>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {/* Reply Preview */}
                                                                                                    {message.parentMessageId && (
                                                                                                        <div className="mt-2 p-2 border-l-4 border-gray-300 text-sm italic">
                                                                                                            Replying to: <span className="font-medium">{message.parentMessageId}</span>
                                                                                                        </div>
                                                                                                    )}

                                                                                                    {/* Seen indicator */}
                                                                                                    {isSender && isLastMessage && message.seen && (
                                                                                                        <div className="text-xs text-blue-500 mt-1 text-right">Seen</div>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>



                                                                                        {isSender && (
                                                                                            <div className="w-7 h-7 sm:w-10 sm:h-10 mt-4 flex items-center justify-center bg-gray-800 text-white text-xs sm:text-sm font-semibold rounded-full shrink-0">
                                                                                                {getInitials(`${agentData?.user?.firstName} ${agentData?.user?.lastName}` || '')}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>

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
                                                <div ref={endMessageRef} />
                                            </ScrollArea>

                                            <div className="p-2 sm:p-4 border-t relative">
                                                {fileErrorMsg && (
                                                    <div className="absolute -top-10 left-0 right-0 bg-red-100 text-red-600 p-2 text-xs sm:text-sm text-center">
                                                        {fileErrorMsg}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1 sm:gap-2 w-full px-2 sm:px-4 py-2 bg-white border-t">
                                                    {/* File Upload Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            className="p-2 rounded-full hover:bg-[#FAF9F5] transition"
                                                            onClick={toggleUploadMenu}
                                                        >
                                                            <FolderOpenDot className="h-4 w-4 sm:h-5 sm:w-5 text-green-700" />
                                                        </button>

                                                        {showUploadMenu && (
                                                            <div
                                                                ref={uploadMenuRef}
                                                                className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg z-20 animate-fadeIn"
                                                            >
                                                                <div className="p-3 text-xs sm:text-sm">
                                                                    <p className="font-semibold text-gray-800 mb-2">Upload file</p>
                                                                    <div className="space-y-2">
                                                                        <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                                                            <Paperclip className="h-4 w-4 text-blue-500" />
                                                                            <span>Image</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/jpeg,image/png,image/jpg"
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                        </label>
                                                                        <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                                                            <Play className="h-4 w-4 text-red-500" />
                                                                            <span>Video</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="video/mp4,video/webm,video/ogg"
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                        </label>
                                                                        <label className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                                                            <FileText className="h-4 w-4 text-gray-500" />
                                                                            <span>Document</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="application/pdf"
                                                                                className="hidden"
                                                                                onChange={handleFileChange}
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Emoji Picker */}
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            className="p-2 rounded-full hover:bg-gray-100 transition"
                                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                        >
                                                            <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                                        </button>

                                                        {showEmojiPicker && (
                                                            <div
                                                                ref={emojiPickerRef}
                                                                className="absolute bottom-12 left-0 z-20 scale-90 sm:scale-100 origin-bottom-left animate-fadeIn">
                                                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Message Input */}
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            handleSendMessage();
                                                        }}
                                                        className="flex-1"
                                                    >
                                                        <Input
                                                            placeholder="Type a message..."
                                                            value={message}
                                                            onChange={handleInputChange}
                                                            className="w-full text-xs sm:text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-300"
                                                        />
                                                    </form>

                                                    {/* Send Button */}
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        className="bg-black hover:bg-orange-500 text-white rounded-xl flex items-center justify-center h-8 w-8 sm:h-10 sm:w-auto sm:px-3 sm:gap-2 transition"
                                                        onClick={handleSendMessage}
                                                    >
                                                        <SendHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        <span className="hidden sm:inline">Send</span>
                                                    </Button>
                                                </div>

                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex mt-5 justify-center items-center h-40">
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

                    {/* Property Details Sidebar */}
                    {isDetails && (
                        <div className={`w-full md:w-96 bg-gray-50 border-l ${showDetails ? "block" : "hidden md:block"}`}>
                            <div className="p-4 border-b flex justify-between items-center">
                                <h2 className="font-semibold">Property Details</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setIsDetails(false)
                                        setShowDetails(false)
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <ScrollArea className="h-[calc(82vh-10rem)]">
                                <div className="p-4">
                                    {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                                        <Carousel images={propertyDetails?.property?.property?.imageURLs} />
                                    </div> */}
                                    <div className="relative">
                                        <Image
                                            src={propertyData?.media?.photosList?.[0]?.lowRes || ""}
                                            alt={`Property Image `}
                                            width={400}
                                            height={100}
                                            className="rounded-lg objectcover"
                                            priority
                                            unoptimized
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-1">
                                                <LocationOnIcon className="text-primary" />
                                                <div>
                                                    {/* <h3 className="font-semibold text-lg">{propertyDetails?.property?.address}</h3> */}
                                                    <p className="text-sm text-muted-foreground">{propertyData?.courtesyOf}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                <span>4.6</span>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="flex justify-between items-center mt-4">
                                            <div className="flex gap-2">
                                                {/* Bedroom Capsule */}
                                                <div className="bg-gray-200 text-sm rounded-full px-3 py-1 flex items-center">
                                                    <BathtubIcon />
                                                    <span>{propertyData?.property?.bathroomsTotal
                                                    } Bath</span>
                                                </div>
                                                {/* Bathroom Capsule */}
                                                <div className="bg-gray-200 text-sm rounded-full px-3 py-1 flex items-center">
                                                    <KingBedIcon />
                                                    <span>{propertyData?.property?.bedroomsTotal} Bed</span>
                                                </div>
                                            </div>
                                            {/* Heart Icon */}
                                            <FavoriteBorder className="text-gray-500 hover:text-red-500 cursor-pointer" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-lg">Overview</h4>
                                        <span>

                                            {propertyData?.publicRemarks}
                                        </span>

                                        {/* Modal for full description */}
                                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Property Overview</DialogTitle>
                                                    <DialogDescription>{propertyData?.property?.descriptions?.[0]?.value}</DialogDescription>
                                                </DialogHeader>
                                                <DialogClose asChild>
                                                    <Button className="bg-orange-500 hover:bg-orange-600">Close</Button>
                                                </DialogClose>
                                            </DialogContent>
                                        </Dialog>
                                    </div>

                                    <div className="mt-6">
                                        <h4 className="font-medium mb-2">Amenities</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Wifi className="h-4 w-4" />
                                                <span className="text-sm">Wifi</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Kitchen className="h-4 w-4" />
                                                <span className="text-sm">Kitchen</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Maximize2 className="h-4 w-4" />
                                                <span className="text-sm">Workspace</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Car className="h-4 w-4" />
                                                <span className="text-sm">Free parking</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Wind className="h-4 w-4" />
                                                <span className="text-sm">Air conditioning</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ScrollArea>
                            {/* <Button
                                className="ms-2 me-5 shadow bg-orange-500 hover:bg-orange-600 w-full mt-6"
                                onClick={() => {
                                    router.push(`/buy/${propertyData.property?.id}/prop/preview`)
                                }}
                            >
                                View details
                            </Button> */}
                        </div>
                    )}
                </div>
            </section>
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

