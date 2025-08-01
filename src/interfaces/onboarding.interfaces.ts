import { useFormInput } from 'components/common/inputs/TextInput'

export interface OnboardingPageChangeProps {
  onNext: () => void
  currentPage: number
}

export interface OnboardingFooterProps {
  message?: string
  actionText?: string
  actionLink?: string
  onClick?: any
}

export interface EmailVerificationStepsProps extends useFormInput {
  header: string
  message: string
  actionButton: string
  inputLabel: string
  onNext?: () => void
  loading: boolean
}
export interface InputField {
  id: number
  label: string
  type: string
}
