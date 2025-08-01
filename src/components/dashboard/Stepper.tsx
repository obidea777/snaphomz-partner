import { RoundedButton } from 'components/common/buttons/RoundedButton'
import Image from 'next/image'

const Stepper = () => {
  return (
    <section className="w-full  mt-20 ">
      <section className="relative  w-full flex flex-col items-center ">
        <section className="flex gap-x-20 ">
          <p className="font-semibold text-base text-black mt-3">
            Offer accepted!
          </p>

          <section className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full text-black border border-[#FF8700] bg-[#FFF3E4] flex justify-center items-center">
              1
            </div>
            <div className="h-20 border border-black border-dashed"></div>
          </section>
        </section>
        <section className="flex items-center p-6 bg-white w-5/12 justify-between rounded-lg absolute top-28 right-44">
          <div className="rounded-full">
            <Image
              height={50}
              width={50}
              src="/assets/images/temp/offercardimage.svg"
              alt="offer card image"
              className="object-contain"
            />
          </div>
          <section>
            <p className="font-semibold text-base text-black mb-2">
              Dove Cameron
            </p>
            <p className="font-light text-sm text-[#707070] mb-2">
              Robin.sche@gmail.com
            </p>
            <span className="font-medium text-sm text-[#777777] ">
              Offer Price
            </span>
            <span className="font-semibold text-base text-black ml-5">
              $980,000
            </span>
          </section>
          <RoundedButton
            variant="secondary"
            onClick={() => {}}
            label="View Offer"
            className="py-2 font-normal text-white bg-black px-6 "
          />
        </section>
      </section>
      <section className="relative  w-full flex flex-col items-center  top-28 left-1.5">
        <section className="flex gap-x-20 ">
          <p className="font-semibold text-base text-[#959595] mt-12">
            Title & Escrow
          </p>
          <section className="flex flex-col items-center">
            <div className="h-8 border border-black border-dashed"></div>
            <div className="w-16 h-16 rounded-full text-[#959595] border border-transparent bg-white flex justify-center items-center">
              2
            </div>
            <div className="h-20 border border-black border-dashed"></div>
          </section>
        </section>
        <section className="flex flex-col p-6 bg-white w-5/12 gap-y-4 rounded-lg">
          <section className="flex justify-between">
            <p className="font-semibold text-base text-black">Seller Details</p>
            <section className="flex items-center gap-2">
              <p className="font-medium text-sm text-[#E8804C]">
                Action Required
              </p>
              <Image
                height={20}
                width={20}
                src="/assets/images/icons/takeaction.svg"
                alt="action"
              />
            </section>
          </section>
          <section className="flex  justify-between items-end">
            <section className="">
              <p className="font-light text-sm text-[#707070] mb-2">
                Racheal Wyatt
              </p>
              <p className="font-light text-sm text-[#707070] mb-2">
                616 -2342-3245
              </p>
              <p className="font-light text-sm text-[#707070]">
                Racheal.wyatt@gmail.com
              </p>
            </section>
            <section>
              <RoundedButton
                variant="secondary"
                onClick={() => {}}
                label="Proceed"
                className="py-2 font-normal text-white bg-[#CCCCCC] px-8"
              />
            </section>
          </section>
        </section>
      </section>
      <section className="relative  w-full flex flex-col items-center  top-28 -left-4">
        <section className="flex gap-x-20 ">
          <p className="font-semibold text-base text-[#959595] mt-12">
            Track Contingencies
          </p>
          <section className="flex flex-col items-center">
            <div className="h-8 border border-black border-dashed"></div>
            <div className="w-16 h-16 rounded-full text-[#959595] border border-transparent bg-white flex justify-center items-center">
              3
            </div>
            <div className="h-20 border border-black border-dashed"></div>
          </section>
        </section>
        <section className="flex flex-col p-6 bg-white w-5/12 gap-y-4 rounded-lg absolute top-40 right-52">
          <section className="flex justify-between">
            <p className="font-semibold text-base text-black">Contingencies</p>
            <section className="flex items-center gap-2">
              <p className="font-medium text-sm text-[#E8804C]">
                Action Required
              </p>
              <Image
                height={20}
                width={20}
                src="/assets/images/icons/takeaction.svg"
                alt="action"
              />
            </section>
          </section>
          <section className="flex  justify-between items-end">
            <section className=" w-5/12">
              <section className="flex  mb-2 justify-between">
                <p className="font-light text-sm text-[#707070]">Finance</p>
                <p className="font-medium text-sm text-[#2E2E2E]">
                  18 Days Left
                </p>
              </section>
              <section className="flex  mb-2 justify-between">
                <p className="font-light text-sm text-[#707070]">Appraisal</p>
                <div className="flex gap-3">
                  <p className="font-medium text-sm text-[#2E2E2E]">Waived</p>
                  <div className="h-4 w-4 rounded-full border border-[#4BBF15] flex items-center justify-center">
                    <Image
                      height={15}
                      width={15}
                      src="/assets/images/icons/checkmark.svg"
                      alt="action"
                    />
                  </div>
                </div>
              </section>
              <section className="flex  mb-2 justify-between">
                <p className="font-light text-sm text-[#707070]">Inspection</p>
                <p className="font-medium text-sm text-[#2E2E2E]">
                  7 Days Left
                </p>
              </section>
            </section>
            <section>
              <RoundedButton
                variant="secondary"
                onClick={() => {}}
                label="Complete"
                className="py-2 text-white font-normal bg-[#CCCCCC] px-8"
              />
            </section>
          </section>
        </section>
      </section>
      <section className="relative  w-full flex flex-col items-center  left-3 top-[16.875rem] pb-4">
        <section className="flex gap-x-20 ">
          <p className="font-semibold text-base text-[#959595] mt-12">
            Sign & Close
          </p>
          <section className="flex flex-col items-center">
            <div className="h-8 border border-black border-dashed"></div>
            <div className="w-16 h-16 rounded-full text-[#959595] border border-transparent bg-white flex justify-center items-center">
              4
            </div>
            <div className="h-20 border border-black border-dashed"></div>
          </section>
        </section>
        <section className="flex flex-col p-6 bg-white w-5/12 gap-y-6 rounded-lg">
          <section className="flex justify-between">
            <section className="flex  items-center gap-4">
              <p className="font-semibold text-base text-black">Document</p>
              <div>
                <RoundedButton
                  variant="secondary"
                  onClick={() => {}}
                  label="Add"
                  className="py-1 text-black bg-inherit border-[#707070] font-normal px-8"
                />
              </div>
            </section>
            <section className="flex items-center gap-2">
              <p className="font-medium text-sm text-[#E8804C]">
                Action Required
              </p>
              <Image
                height={20}
                width={20}
                src="/assets/images/icons/takeaction.svg"
                alt="action"
              />
            </section>
          </section>
          <section className="flex  justify-between items-end">
            <section className="flex items-center gap-4">
              <section className="bg-[#F8F8F8] h-8 w-8 rounded-lg flex items-center justify-center">
                <Image
                  height={20}
                  width={20}
                  src="/assets/images/icons/documentIcon.svg"
                  alt="action"
                />
              </section>
              <p className="font-medium text-sm text-black">
                Property Closure.pdf
              </p>
            </section>
            <section>
              <RoundedButton
                variant="secondary"
                onClick={() => {}}
                label="AdobeSign"
                className="py-2 text-white font-normal bg-[#CCCCCC] px-8"
              />
            </section>
          </section>
        </section>
      </section>
    </section>
  )
}

export default Stepper
