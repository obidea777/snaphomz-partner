import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { success } from "components/alert/notify";
import { getAuthToken } from "lib/storage";

export const useSellerAPI = (handleCb?: () => void) => {
    const GRAPHQL_URI = process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL || "http://localhost:4000/graphql";

    const createUserByEmailMutation = useMutation({
        mutationKey: ['create-user'],
        mutationFn: async (data: any) => {
            const token = getAuthToken() || localStorage.getItem('userAccessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.post(
                GRAPHQL_URI,
                {
                    query: `
          mutation createUserByEmail($email: String!,$accountType: String!) {
            createUserByEmail(email: $email,accountType: $accountType) {
              id
              email
              lastName
              firstName
            }
          }
        `,
                    variables: { ...data },
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status !== 200 || response.data.errors) {
                throw new Error(response.data?.errors?.[0]?.message || 'Failed to create user');
            }

            return response.data.data.createUserByEmail;
        },
        onSuccess: (data) => {
            // success({ message: 'User created successfully!' });
            if (handleCb) handleCb();
        },
        onError: (error: any) => {
            const errorMessage = error?.response?.data?.errors?.[0]?.message || error.message;
            error({ message: errorMessage });
        },
    });


    return {
        createUserByEmailMutation
    }
}