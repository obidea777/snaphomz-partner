'use client';

import { ForgotPasswordForm } from 'components/forgot-password/forgot-password-form';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

const PasswordReset = () => {
  const params = useSearchParams();
  const step = params?.get('step');


  return <ForgotPasswordForm />
  
};

export default PasswordReset;
