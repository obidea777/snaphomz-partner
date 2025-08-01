import Image from 'next/image';

interface OnboardingStepsCounterProps {
  currentPage: number;
}

export default function OnboardingStepsCounter({
  currentPage
}: OnboardingStepsCounterProps) {

  const handleGetHelpClick = () => {
    const mailtoLink = 'mailto:support@snaphomz.com';
    const gmailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=support@snaphomz.com';

    try {
      window.location.href = mailtoLink;

      setTimeout(() => {
        window.location.href = gmailLink;
      }, 1000);
    } catch (error) {
      console.error('Error opening the email client: ', error);
    }
  };

  return (
    <section className="flex justify-between mb-24">
      <p className="text-[#535353] text-base font-light">
        STEP {currentPage} OF 3
      </p>
      <div className="flex items-center gap-1">
        <p className="text-[black] text-base font-light">Having trouble?</p>
        <button
          onClick={handleGetHelpClick}
          className="text-[#FF8700] text-base font-semibold"
        >
          Get help
        </button>
        <div>
          <Image
            src="/assets/images/icons/arrow-right.svg"
            alt="right-arrow"
            className="object-contain"
            height={8}
            width={16}
          />
        </div>
      </div>
    </section>
  );
}