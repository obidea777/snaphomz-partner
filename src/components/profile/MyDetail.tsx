'use client';
import { useState, useEffect, useRef } from 'react';
import { useForm } from '@mantine/form';
import { TextInput, Switch } from '@mantine/core';
import { useAtom } from 'jotai';
import { agentReadWriteAtom } from 'store/atoms/agent-atom';
import { useUpdateUserDetailsApi, useUploadProfilePicture } from 'lib/api/useUpdateUserDetailApi';
import { Button } from 'components/ui/button';


export default function MyDetailsTab() {
  const [agentState, setAgentState] = useAtom(agentReadWriteAtom);
  const {user} =  agentState
  const [previewUrl, setPreviewUrl] = useState<string>(user?.profile || '');
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      licenseNumber: user?.licenseNumber || '',
      address: user?.address || '',
      zipCode: user?.zipCode || '',
      bio: user?.bio || '',
      
    },
  });

  const {
    mutate: updateUserProfile,
    isPending,
    isSuccess,
    data,
  } = useUpdateUserDetailsApi();

  const {
    uploadProfilePictureFile,
    isUploading,
    data: uploadData,
    error: uploadError,
  } = useUploadProfilePicture();

  // Set new image preview on upload complete
  useEffect(() => {
    if (uploadData?.url) {
      setPreviewUrl(uploadData.url);
      setUploadedUrl(uploadData.url);
    }
  }, [uploadData]);


  console.log("AGENT DETAIL" , agentState , isSuccess , data)

  // After successful profile update, update user in state
  useEffect(() => {
    if (isSuccess) {
        setAgentState({
            ...agentState, // <- current value
            user: {
              ...agentState.user,
              ...data,
              profile: uploadedUrl || user?.profile || '',
            },
          });
    }
  }, [isSuccess]);

  const handleSubmit = (values: typeof form.values) => {
    updateUserProfile({
      ...values,
      profile: uploadedUrl || user?.profile || '',
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadProfilePictureFile(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <div className="border p-6 bg-white rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>

        <div className="flex items-center gap-6 mb-4">
          {/* <div
            className="relative group w-28 h-28 rounded-full overflow-hidden border shadow cursor-pointer"
            onClick={handleImageClick}
          >
            <img
              src={previewUrl || '/default-avatar.png'}
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold rounded-full">
              Change
            </div>
          </div> */}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div>
            {isUploading && <p className="text-sm text-gray-600">Uploading...</p>}
            {uploadError && <p className="text-sm text-red-600">Error: {uploadError}</p>}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-4">
          <TextInput label="First Name" {...form.getInputProps('firstName')} />
          <TextInput label="Last Name" {...form.getInputProps('lastName')} />
          <TextInput label="License Number" {...form.getInputProps('licenseNumber')} />
          <TextInput label="Address" {...form.getInputProps('address')} />
          <TextInput label="Zip Code" {...form.getInputProps('zipCode')} />
          <TextInput label="Bio" {...form.getInputProps('bio')} />

          <div className="flex gap-4">
            <button  color='orange' className='px-6 py-2 bg-orange-500 text-white rounded-full' type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
           
              color='orange'
              className='px-4 py-2 rounded-full border border-black' 
              onClick={() => {
                setPreviewUrl(user?.profile || '');
                setUploadedUrl(null);
                form.setValues({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  licenseNumber: user?.licenseNumber || '',
                  address: user?.address || '',
                  zipCode: user?.zipCode || '',
                  bio: user?.bio || '',
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Public Profile Settings */}
      <div className="border p-6 bg-white rounded-lg shadow-sm space-y-4">
        <h3 className="text-lg font-semibold">Public Profile</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Make Contact Info Public</p>
            <p className="text-xs text-gray-500">Visible to users viewing your profile</p>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Show in Search</p>
            <p className="text-xs text-gray-500">Lets users find your profile</p>
          </div>
          <Switch />
        </div>
      </div>

      {/* Delete Account */}
      <div className="border bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Delete Profile</h3>
        <p className="text-sm text-gray-600 mb-4">
          Delete your account and all your data. This cannot be undone.
        </p>
        <Button color="red">Delete Account</Button>
      </div>
    </div>
  );
}
