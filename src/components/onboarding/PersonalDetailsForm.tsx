import { Button } from 'components/common/buttons/Button'
import { TextInput } from 'components/common/inputs/TextInput'
import { schema } from './validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { useUpdateAgentProfile } from '../../hooks/useOnboarding'
import { agentEmailAtom, loginAtom } from '../../store/atoms/atoms'
import { useAtom } from 'jotai'
import { agentReadWriteAtom } from 'store/atoms/agent-atom'
import { useRouter } from 'next/navigation'

export interface PersonalDetailsFormProps {
  onNext: () => void
}

interface IUpdateAgentDetailsInput {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  zipCode?: string
  licenseNumber?: string
  password?: string
  email?: string
}

export default function PersonalDetailsForm({
  onNext
}: PersonalDetailsFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUpdateAgentDetailsInput>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  })
  const [{ mutateUpdateAgentProfile, status }] = useUpdateAgentProfile()
  const [agentEmail] = useAtom(agentEmailAtom)
  const [, setLoginDetails] = useAtom(loginAtom)
  const [_, setAgentState] = useAtom(agentReadWriteAtom)
  const router = useRouter()

  const onSubmit = (data: IUpdateAgentDetailsInput) => {
    const updatedData = { ...data, email: agentEmail,confirmPassword:undefined }
    mutateUpdateAgentProfile(updatedData, {
      onSuccess: (data: any) => {
        setLoginDetails({
          email: updatedData?.email,
          password: updatedData?.password
        })
        const newAgent = {
          is_authenticated: true,
          user: {
            ...data?.data?.updateAgent
          }
        }
        void setAgentState(newAgent)
        void router.push('/partner-dashboard')
        // onNext()
      }
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap ">
      <section className="flex   w-full gap-x-4">
        <TextInput
          className=" mt-8 h-8 border-b "
          label="First Name"
          type="text"
          name="firstName"
          error={errors['firstName']}
          register={register}
        />
        <TextInput
          className=" mt-8 h-8 border-b "
          label="Last Name"
          type="text"
          name="lastName"
          error={errors['lastName']}
          register={register}
        />
      </section>
      <section className="flex  w-full gap-x-4">
        <TextInput
          className="  mt-8 h-8 border-b "
          label="Primary Phone"
          name="phoneNumber"
          error={errors['phoneNumber']}
          register={register}
        />
        <TextInput
          className="  mt-8 h-8 border-b "
          label="Zip Code"
          type="text"
          name="zipCode"
          error={errors['zipCode']}
          register={register}
        />
      </section>

      <section className="flex   w-full gap-x-4">
        <TextInput
          className=" h-8 my-8 border-b "
          label="Password"
          type="password"
          name="password"
          error={errors['password']}
          register={register}
        />
        <TextInput
          className="h-8 my-8 border-b"
          label="Re-enter Password"
          type="password"
          name="confirmPassword"
          error={errors['confirmPassword']}
          register={register}
        />

      </section>
      <section className='flex w-full gap-x-4'>
        <TextInput
          className=" h-8 my-8 border-b "
          label="License number"
          name="licenseNumber"
          error={errors['licenseNumber']}
          register={register}
        />
      </section>

      <Button
        className="text-white bg-black font-semibold text-lg"
        type="submit"
        loading={status === 'pending'}>
        Submit
      </Button>
    </form>
  )
}
