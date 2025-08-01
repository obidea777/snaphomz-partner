import { Button } from 'components/common/buttons/Button'
import { TextInput } from 'components/common/inputs/TextInput'
import { EmailVerificationStepsProps } from 'interfaces/onboarding.interfaces'

export default function EmailVerificationSteps({
  message,
  actionButton,
  inputLabel,
  header,
  name,
  register,
  error,
  loading
}: EmailVerificationStepsProps) {
  return (
    <>
      <p className="text-black font-medium text-4xl">{header}</p>
      <p className="text-[#ACACAC] font-light text-base mb-8 mt-3 w-9/12">
        {message}
      </p>
      <TextInput
        label={inputLabel}
        className="border-b"
        name={name}
        register={register}
        error={error}
      />

      <Button
        className="text-white bg-black font-semibold text-lg mt-20"
        type="submit"
        loading={loading}>
        {actionButton}
      </Button>
    </>
  )
}
