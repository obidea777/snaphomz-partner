'use client'

import { Button } from 'components/common/buttons/Button'
import { useAtom } from 'jotai'
import { atomWithMutation } from 'jotai-tanstack-query'
import { useAuthApi } from 'lib/api/auth'
import { Client } from 'lib/baseUrlClient'
import { pickErrorMessage, pickResult } from 'lib/client'
import Image from 'next/image'
import { showToast } from 'utils/toastHelper'
import { agentType } from '../../store/atoms/atoms'

export interface SignUpProps {
  onNext: () => void
}

// EXAMPLE USAGE

// export const fetchUserIdentity = async () => {
//   return await Client.post(`auth/agent/send-verification`, {
//     body: JSON.stringify({
//       email: 'johnnnnnfflofffffffffffvvydldddggfdegennd@gmail.com'
//     })
//   }).then(pickResult, pickErrorMessage)
// }

// const postAtom = atomWithMutation(() => ({
//   mutationKey: ['posts'],
//   mutationFn: fetchUserIdentity,
//   onSuccess(data) {
//     showToast('success', data.message, {
//       className: 'bg-green-500'
//     })
//   }
// }))

export default function SignUp({ onNext }: SignUpProps) {
  // const [{ mutate, status, data }] = useAtom(postAtom)
  // console.log({ data })
  const [selectedAgentType, setSelectedAgentType] = useAtom(agentType)

  const fetchUserIdentity = async () => {
    return await Client.post(`auth/agent/send-verification`, {
      body: JSON.stringify({
        email: 'johnnnnnfflgggggoffddfffffffffvvydldddggfdegennd@gmail.com'
      })
    }).then(pickResult, pickErrorMessage)
  }

  const postAtom = atomWithMutation(() => ({
    mutationKey: ['posts'],
    mutationFn: fetchUserIdentity,
    onSuccess(data) {
      showToast('success', data.message, {
        className: 'bg-green-500'
      })
    }
  }))

  // const [{ mutate, status: signUpStatus, data: signUp }] = useAtom(postAtom)

  return (
    <section className="md:w-1/2 justify-center align-center  pl-20 flex flex-col">
      <section className="md:w-10/12">
        <p className="text-black font-medium text-4xl">Choose Account Type</p>
        <p className="text-[#ACACAC] font-normal text-base mb-20 mt-3 w-6/12">
          {`To begin this journey, tell us what type of account you'd be opening.`}
        </p>
        <Button
          className="group relative justify-between px-6 py-10 bg-white text-black border border-transparent hover:bg-[#FFF3E4] hover:border-[#FF8700] active:bg-[#FFF3E4] active:border-[#FF8700] mb-6"
          onClick={() => {
            setSelectedAgentType('Snaphomz Agent/Broker')
            onNext()
          }}>
          <div className="flex items-center gap-4">
            <div className="bg-[#FF8700] rounded-lg p-3">
              <Image
                src="/assets/images/icons/user.svg"
                alt="user"
                className="object-contain"
                height={31}
                width={24}
              />
            </div>
            <div>
              <p className="text-black text-left font-medium text-lg">
                Snaphomz Partner
              </p>
              <p className="text-[#ACACAC] font-normal text-base">
                Personal account to manage all your activities.
              </p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Image
              src="/assets/images/icons/arrow-right.svg"
              alt="right-arrow"
              className="object-contain"
              height={31}
              width={24}
            />
          </div>
        </Button>
        {/* <Button
          className="group relative flex items-center justify-between w-full px-6 py-10 bg-white text-black border border-transparent hover:bg-[#FFF3E4] hover:border-[#FF8700] active:bg-[#FFF3E4] active:border-[#FF8700]"
          onClick={() => {
            setSelectedAgentType('External Agent/Broker')
            onNext()
          }}>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#FF8700] rounded-lg p-3">
              <Image
                src="/assets/images/icons/briefcase.svg"
                alt="user"
                className="object-contain"
                height={31}
                width={24}
              />
            </div>
            <div>
              <p className="text-black text-left font-medium text-xl">
                External Agent/Broker
              </p>
              <p className="text-[#ACACAC] font-normal text-base">
                Supervise agent-level licenses.
              </p>
            </div>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Image
              src="/assets/images/icons/arrow-right.svg"
              alt="right-arrow"
              className="object-contain"
              height={31}
              width={24}
            />
          </div>
        </Button> */}
      </section>
    </section>
  )
}

{
  /* 
  
  
  import {yupResolver} from '@hookform/resolvers/yup';
  import {useForm} from 'react-hook-form';
  import * as yup from 'yup';
  
  const schema = yup.object().shape({
    username: yup
      .string()
      .min(3, 'The name is too short.')
      .max(14, 'The name is too long.')
      .required()
      .matches(/^[a-zA-Z0-9_]+$/, 'The name contains special characters.'),
  });
  
  type IUsernameProps = {
    username: string;
  };
  
  export const useUsername = () => {
    const {
      getValues,
      control,
      handleSubmit,
      formState: {errors, isValid},
      reset,
    } = useForm<IUsernameProps>({
      resolver: yupResolver(schema),
      defaultValues: {
        username: '',
      },
      mode: 'all',
    });
  
    const onSubmit = (data: IUsernameProps) => {
      console.log({data});
  
      // reset form if change was successful
      reset();
    };
  
    return {
      handleSubmit: handleSubmit(onSubmit),
      control,
      errors,
      isValid,
      getValues,
    };
  };
  
  
  
  inside your page
           <Controller
                      render={({field: {onChange, value}}) => (
                        <OutlineInput value={value} onChangeText={onChange} />
                      )}
                      name="username"
                      control={control}
                    />
  
  
  */
}
