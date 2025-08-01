"use client";
import React, { useEffect, useState } from 'react';
import {
    Modal,
    Button,
    Card,
    CardContent,
    Typography,
    Avatar,
    Box,
    IconButton,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { ArrowLeft, Bath, BedDouble, Eye, GitPullRequestClosed, HeartHandshake, Loader2, Ruler } from 'lucide-react';
import { useAgentConversationApi } from 'lib/api/useConversationApi';
import { useAtom } from 'jotai';
import { agentReadWriteAtom } from 'store/atoms/agent-atom';
import Image from 'next/image';

const dummySnaps = [
    { id: '1', name: 'Snap Alpha', image: '', isPending: false },
    { id: '2', name: 'Snap Beta', image: '', isPending: true },
    { id: '3', name: 'Snap Gamma', image: '', isPending: false },
    { id: '4', name: 'Snap Delta', image: '', isPending: true },
];

const inviteRequests = [
    {
        id: '1',
        is_accepted: 'pending',
        user: {
            firstName: 'Alex',
            lastName: 'Johnson',
            image: '',
        },
        engagement: {
            propertyAddress: '123 Orange Ave, Los Angeles, CA',
        },
    },
    {
        id: '2',
        is_accepted: 'pending',
        user: {
            firstName: 'Maria',
            lastName: 'Garcia',
            image: 'https://randomuser.me/api/portraits/women/44.jpg',
        },
        engagement: {
            propertyAddress: '789 Sunset Blvd, San Diego, CA',
        },
    },
    {
        id: '3',
        is_accepted: 'accepted',
        user: {
            firstName: 'David',
            lastName: 'Kim',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
        },
        engagement: {
            propertyAddress: '456 Maple St, San Francisco, CA',
        },
    },
];


const SnapsPage = () => {
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false);
    const [isSnapz, setIsSnapz] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [properties, setProperties] = useState([]);
    const [snapz, setSnapz] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUser] = useAtom(agentReadWriteAtom);
    const {
        getAllSnapzRequest,
        updateSnapzById,
        getAllSnapzProperties
    } = useAgentConversationApi()

    const getAllRequests = async (status: string) => {
        if (status === "pending") {
            setIsLoading(true)
        } else
            setLoading(true)
        getAllSnapzRequest.mutateAsync({
            status,
            participentId: currentUser?.user?.id
        }, {
            onSuccess: (response: any) => {
                console.log("Response : ", response);
                if (status === "pending")
                    setPendingRequests(response)
                else
                    setSnapz(response);
                setIsLoading(false)
                setLoading(false);

            },
            onError: (error) => {
                console.log(error);
                setLoading(false);
                setIsLoading(false);
            }
        })
    }

    const updateSnapzRequest = async (id: string, status: string) => {
        updateSnapzById.mutateAsync({
            id,
            status,
        }, {
            onSuccess: (response: any) => {
                console.log("Response : ", response);
                setPendingRequests(response)
                setLoading(false)
                setSelectedRequest(null)
                setModalOpen(false)
            },
            onError: (error) => {
                console.log(error);
                setLoading(false)
                setSelectedRequest(null)
                setModalOpen(false)
            }
        })
    }

    const getAllProperties = async (snapId: string) => {
        setLoading(true);
        getAllSnapzProperties.mutateAsync(snapId, {
            onSuccess: (response: any) => {
                console.log("Response : ", response);
                setLoading(false);
                setProperties(response)
            },
            onError: (error) => {
                console.log(error);
                setLoading(false);
                setIsLoading(false);
            }
        })
    }

    useEffect(() => {
        if (currentUser?.user) {
            getAllRequests("accept")
        }
    }, [currentUser])
    return (
        <div className="min-h-screen bg-orange-20 mt-16 p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-600">Your Snapz</h1>
                <div className="flex gap-4">
                    {
                        !isSnapz ? <button
                            onClick={() => {
                                setIsSnapz(true)
                            }}
                            className="flex items-center gap-2 bg-transparent hover:bg-gray-400 text-black font-medium px-5 py-2 rounded-full transition"
                        >
                            <ArrowLeft />
                            Back
                        </button> : null
                    }

                    <button
                        onClick={() => {
                            setModalOpen(true);
                            getAllRequests("pending");
                        }}
                        className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-medium px-5 py-2 rounded-full shadow transition"
                    >
                        <GitPullRequestClosed />
                        View Requests
                    </button>
                </div>
            </div>
            {
                isSnapz ? <div className="min-h-[200px]">
                    {loading ? (
                        <div className="flex justify-center items-center h-[200px]">
                            <Loader2 className="animate-spin text-gray-500 w-8 h-8" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 cursor-pointer sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {snapz.map((snap) => (
                                <div
                                    key={snap.id}
                                    className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 transition hover:shadow-xl"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsSnapz(false)
                                        getAllProperties(snap?.snap?.id)
                                    }}
                                >
                                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-400 text-white text-xl font-semibold">
                                        {snap?.snap?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-500 text-base">{snap?.snap?.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div> : null
            }
            {!isSnapz && properties?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
                    {properties.map((item, idx) => (
                        <div
                            // onClick={handleClick}
                            key={idx}
                            className="flex w-full min-h-[520px] max-h-[520px] cursor-pointer flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-black border-2 hover:border-orange-600 hover:scale-[1.02] group"
                        >
                            {/* Image / Carousel Section */}
                            <div className="relative h-48 w-full">
                                <Image
                                    src={item?.image}
                                    alt="Property"
                                    fill
                                    className="object-cover"
                                    priority
                                    unoptimized
                                />
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-1 flex-col justify-between p-5 space-y-3 group-hover:bg-black transition-colors duration-300">
                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-ocOrange transition-colors duration-300">
                                        {item?.price || 0} USD
                                    </h3>
                                </div>

                                {/* Courtesy */}
                                <p className="text-sm text-gray-300">{item?.name}</p>

                                {/* Address */}
                                <div className="text-sm text-white leading-snug">
                                    <p className="font-medium">{item?.address}</p>
                                    <p>
                                        {item?.address}, {item?.zipCode}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-700">
                                    {[
                                        {
                                            icon: <BedDouble className="w-4 h-4 text-ocOrange" />,
                                            value: item?.bedRooms || 0,
                                            unit: 'Bed',
                                        },
                                        {
                                            icon: <Bath className="w-4 h-4 text-ocOrange" />,
                                            value: item?.bathRooms || 0,
                                            unit: 'Bath',
                                        },
                                        {
                                            icon: <Ruler className="w-4 h-4 text-ocOrange" />,
                                            value: item?.sqft || 0,
                                            unit: 'sqft',
                                        },
                                    ].map((item, index) => (
                                        <div key={index} className="flex flex-col text-center w-1/3">
                                            {item.icon}
                                            <div className="flex items-center gap-1 mt-1 text-white text-base font-semibold">
                                                <span>{item.value}</span>
                                                <span className="text-xs text-gray-400">{item.unit}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[500px] bg-white rounded-2xl shadow-2xl p-6">
                    <div className="mt-4 space-y-4 min-h-[200px]">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
                            </div>
                        ) : pendingRequests.length ? (
                            [...pendingRequests].reverse().map((req,idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-between p-4 bg-gray-100 rounded-lg"
                                >
                                    {/* Left Side */}
                                    <div className="flex items-center space-x-4">
                                        {req?.user?.image ? (
                                            <img src={req?.snap?.user?.image} alt={req?.snap?.user?.firstName} className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-30 h-10 flex items-center justify-center bg-gray-300 text-gray-700 font-semibold rounded-full">
                                                {`${req?.snap?.user?.firstName?.charAt(0).toUpperCase()}${req?.snap?.user?.lastName?.charAt(0).toUpperCase()}`}
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-sm">
                                                <strong>{req?.snap?.user?.firstName} {req?.participant?.user?.lastName} </strong> has invited you to join his snapz -
                                                <span className="font-semibold">&nbsp;{req?.snap?.name}</span>
                                                {/* an agent */}
                                            </p>
                                            <p className="text-xs text-gray-500">{req?.engagement?.propertyAddress}</p>
                                            <a href="#" className="text-orange-500 text-sm">
                                                View Snapz
                                            </a>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {
                                        req?.status === "pending" ? <div className="flex space-x-2">
                                            <button className="bg-black text-white px-4 py-1 rounded-md"
                                                disabled={req?.id === selectedRequest && loading}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSelectedRequest(req.id);
                                                    updateSnapzRequest(req.id, "accept")
                                                }}
                                            >
                                                Accept
                                            </button>
                                            <button className="border border-black text-black px-4 py-1 rounded-md"
                                                disabled={req?.id === selectedRequest && loading}
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSelectedRequest(req.id);
                                                    updateSnapzRequest(req.id, "reject")
                                                }}
                                            >
                                                Decline
                                            </button>
                                        </div> : null
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">No requests avialabe yet.</p>
                        )}
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default SnapsPage;
