import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }
  return (
    <section>
      <div onClick={handleBack} className="flex items-center cursor-pointer">
        <Image
          src="/assets/images/icons/arrow-left.svg"
          alt="logo"
          height={19}
          width={18}
        />
        <p className="text-lg font-medium text-black ml-3">Back</p>
      </div>
    </section>
  )
}

export { Header }
