import { Button } from 'components/common/buttons/Button'
import { SearchInput } from 'components/common/inputs/SearchInput'
import { MessageFileSelect } from 'components/messages/MessageFileSelect'
import { MessageItem } from 'components/messages/MessageItem'

import React from 'react'
import { getRandomColor } from 'utils/randomColor'
import { cn } from 'utils/styleUtilities'

function Conversations() {
  return (
    <section className="pt-28 px-12">
      <section className="grid grid-cols-2 mt-4 rounded-lg bg-white min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-hidden mr-3">
        <section className="border-r border-solid border-[#C2C2C2]">
          <section className="h-16">
            <SearchInput
              containerClassName="h-16"
              inputClassName="border-0 w-full border-b border-[#C2C2C2] h-12 rounded-none"
              placeholder="Search message or people"
            />
          </section>
          <section className="min-h-[calc(100vh-200px)] max-h-[calc(100vh-200px)] overflow-scroll mr-3">
            {[
              { name: 'Daniel Smith', initials: 'DS', type: 'agent' },
              { name: 'Thomas Harris', initials: 'TH', type: 'buyer' },
              { name: 'Martha Thompson', initials: 'MT', type: 'agent' },
              { name: 'Henry Taylor', initials: 'HT', type: 'buyer' },
              { name: 'William Anderson', initials: 'WA', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' },
              { name: 'Sophia Johnson', initials: 'SJ', type: 'agent' }
            ].map((item, i) => (
              <section
                key={i}
                className="flex items-center my-6 px-3 cursor-pointer">
                <div
                  style={{
                    backgroundColor: getRandomColor()
                  }}
                  className={cn(
                    `rounded-full h-10 w-10 items-center justify-center flex mr-3`
                  )}>
                  <p className="text-sm text-black uppercase">
                    {item.initials}
                  </p>
                </div>
                <section className="">
                  <p className="font-medium text-base capitalize">
                    {item.name}
                  </p>
                  <p className="font-medium text-sm text-[#8E929C] capitalize">
                    {item.type}
                  </p>
                </section>
              </section>
            ))}
          </section>
        </section>
        <section className="relative border-t border-solid border-[#C2C2C2] rounded-r-lg">
          <section className="flex items-center justify-between px-4 border-b border-solid border-[#c2c2c2] h-12">
            <section className=""></section>
            <section className="flex items-center gap-x-3">
              <p className="text-xs text-[#5A5A5A] font-medium">
                agentemail@gmail.com
              </p>
              <p className="text-sm text-[#E8804C] font-bold">View profile</p>
            </section>
          </section>
          <section className="min-h-[calc(100vh-130px)] max-h-[calc(100vh-130px)] overflow-scroll pb-20">
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={false}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem text="k" time={'2:30pm'} isFromLoggedInUser={true} />
            <MessageItem
              text="right now, if you can sign on it right away, I will really"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text="right now, if you can"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={false}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem text="k" time={'2:30pm'} isFromLoggedInUser={true} />
            <MessageItem
              text="right now, if you can sign on it right away, I will really"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text="right now, if you can"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={false}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem text="k" time={'2:30pm'} isFromLoggedInUser={true} />
            <MessageItem
              text="right now, if you can sign on it right away, I will really"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text="right now, if you can"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={false}
            />
            <MessageItem
              text={`Hello John, I missed out on a few documents, so I attached it
              right now, if you can sign on it right away, I will really
              appreciate that you know.`}
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem text="k" time={'2:30pm'} isFromLoggedInUser={true} />
            <MessageItem
              text="right now, if you can sign on it right away, I will really"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
            <MessageItem
              text="right now, if you can you can, or cant or catnt"
              time={'2:30pm'}
              isFromLoggedInUser={true}
            />
          </section>
          <section className="bg-white min-h-[60px] flex items-center justify-between px-6 overflow-hidden absolute bottom-6 left-0 right-0 z-10 border-t border-t-slate-400">
            <section className="w-4/5 flex items-center">
              <input
                type="text"
                className="resize-none w-full p-2 border-none block text-sm text-black border border-[#9B9B9B] rounded-lg bg-white focus:ring-[#9B9B9B] focus:border-[#9B9B9B] dark:bg-transparent dark:border-[#9B9B9B] dark:placeholder-[#5A5A5A] dark:text-black dark:focus:ring-#9B9B9B dark:focus:border-#9B9B9B focus-visible:ring-0 !outline-none"
                placeholder="Write message"
              />
            </section>
            <section className="flex items-center gap-x-3">
              <MessageFileSelect />
              <Button className="bg-black text-white h-10">
                <p className="text-white text-sm px-4">Send</p>
              </Button>
            </section>
          </section>
        </section>
      </section>
    </section>
  )
}

export default Conversations
