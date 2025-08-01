import { OnboardingFooterProps } from 'interfaces/onboarding.interfaces'
export default function OnboardingFooter({
  message,
  onClick,
  actionText,
  actionLink
}: OnboardingFooterProps) {
  return (
    <section className="flex gap-4 justify-center mt-4 ">
      <p className="text-base font-light text-black">{message}</p>

      <a
        href={actionLink}
        onClick={onClick}
        className="text-base font-semibold text-[#FF8700] cursor-pointer">
        {actionText}
      </a>
    </section>
  )
}
