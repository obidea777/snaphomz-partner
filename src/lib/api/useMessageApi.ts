import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { success } from "components/alert/notify";
import { getAuthToken } from "lib/storage";

export const useUserAgentMessageApi = (handleCb?: () => void) => {
  const GRAPHQL_URI = process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL || "http://localhost:4000/graphql";

  const createUserAgentThreadMutation = useMutation({
    mutationKey: ['create-user-agent-thread'],
    mutationFn: async (createUserAgentThreadInput: any) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        // Sending a POST request to the GraphQL endpoint
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              mutation createUserAgentThread($createUserAgentThreadInput: CreateUserAgentThreadInput!) {
                create_user_agent_thread(createUserAgentThreadInput: $createUserAgentThreadInput) {
                  id
                }
              }
            `,
            variables: {
              createUserAgentThreadInput,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Check if the response is successful
        if (response.status !== 200) {
          throw new Error(response?.data?.errors?.[0]?.message || 'Failed to create thread');
        }

        return response.data.data.creat_thread;  // Return the created thread
      } catch (error) {
        throw error;  // Re-throw error for handling in onError
      }
    },
    onSuccess: (data) => {
      // Handle success response
      success({ message: "Thread created successfully!" });
      if (handleCb) handleCb(); // Optional callback after success
    },
    onError: (error: any) => {
      console.error('Error creating thread:', error);
      const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
      error({ message: errorMessage });
    },
  });

  const getAllUserAgentThreadsMutation = useMutation({
    mutationKey: ['get-all-threads'],
    mutationFn: async (data: any) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              query getAllThreads {
                get_all_threads {
                  id
                  threadName
        
                  propertyId
                  message
                  createdAt
                  updatedAt
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

        if (response.status !== 200) {
          throw new Error(response?.data?.errors?.[0]?.message || 'Failed to fetch threads');
        }

        return response.data.data.get_all_threads;
      } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Fetched threads:', data);
    },
    onError: (error: any) => {
      console.error('Error fetching threads:', error);
      const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
      error({ message: errorMessage });
    },
  });

  const getAllThreadsByUserAgentMutation = useMutation({
    mutationKey: ['get_threads_by_user'],
    mutationFn: async (data: any) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              query GetThreadsByUser($userId: String!) {
               get_user_and_agent_threads(userId: $userId) {
                  id
                  threadName
                  propertyId
                  roomId
                  propertyName
              
                  propertyAddress
                  messages{
                    threadId
                    isRead
                    message
                  }
                  unreadCount
                  participants{
                    user 
                    { 
                     id
                    firstName
                    lastName
                    email
                    }
                  }
                  user{
                    id
                    firstName
                    lastName
                    email
                  }
                  parentMessage
                  buyerAgent {
                    id
                    firstName
                    lastName
                    email
                  }
                }
              }`,
            variables: {
              userId: data.userId,
              threadName: data.threadName,
              isRead: data.isRead
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(response?.data?.errors?.[0]?.message || 'Failed to fetch threads');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Fetched threads:', data);
    },
    onError: (error: any) => {
      console.error('Error fetching threads:', error);
      const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
      error({ message: errorMessage });
    },
  });

  const getAllUserAgentMessagesMutation = useMutation({
    mutationKey: ['conversationsByThread'],
    mutationFn: async (threadId: string) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              query threadId($threadId: String!) {
                messagesByThread(threadId: $threadId) {
                  id
                  isRead
                  messageType
                  fileType
                  message
                  senderId
                  createdAt
                }
              }`,
            variables: {
              threadId: threadId
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(response?.data?.errors?.[0]?.message || 'Failed to fetch threads');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching threads:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Fetched threads:', data);
    },
    onError: (error: any) => {
      console.error('Error fetching threads:', error);
      const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message || 'An error occurred';
      error({ message: errorMessage });
    },
  });

  const addParticipantsToThread = useMutation({
    mutationKey: ['addUserAgentToThread'],
    mutationFn: async (data: any) => {
      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
              mutation addParticipantsToThread($threadId: String!, $email: String!) {
                add_participant_to_thread(threadId: $threadId, email: $email) {
                  id
                  threadId
                  userId
                  approvalStatus
                  joinDate
                }
              }`,
            variables: { ...data }, // Spread the data to get threadId and email
          }
        );

        // Check for errors in the response
        if (response?.data?.errors || response.status !== 200) {
          const errorMessage =
            response?.data?.errors?.[0]?.message || 'Failed to add participant to thread';
          throw new Error(errorMessage); // Throw error if response contains errors or status is not 200
        }

        return response.data; // Return the successful response data
      } catch (error) {
        console.error('Error adding participant to thread:', error);
        throw error; // Re-throw error to be caught by onError callback
      }
    },
    onSuccess: (data) => {
      // Handle success response
      success({ message: 'Invitation sent to user successfully' });
      if (handleCb) handleCb(); // Optional callback after success
    },
    onError: (error: any) => {
      console.error('Error adding participant to thread:', error);

      // Ensure error message is properly extracted from the error object
      const errorMessage = error?.message || 'An error occurred while adding participant.';
      error({ message: errorMessage });
    },
  });
  const getThreadById = useMutation({
    mutationKey: ['thread'],
    mutationFn: async (id: string) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
            query GetUserThreadById($id: String!) {
              getUserThreadById(id: $id) {
                id
                  threadName
                  propertyId
                  roomId
                  propertyName
                  listingId
                  propertyAddress
                  messages{
                    threadId
                    isRead
                    message
                  }
                  unreadCount
                  participants{
                    user 
                    { 
                     id
                    firstName
                    lastName
                    email
                    }
                  }
                  user{
                    id
                    firstName
                    lastName
                    email
                  }
                  parentMessage
                  buyerAgent {
                    id
                    firstName
                    lastName
                    email
                  }
                }
        }`,
            variables: { id },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200 || response.data.errors) {
          throw new Error(response.data?.errors?.[0]?.message || 'Failed to fetch thread');
        }

        return response.data.data.getUserThreadById;
      } catch (error) {
        console.error('Error fetching thread:', error);
        throw error;
      }
    },
  });

  return {
    createUserAgentThreadMutation,
    getAllUserAgentThreadsMutation,
    getAllThreadsByUserAgentMutation,
    getAllUserAgentMessagesMutation,
    addParticipantsToThread,
    getThreadById
  };
};
