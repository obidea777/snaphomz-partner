'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import EmailVerificationSteps from './EmailVerificationSteps'
import OnboardingFooter from './OnboardingFooter'
import OnboardingStepsCounter from './OboardingStepsCounter'
import { OnboardingPageChangeProps } from 'interfaces/onboarding.interfaces'
import { useSendVerificationEmail } from '../../hooks/useOnboarding'
import { agentEmailAtom } from '../../store/atoms/atoms'
import { useAtom } from 'jotai'

export interface IRegisterEmailInput {
  email?: string
}

export const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required')
})

export default function RegisterEmailPage({
  onNext,
  currentPage
}: OnboardingPageChangeProps) {
  const [, setAgentEmail] = useAtom(agentEmailAtom)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IRegisterEmailInput>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })

  const [{ mutateSendVerificationEmail, status, error }] =
    useSendVerificationEmail()

  const onSubmit = (data: IRegisterEmailInput) => {
    mutateSendVerificationEmail(data, {
      onSuccess: () => {
        setAgentEmail(data.email)
        onNext()
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:w-1/2 mt-20 align-center  pl-20 flex flex-col">
      <section className="md:w-10/12">
        <OnboardingStepsCounter currentPage={currentPage} />
        <EmailVerificationSteps
          header="Register"
          message="We will send a verification code to the email you provide."
          inputLabel="E-mail address"
          actionButton="Continue"
          name="email"
          error={errors['email']}
          register={register}
          loading={status === 'pending'}
        />
        <OnboardingFooter
          message="Already have an account?"
          actionText="Login"
          actionLink="/"
        />
      </section>
    </form>
  )
}
