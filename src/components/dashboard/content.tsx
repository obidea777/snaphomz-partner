'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DashboardChart } from './dashboard-chart'

const tabs = ['All Updates', 'Requests',]

export default function DashboardContent() {
  const router = useRouter()
  return (
    <div className="space-y-8 p-6 bg-[#f9f8f6] rounded-2xl">
      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-300 pb-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-4 py-2 text-base font-medium transition-all duration-200 border-b-2 ${index === 0
                ? 'border-orange-500 text-orange-500'
                : 'text-gray-500 border-transparent hover:text-black'
              }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Section - Performance Card */}
        <div className="col-span-3 flex flex-col gap-4">
  
          <DashboardChart/>

        </div>

        {/* Right Section - Requests & Performance */}
        <div className="space-y-8 col-span-2">
          {/* Requests */}
          <div className="flex items-center justify-between">
            <div className="text-xl cursor-pointer font-semibold flex items-center gap-2"
              onClick={() => {
                // console.log("Clicked Requests");
                router.push("/requests")
              }}
            >
              <span className="bg-gray-100 p-2 rounded-full">
                <span className="font-bold">📩</span>
              </span>
              Requests
            </div>
            <div className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-base font-medium">
              2
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <div>
              <div className="text-base text-gray-500 font-medium">
                Performance
              </div>
              <div className="grid grid-cols-2 gap-6 mt-3">
                {[
                  'Deals Closed (2025)',
                  'Active Listings',
                  'Active Buying',
                  'Under Contract'
                ].map((label, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-lg py-1 px-2 rounded-lg hover:bg-orange-100">
                    <div>{label}</div>
                    <div className="font-semibold">{[12, 8, 5, 1][idx]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Satisfaction */}
            <div>
              <div className="flex justify-between items-center">
                <div className="text-base text-gray-500 font-medium">
                  Client Satisfaction
                </div>
                <div className="text-lg font-semibold">95%</div>
              </div>
              <div className="h-3 bg-gray-200 rounded-full mt-2">
                <div className="h-full w-[95%] bg-orange-500 rounded-full" />
              </div>
            </div>

            {/* Specializations */}
            <div>
              <div className="text-base text-gray-500 font-medium mb-2">
                Specializations
              </div>
              <div className="flex gap-3 flex-wrap">
                {['Luxury Homes', 'Waterfront', 'Investment'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings & Announcements */}
     
    </div>
  )
}
