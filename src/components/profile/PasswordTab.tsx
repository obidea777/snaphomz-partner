'use client';
import { useForm } from '@mantine/form';
import { PasswordInput, Button } from '@mantine/core';
import { useUpdateUserDetailsApi } from 'lib/api/useUpdateUserDetailApi';
import { useEffect } from 'react';

export default function PasswordTab() {

    const {
        mutate: updateUserProfile,
        isPending,
        isSuccess,
        data,
      } = useUpdateUserDetailsApi();

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
        currentPassword: (value) =>
            value.length < 4 ? 'Current password is required' : null,
          newPassword: (value) =>
            value.length < 4 ? 'New password must be at least 4 characters' : null,
          confirmPassword: (value, values) =>
            value !== values.newPassword ? 'Passwords do not match' : null,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      passwordForm.reset();
    }
  }, [isSuccess, passwordForm]);


  const isValid =
  passwordForm.values.currentPassword.length > 3 &&
    passwordForm.values.newPassword.length > 3 &&
    passwordForm.values.confirmPassword.length > 3 &&
    passwordForm.isValid();
     
  return (
    <form
      className=" space-y-4 bg-white p-8 w-full border shadow-md rounded-xl "
      onSubmit={passwordForm.onSubmit((values) => {
        updateUserProfile({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
           })
      })}
    >
      <PasswordInput
        label="Current Password"
        {...passwordForm.getInputProps('currentPassword')}
      />
      <PasswordInput
        label="New Password"
        {...passwordForm.getInputProps('newPassword')}
      />
      <PasswordInput
        label="Confirm New Password"
        {...passwordForm.getInputProps('confirmPassword')}
      />
      <Button type="submit">Change Password</Button>
    </form>
  );
}
