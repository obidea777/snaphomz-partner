'use client'

import OnboardingFooter from './OnboardingFooter'
import OnboardingStepsCounter from './OboardingStepsCounter'
import { OnboardingPageChangeProps } from 'interfaces/onboarding.interfaces'
import PersonalDetailsForm from './PersonalDetailsForm'

export default function PersonalDetailsPage({
  onNext,
  currentPage
}: OnboardingPageChangeProps) {
  return (
    <section className="md:w-1/2 mt-20 align-center  pl-20 flex flex-col">
      <section className="md:w-10/12">
        <OnboardingStepsCounter currentPage={currentPage} />
        <p className="text-black font-medium text-4xl">Personal details</p>
        <p className="text-[#ACACAC] font-light text-base mb-8 mt-3 w-9/12">
          Let us know a little bit about you.
        </p>
        <PersonalDetailsForm onNext={onNext} />
        <OnboardingFooter
          message="I accept OCreal’s"
          actionText="Terms of Use"
        />
      </section>
    </section>
  )
}
