
import { Avatar, Badge } from '@mantine/core';
import VerticalStepper from './VerticalStepper';
import CustomStepper from './CustomStepper';
import { InfoIcon } from 'lucide-react';
import { Button } from 'components/ui/button';


export default function Transactions() {
    const steps = [
        {
            step: 1,
            title: 'Offer accepted!',
            status: 'completed',
            content: (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar src="https://i.pravatar.cc/100" alt="buyer" radius='xl' size={'lg'} />
                        <div className='flex gap-2 flex-col'>
                            <p className="font-semibold text-[16px]">Dove Cameron</p>
                            <p className="text-gray-500 text-sm">Robin.sche@gmail.com</p>
                            <div className='flex items-center gap-2'>
                                <p className='opacity-50'>Offer Price:</p>
                                <p className="text-black font-semibold "> $980,000</p>
                            </div>

                        </div>
                    </div>
                    <Button className='rounded-full bg-black text-white px-6 py-2'>View Offer</Button>
                </div>
            ),
        },
        {
            step: 2,
            title: 'Title & Escrow',
            status: 'completed',
            content: (
                <div className="flex justify-between h-full items-start">
                    <div>
                        <p className="font-semibold text-[16px]">Seller Details</p>
                        <div className='flex text-sm opacity-50 flex-col gap-2 mt-2'>
                            <p>Racheal Wyatt</p>
                            <p>616-2342-3245</p>
                            <p>Racheal.wyatt@gmail.com</p>
                        </div>
                    </div>
                    <div className='flex justify-between items-between  h-full  flex-col'>
                    <div className='flex text-orange-500 items-center gap-2'>
                       <p>Action Required</p>
                       <InfoIcon size={14} />
                       </div>
                        <Button disabled className='rounded-full bg-black mt-10 text-white px-6 py-2'>Proceed</Button>
                    </div>

                </div>
            ),
        },
        {
            step: 3,
            title: 'Track Contingencies',
            status: 'action-required',
            content: (
                <div className='flex justify-between '>

                    <div className='flex justify-between flex-col  just-end'>
                        <p className="font-semibold text-[16px]">Contingencies</p>
                        <ul className="space-y-2 text-sm mt-2">
                            <li >
                                <span className='opacity-50'>Finance </span><strong className='font-medium pl-4'>18 Days Left</strong></li>
                            <li >
                                <span className='opacity-50'>Appraisal </span> <strong className='font-medium pl-4'>Waived</strong> ✅</li>
                            <li >    <span className='opacity-50'>Inspection </span> <strong className='font-medium pl-4'>7 Days Left</strong></li>
                        </ul>


                    </div>
                    <div className='flex justify-between items-between  h-full  flex-col'>

                       <div className='flex text-orange-500 items-center gap-2'>
                       <p>Action Required</p>
                       <InfoIcon size={14} />
                       </div>
                        {/* <Badge color="orange" variant='outline' className='border-none' rightSection={<InfoIcon size={14} />}>
                            Action Required
                        </Badge> */}
                        <Button disabled className='rounded-full bg-black mt-10 text-white px-6 py-2'>Complete</Button>
                    </div>
                </div>
            ),
        },
        {
            step: 4,
            title: 'Sign & Close',
            status: 'action-required',
            content: (
                <div className='flex justify-between items-start'>

                    <div className="flex flex-col gap-4 items-start justify-between mt-2">
                        <div className='flex gap-3 items-center'>
                        <p className="font-semibold  text-[16px]">Document</p>
                         <button className='border px-6 py-1  rounded-full'>Add</button>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <div className="bg-gray-100 p-2 rounded">📄</div>
                            <p className="text-sm">Property Closure.pdf</p>
                        </div>


                    </div>
                    <div className='flex justify-between  gap-4  mt-4 h-full  flex-col'>

                    <div className='flex text-orange-500 items-center gap-2'>
                       <p>Action Required</p>
                       <InfoIcon size={14} />
                       </div>
                        <Button disabled className='rounded-full bg-black text-white px-6 py-2'>AdobeSign</Button>
                    </div>
                </div>
            ),
        },
    ] 


    return (
        <main className="bg-[#f9f7f4] min-h-screen">
            <div className="max-w-2xl mx-auto py-10">
                <CustomStepper steps={steps} />
            </div>
        </main>
    );
}
