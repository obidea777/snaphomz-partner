 // Assuming you have a utility to fetch the auth token

import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { success,error } from "components/alert/notify";

import { getAuthToken } from "lib/storage";


const GRAPHQL_URI = process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL || 'http://localhost:4000/graphql';
// Replace with your actual GraphQL endpoint

export const useSellerPropertyApi = (handleCb?: () => void) => {
    const token = getAuthToken() || localStorage.getItem('userAccessToken');
  
    const createSellerPropertyMutation = useMutation({
      mutationKey: ['createSellerProperty'],
      mutationFn: async (createSellerPropertyInput: any) => {
        try {
          const response = await axios.post(
            GRAPHQL_URI,
            {
              query: `
                mutation CreateSellerProperty($createSellerPropertyInput: CreateSellerPropertyInput!) {
                  createSellerProperty(input: $createSellerPropertyInput) {
                    id
                    name
                    address
                    price
                    bedRooms
                    bathRooms
                    sqft
                 
                  }
                }
              `,
              variables: { createSellerPropertyInput },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.status !== 200 || response.data.errors) {
            throw new Error(response.data?.errors?.[0]?.message || 'Failed to create seller property');
          }

          console.log(response.data.data.createSellerProperty , response.data)
  
          return response.data.data.createSellerProperty;
        } catch (err) {
            console.log(err)
          throw new Error(err?.response?.data?.errors?.[0]?.message || err.message || 'An unexpected error occurred');
        }
      },
      onSuccess: (data) => {
        success({ message: 'Seller property created successfully!' });
        if (handleCb) handleCb();
      },
      onError: (err: any) => {
        const errorMessage = err?.message || 'An error occurred while creating the property';
        error({ message: errorMessage });
      },
    });

    const createMultipleClaimedCoBuyersMutation = useMutation({
      mutationKey: ['createMultipleClaimedCoBuyers'],
      mutationFn: async (createClaimedCoBuyerArrayInput: any) => {
        try {
          const response = await axios.post(
            GRAPHQL_URI,
            {
              query: `
                mutation CreateManyClaimedCoBuyers($createClaimedCoBuyerArrayInput: CreateClaimedCoBuyerArrayInput!) {
                  createManyClaimedCoBuyers(createClaimedCoBuyerArrayInput: $createClaimedCoBuyerArrayInput) {
                    id
                    name
                    email
                  }
                }
              `,
              variables: { createClaimedCoBuyerArrayInput },
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.status !== 200 || response.data.errors) {
            throw new Error(response.data?.errors?.[0]?.message || 'Failed to create claimed co-buyers');
          }
  
          return response.data.data.createManyClaimedCoBuyers;
        } catch (err) {
          console.log(err);
          throw new Error(err?.response?.data?.errors?.[0]?.message || err.message || 'An unexpected error occurred');
        }
      },
      onSuccess: (data) => {
        success({ message: 'Claimed Co-Buyers created successfully!' });
        if (handleCb) handleCb();
      },
      onError: (err: any) => {
        const errorMessage = err?.message || 'An error occurred while creating claimed co-buyers';
        error({ message: errorMessage });
      },
    });

    const uploadBuyerDocument = useMutation({
      mutationKey: ['upload_documents'],
      mutationFn: async (inputData:any) => {
        try {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
              mutation createBuyerDocument($input: CreateBuyerDocumentInput!) {
                createBuyerDocument(input: $input) {
                  id
                  name
                  propertyId
                  listingId
                }
              }
            `,
            variables: {
              input: {
                ...inputData
              }
            },
          });
  
          if (response.status !== 200 || response.data.errors) {
            throw new Error(
              response?.data?.errors?.[0]?.message || 'Failed to upload seller document'
            );
          }
  
          return response.data.data.createBuyerDocument;
        } catch (error: any) {
          console.error('Error uploading seller document:', error);
          throw error;
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
        console.error('GraphQL Error:', errorMessage);
        // You can optionally show a toast here
      },
    });
  
    const updateBuyerDocument = useMutation({
      mutationKey: ['update_documents'],
      mutationFn: async ({
        id,
        name,
        fileKey,
        propertyId,
        listingId,
      }: {
        id: string;
        name?: string;
        fileKey?: string;
        propertyId: string;
        listingId: string;
      }) => {
        try {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
              mutation updateBuyerDocument($input: UpdateBuyerDocumentInput!) {
                updateBuyerDocument(input: $input) {
                  id
                  name
                  propertyId
                  listingId
                  fileKey
                }
              }
            `,
            variables: {
              input: { id, name, fileKey, propertyId, listingId },
            },
          });
    
          if (response.status !== 200 || response.data.errors) {
            throw new Error(
              response?.data?.errors?.[0]?.message || 'Failed to update seller document'
            );
          }
    
          return response.data.data.updateBuyerDocument;
        } catch (error: any) {
          console.error('Error updating seller document:', error);
          throw error;
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
        console.error('GraphQL Error:', errorMessage);
        // Optional: Add a toast here
      },
    });
  
    const deleteBuyerDocument = useMutation({
      mutationKey: ['delete_documents'],
      mutationFn: async (id: string) => {
        try {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
              mutation deleteBuyerDocument($id: String!) {
                deleteBuyerDocument(id: $id)
              }
            `,
            variables: {
              id,
            },
          });
    
          if (response.status !== 200 || response.data.errors) {
            throw new Error(
              response?.data?.errors?.[0]?.message || 'Failed to delete seller document'
            );
          }
    
          return response.data.data.deleteBuyerDocument;
        } catch (error: any) {
          console.error('Error deleting seller document:', error);
          throw error;
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
        console.error('GraphQL Error:', errorMessage);
        // Optional: Add toast/notification here
      },
    });
  
    const getBuyPropertyDocuments = useMutation({
      mutationKey: ['get_documents'],
      mutationFn: async ({ listingId, propertyId }: { listingId: string; propertyId: string }) => {
        try {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
              query getBuyerDocuments($propertyId: String!, $listingId: String!) {
                getBuyerDocuments(propertyId: $propertyId, listingId: $listingId) {
                  id
                  name
                  type
                  url
                  user {
                    id
                    email
                    firstName
                    lastName
                    phone
                  }
                  listingId
                  propertyId
                }
              }
            `,
            variables: { propertyId, listingId },
          });
  
          if (response.status !== 200 || response.data.errors) {
            throw new Error(
              response?.data?.errors?.[0]?.message || 'Failed to fetch seller documents'
            );
          }
  
          return response.data.data.getBuyerDocuments;
        } catch (error: any) {
          console.error('Error fetching seller documents:', error);
          throw error;
        }
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
        console.error('GraphQL Error:', errorMessage);
        // Optional: replace `error` below with your toast/notification function
        // e.g., toast.error(errorMessage)
      },
    });

    const updateSellerPropertyMutation = useMutation({
      mutationKey: ["updateSellerProperty"],
      mutationFn: async (updateSellerPropertyInput: any) => {
        try {
          // const { sellerPropertyId, ...updateData } = updateSellerPropertyInput;
          const response = await axios.post(
            GRAPHQL_URI,
            {
              query: `
                mutation UpdateSellerProperty($sellerPropertyId: String!, $updateSellerPropertyInput: UpdateSellerPropertyInput!) {
                  updateSellerProperty(sellerPropertyId: $sellerPropertyId, updateSellerPropertyInput: $updateSellerPropertyInput) {
                    id
                    name
                    address
                    price
                    bedRooms
                    bathRooms
                    sqft
                  }
                }
              `,
              variables: updateSellerPropertyInput,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          if (response.status !== 200 || response.data.errors) {
            throw new Error(response.data?.errors?.[0]?.message || "Failed to update seller property");
          }
  
          console.log(response.data.data.updateSellerProperty, response.data);
  
          return response.data.data.updateSellerProperty;
        } catch (err) {
          console.log(err);
          throw new Error(
            err?.response?.data?.errors?.[0]?.message || err.message || "An unexpected error occurred"
          );
        }
      },
      onSuccess: (data) => {
        success({ message: "Seller property updated successfully!" });
        if (handleCb) handleCb();
      },
      onError: (err: any) => {
        const errorMessage = err?.message || "An error occurred while updating the property";
        error({ message: errorMessage });
      },
    });
    const propertyEngagementMutation = useMutation({
      mutationKey: ['property-engagement-mutation'],
      mutationFn: async (propertyEngagementData: any) => {                  
          const response = await axios.post(GRAPHQL_URI, {
              query: `
                mutation createEngagement($createPropertyEngagementData: PropertyEngagementDTO!) {
                  createEngagement(createPropertyEngagementData: $createPropertyEngagementData) {
                    id
                  }
                }
              `,
              variables: {
                createPropertyEngagementData: propertyEngagementData,
              },
            });
  
          return response.data;
      }
    });

    return {
      createSellerPropertyMutation,
      createMultipleClaimedCoBuyersMutation,
      uploadBuyerDocument,
      updateBuyerDocument,
      deleteBuyerDocument,
      getBuyPropertyDocuments,
      updateSellerPropertyMutation,
      propertyEngagementMutation,
    };
  };

  export const useGetSellerProperties = () => {
    const token = getAuthToken() || localStorage.getItem('userAccessToken');
  
    return useQuery({
      queryKey: ['sellerProperties'],
      queryFn: async () => {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              query {
                sellerProperties {
                  id
                  name
                  address
                  zipCode
                  city
                  listingId
                  propertyId
                  
                  price
                  bedRooms
                  bathRooms
                  sqft
                  status
                  image
                }
              }
            `,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.status !== 200 || response.data.errors) {
          throw new Error(response.data?.errors?.[0]?.message || 'Failed to fetch seller properties');
        }
  
        return response.data.data.sellerProperties;
      },
      enabled: !!token,
    });
  };
  

  export const useSharedProperties = ()=> useQuery({
    queryKey: ['sharedProperties'],
    queryFn: async () => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.post(
        GRAPHQL_URI,
        {
          query: `
            query {
              sharedProperties {
                id
                propertyId
                propertyUrl
                propertyImage
                propertyAddress
                createdAt
               
              }
            }
          `,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200 || response.data.errors) {
        throw new Error(response.data.errors?.[0]?.message || 'Failed to fetch shared properties');
      }

      return response.data.data.sharedProperties;
    },
    enabled:true,

  });




