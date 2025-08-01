import Image from 'next/image'
import { cn } from 'utils/styleUtilities'
import { RoundedButton } from './buttons/RoundedButton'
import { ITour } from 'interfaces/tours'
import { formatDate } from 'utils/dateutilities'
import { shortenAddress } from 'utils/stringsUtilities'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DocumentCardProps extends ITour {
  hasTopNav?: boolean
  hasRightPicture?: boolean
  hasRightPictureClassname?: string
  hasButton?: boolean
  className?: string
  tourMonth?: string
  tourDate?: string
  address?: string
  tourTime?: string
}

const UpcomingTourCard: React.FC<DocumentCardProps> = ({
  hasTopNav = true,
  hasRightPicture = false,
  hasRightPictureClassname,
  hasButton = true,
  className,
  tourMonth,
  tourDate,
  address,
  tourTime
}) => {
  const router = useRouter()
  return (
    <section className={cn('pl-5', className)}>
      {hasTopNav ? (
        <section className="flex items-center justify-between gap-24 mb-10">
          <h2 className="text-lg text-black font-bold">Upcoming Tour</h2>
          {hasButton ? (
            <section>
              <Link href="/upcomingTour" className="flex items-center gap-2">
                <p className="font-medium text-sm text-black">View all</p>
                <Image
                  src="/assets/images/icons/arrowRight.svg"
                  alt="arrowRight"
                  height={12}
                  width={12}
                />
              </Link>
            </section>
          ) : null}
        </section>
      ) : null}

      <section className="p-3 rounded-lg border-[0.5px] border-solid border-[#707070] flex items-center gap-6">
        <section className="flex items-center rounded-lg">
          <section
            className={cn(
              `px-8 py-1.5 rounded-xl bg-black flex flex-col items-center gap-1 ${hasRightPictureClassname}`
            )}>
            <p className="text-white font-bold text-sm">{tourMonth}</p>
            <p className="text-white font-bold text-5xl">{tourDate}</p>
            <p className="font-bold text-xs text-[#8E929C]">Today</p>
          </section>
          {hasRightPicture ? (
            <section className="rounded-r-lg">
              <Image
                src="/assets/images/property.png"
                alt="Property name"
                height={185}
                width={185}
                className="rounded-r-lg object-contain"
              />
            </section>
          ) : null}
        </section>

        <section className="">
          <p className="font-medium text-black text-md ">{address}</p>
          <p className="font-bold text-base text-[#E8804C] mt-4">{tourTime}</p>
        </section>
      </section>
    </section>
  )
}

export { UpcomingTourCard }
