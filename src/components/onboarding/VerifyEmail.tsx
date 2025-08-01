'use client'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import EmailVerificationSteps from './EmailVerificationSteps'
import OnboardingFooter from './OnboardingFooter'
import OnboardingStepsCounter from './OboardingStepsCounter'
import { OnboardingPageChangeProps } from 'interfaces/onboarding.interfaces'
import {
  useResendVerificationEmail,
  useVerifyAgentCode
} from '../../hooks/useOnboarding'
import { IRegisterEmailInput } from './RegisterEmail'
import { useAtom } from 'jotai'
import { agentEmailAtom } from 'store/atoms/atoms'
import { getStoredCookie, storeCookie } from 'lib/storage'
import { AUTH_TOKEN, SECURE_LOGIN_KEY } from 'shared/constants/env'
import { generateSHAString } from 'lib/helpers/generateSHAString'
import { showToast } from 'utils/toastHelper'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'

interface IVerifyEmailInput {
  code?: string
  email?: string
}

export const schema = yup.object().shape({
  code: yup
    .string()
    .required('Code is required')
    .matches(/^[0-9]{6}$/, 'Invalid code')
})

export default function VerifyEmailPage({
  onNext,
  currentPage
}: OnboardingPageChangeProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IVerifyEmailInput>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })
  const [AgentEmail] = useAtom(agentEmailAtom)

  const [{ mutateVerifyAgentCode, status }] = useVerifyAgentCode()
  const [{ mutateResendVerificationEmail }] = useResendVerificationEmail()
  const [_, setAgentState] = useAtom(agentReadWriteAtom)

  const handleResendCode = () => {
    const data: IRegisterEmailInput = { email: AgentEmail }
    mutateResendVerificationEmail(data, {})
  }

  function maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')

    if (localPart.length <= 2) {
      return `${localPart[0]}*****@${domain}`
    }

    const firstPart = localPart.slice(0, 2)
    const lastPart = localPart.slice(-1)

    return `${firstPart}*****${lastPart}@${domain}`
  }

  const onSubmit = (data: IVerifyEmailInput) => {
    mutateVerifyAgentCode(
      {
        ...data,
        email: AgentEmail
      },
      {
        onSuccess: (data) => {
          const newAgent = { is_authenticated: true }

          const secureLogin = generateSHAString(
            AgentEmail ?? 'secure@ocreal_agent'
          )
          storeCookie({ key: SECURE_LOGIN_KEY, value: secureLogin })

          storeCookie({
            key: AUTH_TOKEN,
            value: data?.data?.verifyOtp?.access_token
          })

          void setAgentState(newAgent)

          onNext()

          // const secure = getStoredCookie(SECURE_LOGIN_KEY)
          // if (secure !== undefined) {
          // const secureLogin = generateSHAString(
          //   data.data.user.email ?? 'secure@ocreal_agent'
          // )
          //  storeCookie({ key: SECURE_LOGIN_KEY, value: secureLogin })
          // showToast('success', data.message, {
          //   className: 'bg-green-500'
          // })
          // storeCookie({ key: AUTH_TOKEN, value: data.data.token })
          // void setAgentState(newAgent)
          //void router.push('/dashboard/sell')
          // } else {
          //   console.log('it returned undefined')
          // }
        }
      }
    )
  }
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:w-1/2 mt-20 align-center  pl-20 flex flex-col">
      <section className="md:w-10/12">
        <OnboardingStepsCounter currentPage={currentPage} />
        <EmailVerificationSteps
          header="Verify your email address"
          message={`We sent an email ${maskEmail(AgentEmail)}. Please check your inbox  and get the actual code to verify. Please resend email if you are yet to get one.`}
          inputLabel="Your Verification code"
          actionButton="Verify"
          name="code"
          error={errors['code']}
          register={register}
          loading={status === 'pending'}
        />
        <OnboardingFooter
          actionText="Resend email"
          onClick={() => handleResendCode()}
        />
      </section>
    </form>
  )
}
