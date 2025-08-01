'use client'

import { RoundedButton } from 'components/common/buttons/RoundedButton'
import { useState } from 'react'
import Modal from 'components/common/Modal'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import Image from 'next/image'
import UnlockCMA from 'components/dashboard/sell/UnlockCma'
import CmaPaymentOptionForm from 'components/dashboard/sell/CmaPaymentOptionForm'
import SucessfullPayment from 'components/dashboard/sell/SucessfulPayment'
import CmaLoader from 'components/dashboard/sell/CmaLoader'
import { SellerPropertyTransactionItem } from 'components/overview/SellerPropertyTransactionItem'

const Page = () => {
  const [isOpen, setIsOpen] = useState<string | null>(null)

  const openModal = (modal: string) => {
    setIsOpen(modal)
  }

  const closeModal = () => {
    setIsOpen(null)
  }

  return (
    <>
      <section className="">
      <SellerPropertyTransactionItem/>
      </section>
      <section className="w-full items-center justify-center flex flex-col gap-3 pt-36">
        <div className="flex justify-center items-center bg-white rounded-lg h-10 w-10 p-1">
          <Image
            src="/assets/images/icons/documentIcon.svg"
            alt="transaction Image"
            height={30}
            width={30}
          />
        </div>
        <section className="flex items-center justify-center gap-3">
          <p className="font-semibold text-lg">Comparative Market Analysis</p>
          <Image
            src="/assets/images/icons/starIcon.svg"
            alt="Star"
            height={21}
            width={20}
          />
        </section>

        <p className="font-extralight text-lg text-[#8E929C] w-6/12 text-center">
          With the freshest data from the MLS, you can interact with listings
          like you never have before.
        </p>
        <RoundedButton
          variant="secondary"
          onClick={() => openModal('unlockCMA')}
          label="Generate"
          className="py-2 text-white bg-black px-6 mt-10"
        />
        <Modal isOpen={isOpen === 'unlockCMA'} closeModal={closeModal}>
          <UnlockCMA openNextModal={() => openModal('CmaPaymentOptionForm')} />
        </Modal>
        <Modal
          isOpen={isOpen === 'CmaPaymentOptionForm'}
          closeModal={closeModal}>
          <CmaPaymentOptionForm
            openNextModal={() => openModal('SucessfulPayment')}
          />
        </Modal>
        <Modal isOpen={isOpen === 'SucessfulPayment'} closeModal={closeModal}>
          <SucessfullPayment openNextModal={() => openModal('Cmaloader')} />
        </Modal>
        <Modal isOpen={isOpen === 'Cmaloader'} closeModal={closeModal}>
          <CmaLoader />
        </Modal>
      </section>
    </>
  )
}

export default Page
