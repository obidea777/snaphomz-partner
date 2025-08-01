'use client';

import React from 'react';
import { Button } from "components/ui/button";
import { usePropertyRequest } from '../../providers/PropertyRequestModal';

export default function PropertyRequestExample() {
  const { showPropertyRequest } = usePropertyRequest();

  // Example property data
  const examplePropertyData = {
    media: {
      primaryListingImageUrl: "/images/property-sample.jpg"
    },
    courtesyOf: "Luxury Beach Villa",
    address: {
      unparsedAddress: "123 Ocean Drive, Miami Beach, FL 33139"
    }
  };

  // Example user data
  const exampleUserData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com"
  };

  // Function to trigger the global property request modal
  const handleShowPropertyRequest = () => {
    showPropertyRequest(examplePropertyData, exampleUserData);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Property Request Example</h1>
      <p className="mb-4">
        Click the button below to show the global property request modal.
        This modal can be triggered from anywhere in the application.
      </p>
      
      <Button 
        onClick={handleShowPropertyRequest}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Show Property Request Modal
      </Button>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">How to Use in Any Component</h2>
        <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-auto">
          {`// 1. Import the hook
import { usePropertyRequest } from 'providers/PropertyRequestModal';

// 2. Use the hook in your component
const { showPropertyRequest } = usePropertyRequest();

// 3. Call the function with property and user data
showPropertyRequest(propertyData, userData);`}
        </pre>
      </div>
    </div>
  );
} 