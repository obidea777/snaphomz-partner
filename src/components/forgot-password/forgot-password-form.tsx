'use client';
import { useForm } from '@mantine/form';
import Link from 'next/link';

import { useForgotPassword } from 'lib/api/useForgotPassword';
import CustomTextInput from 'components/ui/text-input';
import { cn } from 'lib/utils';
export const ForgotPasswordForm = () => {
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const { forgotPasswordMutation } = useForgotPassword();

  return (
    <div className=' px-20 pt-48'>
    <form
      className='h-max min-w-[400px]'
      onSubmit={form.onSubmit((values) => {
        forgotPasswordMutation.mutate(values?.email );
      })}
    >
      <button className='mb-4'>back</button>
      <section>
        <section className=''>
          <h3 className='mb-4 text-xl font-medium'>Forgot Password?</h3>
        </section>
        <CustomTextInput
          label='Enter Your Email to get Verification Code'
          placeholder='Enter Your Email'
          className='w-full py-4'
          {...form.getInputProps('email')}
          type='email'
        />
        <button
          className={cn(
            'w-full rounded-md py-3 font-bold text-white disabled:bg-orange-300',
            !form.isValid()
              ? 'cursor-not-allowed bg-primary-main/20'
              : 'bg-primary-main',
              forgotPasswordMutation.isPending
              ? 'bg-orange-500'
              : 'bg-primary-main',
          )}
          type='submit'
          disabled={!form?.isValid()}
        >
          {forgotPasswordMutation.isPending ? 'Loading...' : 'Continue'}
        </button>
        <section className='cursor-pointer py-4 text-right text-sm text-black'>
          <Link href='/' className='font-semibold text-primary-main'>
            want to Login?
          </Link>
        </section>
      </section>
    </form>
    </div>
  );
};
