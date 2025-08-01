import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { success,error } from "components/alert/notify";


interface ResetPasswordInput {
    token: string;
    newPassword: string;
  }

export const useForgotPassword = () =>{

    const GRAPHQL_URI = process.env.NEXT_PUBLIC_AUTH_SERIVCE_GRAPHQL_URL || "http://localhost:4000/graphql"

    const forgotPasswordMutation = useMutation({
        mutationKey: ['forgot-password'],
        mutationFn: async (email: string) => {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
                mutation ForgotPassword($email: String!) {
                  forgotPassword(email: $email)
                }
              `,
            variables: { email },
          });
    
          return response.data?.data?.forgotPassword;
        },
        onSuccess: (message) => {
          success({ message: message || 'Password reset link sent to your email.' });
        },
        onError: (err: any) => {
          error({ message: err?.response?.data?.errors?.[0]?.message || 'Something went wrong' });
        },
      });
    
      const resetPasswordMutation = useMutation({
        mutationKey: ['reset-password'],
        mutationFn: async ({ token, newPassword }: ResetPasswordInput) => {
          const response = await axios.post(GRAPHQL_URI, {
            query: `
                  mutation ResetPassword($token: String!, $newPassword: String!) {
                    resetPassword(token: $token, newPassword: $newPassword)
                  }
                `,
            variables: { token, newPassword },
          });
    
          return response.data?.data?.resetPassword;
        },
        onSuccess: () => {
          success({ message: 'Password has been reset successfully.' });
        },
        onError: (err: any) => {
          error({ message: err?.response?.data?.errors?.[0]?.message || 'Reset failed' });
        },
      });
    return{
      forgotPasswordMutation,
      resetPasswordMutation
    }
}