'use client'
import { useState } from 'react'
import RegisterEmailPage from 'components/onboarding/RegisterEmail'
import SignUp from 'components/onboarding/SignUp'
import VerifyEmailPage from 'components/onboarding/VerifyEmail'
import PersonalDetailsPage from 'components/onboarding/PersonalDetails'
import PaymentOptions from 'components/onboarding/PaymentOptions'
import SucessfulPage from 'components/onboarding/Sucessful'
import Image from 'next/image'
import Link from 'next/link'
import "../../globals.css"
export default function Home() {
  const [currentPage, setCurrentPage] = useState(0)

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <SignUp onNext={() => setCurrentPage(1)} />
      case 1:
        return (
          <RegisterEmailPage
            onNext={() => setCurrentPage(2)}
            currentPage={currentPage}
          />
        )
      case 2:
        return (
          <VerifyEmailPage
            onNext={() => setCurrentPage(3)}
            currentPage={currentPage}
          />
        )
      case 3:
        return (
          <PersonalDetailsPage
            onNext={() => setCurrentPage(4)}
            currentPage={currentPage}
          />
        )
      case 4:
        return (
          <PaymentOptions
            onNext={() => setCurrentPage(5)}
            currentPage={currentPage}
          />
        )
      case 5:
        return <SucessfulPage />
      default:
        return <SignUp onNext={() => setCurrentPage(1)} />
    }
  }

  return (
       <>
           {renderPage()}
       </>

    
    
  )
}
