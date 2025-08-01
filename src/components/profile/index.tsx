'use client';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { Button } from '@mantine/core';
import { useUpdateUserDetailsApi } from 'lib/api/useUpdateUserDetailApi'; // Custom hook for mutation
import { useAtom } from 'jotai';
import { agentReadWriteAtom } from 'store/atoms/agent-atom';
import CustomTextInput from 'components/ui/text-input'; // Assuming you have a custom input component
import { Textarea } from 'components/ui/textarea';

type Props = {
  cb?: () => void;
};

export function PersonalInfoForm({ cb }: Props) {
  const [{ user }, setAgentState] = useAtom(agentReadWriteAtom);
  const isLoading = false
  const { mutate: updateUserProfileMutation } = useUpdateUserDetailsApi();
  // Use form for multiple fields
  const form = useForm({
    initialValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      confirmPassword: '',
      bio: user?.bio,
      zipCode: user?.zipCode,
      address: user?.address,
      licenseNumber: user?.licenseNumber,
    }
  });

//   useEffect(() => {
//     if (isError) {
//       // Handle error state (e.g., show error messages)
//     }
//     if (!isLoading && cb && !isError) {
//       cb(); // Call callback after success
//     }
//   }, [isLoading, isError, cb]);

  // Handle form submission
  const handleSubmit = (values: typeof form.values) => {
    // Update user profile with the form values
    updateUserProfileMutation({
      firstName: values?.firstName,
      lastName: values?.lastName, // Only send password if it's not empty
      bio: values?.bio,
      zipCode: values?.zipCode,
      address: values?.address,
      licenseNumber: values?.licenseNumber,
    });
  };
  return (
    <form
      className="mt-4"
      onSubmit={form.onSubmit(handleSubmit)}
    >
        <div className=' flex w-full justify-between items-center'>
      <h2 className="text-2xl font-bold">Edit Profile</h2> 
      <div className='flex gap-4'>
      <Button
          size="md"
          bg={'red'}
          radius={'xl'}
          className="block w-full   font-semibold"
          disabled={!form.isValid || isLoading }
        >
          Cancel
     </Button>
      <Button
          size="md"
          type='submit'
           bg={'black'}
          radius={'xl'}
          className="block w-full   font-semibold"
          disabled={!form.isValid || isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </div>
     
        </div>
      <aside className="my-3 space-y-4">
        {/* First Name and Last Name in one row */}
        <div className="flex space-x-4">
          <CustomTextInput
            label="First Name"
            placeholder="First Name"
            className="w-1/2"
            {...form.getInputProps('firstname')}
          />

          <CustomTextInput
            label="Last Name"
            placeholder="Last Name"
            className="w-1/2"
            {...form.getInputProps('lastname')}
          />
        </div>

        {/* License Number */}
        <CustomTextInput
          label="License Number"
          placeholder="License Number"
          {...form.getInputProps('licenceNumber')}
        />

        {/* Address and Zipcode in one row */}
        <div className="flex space-x-4">
          <CustomTextInput
            label="Address"
            placeholder="Address"
            className="w-1/2"
            {...form.getInputProps('address')}
          />

          <CustomTextInput
            label="Zipcode"
            placeholder="Zipcode"
            className="w-1/2"
            {...form.getInputProps('zipcode')}
          />
        </div>

       {/* Bio Textarea */}
       <p>Bio</p>
       <Textarea
          
          placeholder="Write a short bio"
          className="w-full"
          {...form.getInputProps('bio')}
        />
       
      </aside>
    </form>
  );
}
