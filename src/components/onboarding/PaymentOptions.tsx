import { Button } from 'components/common/buttons/Button'
import OnboardingFooter from './OnboardingFooter'
import { OnboardingPageChangeProps } from 'interfaces/onboarding.interfaces'

export default function PaymentOptions({
  onNext,
  currentPage
}: OnboardingPageChangeProps) {
  return (
    <section className="md:w-1/2 justify-center align-center  pl-20 flex flex-col">
      <section className="md:w-10/12">
        <p className="text-black font-medium text-4xl">Select Payment Option</p>
        <p className="text-[#ACACAC] font-normal text-base mb-8 mt-3 w-7/12">
          You can always switch between methods whenever you like.
        </p>
        <Button
          className="text-white bg-black font-semibold text-lg mb-6"
          onClick={onNext}>
          Subscription
        </Button>
        <Button
          className="text-black bg-white border border-[#707070] font-semibold text-lg"
          onClick={onNext}>
          I will pay as I use
        </Button>
        <OnboardingFooter actionText="Skip" />
      </section>
    </section>
  )
}
