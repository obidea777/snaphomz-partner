'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Image from "next/image";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Button } from "components/ui/button";
import Modal from "components/common/Modal";
import { error, success } from 'components/alert/notify';

interface PropertyRequestData {
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

const PropertyRequestContext = createContext<PropertyRequestContextType>({
    showPropertyRequest: () => { },
    closePropertyRequest: () => { },
    isVisible: false,
});

// Hook to use the property request context
export const usePropertyRequest = () => useContext(PropertyRequestContext);

// Helper function to get initials from name
const getInitials = (name?: string) => {
    if (!name) return '';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
};

// Provider component
export const PropertyRequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [showModal, setShowModal] = useState(true);
    const data = {
        propertyImage: "https://imagecdn.realty.com/photos/red/396553963/1.jpg",
        propertyName: "Property Name",
        propertyAddress: "Property Address",
        userName: "John Doe",
        userEmail: "john.doe@example.com"
    }
    const [requestData, setRequestData] = useState<PropertyRequestData | null>(data);
    // Function to show the property request modal
    const showPropertyRequest = (propertyData: any, userData: any) => {
        setRequestData({
            propertyImage: propertyData?.media?.primaryListingImageUrl || "/placeholder.jpg",
            propertyName: propertyData?.courtesyOf || "Property Name",
            propertyAddress: propertyData?.address?.unparsedAddress || "Property Address",
            userName: `${userData?.firstName || ""} ${userData?.lastName || ""}`,
            userEmail: userData?.email || "user@example.com"
        });
        setShowModal(true);
    };

    // Function to close the modal
    const closePropertyRequest = () => {
        setShowModal(false);
    };

    // Handler for accepting the request
    const handleAcceptRequest = () => {
        success({ message: "Property request accepted" });
        setShowModal(false);
        // Add your actual implementation here to handle the acceptance
    };

    // Handler for rejecting the request
    const handleRejectRequest = () => {
        error({ message: "Property request rejected" });
        setShowModal(false);
        // Add your actual implementation here to handle the rejection
    };
    console.log("Request Data : ", requestData);

    return (
        <PropertyRequestContext.Provider
            value={{
                showPropertyRequest,
                closePropertyRequest,
                isVisible: true
            }}
        >
            {children}

            {/* Property Request Modal */}
            {showModal && requestData && (
                <Modal closeModal={closePropertyRequest} isOpen={showModal} useChildStyle={true}>
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto overflow-hidden">
                        <div className="relative w-full h-48">
                            <Image
                                src={requestData.propertyImage}
                                alt={requestData.propertyName || ""}
                                fill
                                className="object-cover"
                                unoptimized
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>

                        <div className="p-5">
                            <h2 className="text-xl font-bold mb-1">{requestData.propertyName}</h2>
                            <div className="flex items-center gap-1 mb-4 text-gray-600">
                                <LocationOnIcon className="text-gray-500 text-sm" />
                                <span className="text-sm">{requestData.propertyAddress}</span>
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
                                <Button
                                    variant="outline"
                                    className="border-red-500 text-red-500 hover:bg-red-50"
                                    onClick={handleRejectRequest}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 text-white hover:bg-green-700"
                                    onClick={handleAcceptRequest}
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </PropertyRequestContext.Provider>
    );
}; 