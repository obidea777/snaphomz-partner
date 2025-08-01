import { Button } from 'components/common/buttons/Button'
import { useAtom } from 'jotai'
import { LoginFormValues, useAuthApi } from 'lib/api/auth'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { loginAtom } from 'store/atoms/atoms'

export default function SucessfulPage() {
  const [loginDetails] = useAtom(loginAtom)
  const { handleLogin, status } = useAuthApi()
  const handleSubmit = () => {
    console.log('hello')
    handleLogin(loginDetails)
  }

  return (
    <section className="md:w-1/2 justify-center align-center  pl-20 flex flex-col h-full">
      <section className="md:w-10/12   flex flex-col items-center">
        <div className=" flex justify-center mb-10">
          <Image
            src="/assets/images/icons/sucessful-icon.svg"
            alt="sucessful-icon"
            className="object-contain"
            height={130}
            width={130}
          />
        </div>
        <p className="text-black font-medium text-2xl w-full text-center ">
          Account created successfully!
        </p>
        <p className="text-[#ACACAC] font-light text-base mb-8 mt-3 w-full  text-center">
          Hey there partner! We’re excited to have you onboard on Snaphomz!
        </p>
        <Button
          className="text-white bg-black font-semibold text-lg mt-6 w-10/12"
          loading={status === 'pending'}
          onClick={() => handleSubmit()}>
          Go to Dashboard
        </Button>
      </section>
    </section>
  )
}
