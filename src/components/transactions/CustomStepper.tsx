'use client';

import { Badge, Button } from '@mantine/core';
import { FaInfoCircle } from 'react-icons/fa';

type StepItem = {
  step: number;
  title: string;
  status?: string;
  content: React.ReactNode;
};

interface CustomStepperProps {
  steps: StepItem[];
}

export default function CustomStepper({ steps }: CustomStepperProps) {
  return (
    <div className="flex flex-col space-y-24 p-6 relative">
      {steps.map(({ step, title, status, content }, index) => {
        const isEven = index % 2 === 0;
        const cardOffset = isEven ? '-ml-52' : '-ml-24';

        return (
          <div key={step} className="relative min-h-[180px] pl-16">
            {/* Step circle and vertical line */}
            <div className="absolute top-0 left-4 z-10 flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`w-14 h-14 rounded-full shadow-md flex items-center justify-center font-semibold text-xl ${
                  status === 'completed'
                    ? 'border border-orange-500 bg-orange-50 text-black'
                    : 'bg-white border border-gray-300 text-orange-500'
                }`}
              >
                {step}
              </div>

              {/* Vertical line */}
             
                <div className={`${index !== steps.length - 1 ? 'h-[300px]':'h-[150px]'} w-px border-l border-black border-dashed border-gray-400"`} />
              
            </div>

            {/* Title to the left */}
            <div className="absolute left-[-10rem] top-4 text-right w-40">
              <h3
                className={`text-md font-bold ${
                  status === 'completed' ? 'text-black' : 'text-gray-400'
                }`}
              >
                {title}
              </h3>
            </div>

            {/* Card */}
            <div
              className={`bg-white relative z-10 w-[425px] mt-20 text-sm p-6 rounded-xl shadow border ${cardOffset}`}
            >
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
