import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios from "axios";
import { success, error } from "components/alert/notify";
import { getAuthToken } from "lib/storage";
import { useCallback, useState } from "react";

// Define the type for the mutation response
interface UpdateUserResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  bio: string;
  zipcode: string;
  address: string;
  licenceNumber: string;
  profile?: string;
}

type UpdateUserVariables = Partial<{
  firstName: string;
  lastName: string;
  bio?: string;
  zipCode?: string;
  currentPassword?: string;
  newPassword?: string;
  address?: string;
  licenseNumber?: string;
  profile?: string;
}>

export const useUpdateUserDetailsApi = (handleCb?: () => void) => {
  const GRAPHQL_URI = process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL || "http://localhost:4000/graphql";

  const updateUserDetailsMutation = useMutation({
    mutationKey: ['update-user-details'],
    mutationFn: async (updateUserDetailsInput: UpdateUserVariables) => {
      const token = getAuthToken() || localStorage.getItem('userAccessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        const response = await axios.post(
          GRAPHQL_URI,
          {
            query: `
             mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    firstName
    lastName
    email
    bio
    address
    profile
    zipCode
    licenseNumber
  }
}

            `,
            variables: {
              input: updateUserDetailsInput,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.errors) {
          error({ message: response.data.errors[0].message })
          throw new Error(response.data.errors[0].message);
        }

        return response.data.data.updateUserDetails;  // Return the updated user details
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      success({ message: "User details updated successfully!" });
      if (handleCb) handleCb();
    }
  });

  return updateUserDetailsMutation;
};


export function useUploadProfilePicture() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const MORTGAGE_FILE_UPLOAD = process.env.NEXT_PUBLIC_MORTGAGE_SERIVCE_URL || "http://localhost:4001"

  const uploadProfilePictureFile = useCallback(async (file: File) => {
    if (!file) {
      setError('No file provided');
      return null;
    }
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${MORTGAGE_FILE_UPLOAD}/file-upload/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setData(response.data);
      return response.data;
    } catch (err: any) {
      console.error('Error uploading file:', err.message);
      if (err.response) {
        console.error('Server responded with status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Request setup error:', err.message);
      }
      setError(err.message || 'Upload failed');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { isUploading, error, data, uploadProfilePictureFile };
}