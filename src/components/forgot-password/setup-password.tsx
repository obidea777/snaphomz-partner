'use client';

import { useForm } from '@mantine/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForgotPassword } from 'lib/api/useForgotPassword';
import { ButtonLoader } from 'components/ui/loader';
import { PasswordInput2 } from 'components/ui/password-input-2';
import { Button } from 'components/ui/button';
import Link from 'next/link';


export const SetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams()

  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      password: (value) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value)
          ? null
          : 'Minimum 8 characters, at least 1 letter, 1 number and 1 special character',
      
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords did not match',
    },
  });
  
  const { resetPasswordMutation } = useForgotPassword();

  const { isSuccess } = resetPasswordMutation

  if (isSuccess) {
    router.push(`/`);
  }

  console.log(searchParams.get('token'))

  const isValid =
    form.values.confirmPassword.length > 3 &&
    form.values.password.length > 3 &&
    form.isValid();

  return (
    <div className=' px-20 pt-32'>
    <form
      className='h-max min-w-[450px] '
      onSubmit={form.onSubmit((values) => {
        resetPasswordMutation.mutate({ token:searchParams.get('token')|| '' , newPassword:values?.password });
      })}
      
    >
      <button className='mb-4'>back</button>
      <section>
        <section className=''>
          <h3 className='mb-4 text-xl font-medium'>Set New Password</h3>
        </section>

        <div>
          <label className='mb-2 block font-medium text-gray-700'>
            Password
          </label>
          <PasswordInput2
            placeholder='Password'
            className='w-full py-4'
            {...form.getInputProps('password')}
          />
        </div>

        <div>
          <label className='mb-2 block font-medium text-gray-700'>
            Confirm Password
          </label>
          <PasswordInput2
            placeholder='Confirm Password'
            className='w-full py-4'
            {...form.getInputProps('confirmPassword')}
          />
        </div>

        <Button
          disabled={resetPasswordMutation.isPending || !isValid}
          size='lg'
          className='w-full disabled:bg-orange-600'
          roundness='md'
          type='submit'
          variant='ocreal'
        >
          {resetPasswordMutation.isPending ? <ButtonLoader /> : null}
          Change Password
        </Button>
        <div className='flex justify-end my-2'>
            <Link href={'/'}>want to login?</Link>
        </div>
      </section>
    </form>
    </div>
  );
};
