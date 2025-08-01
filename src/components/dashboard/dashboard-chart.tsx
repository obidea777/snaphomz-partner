import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chart.js/auto';
import { ChevronDownIcon } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ChartData {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string;
        borderRadius: number;
    }[];
}

export const DashboardChart: React.FC = () => {
    const [month, setMonth] = useState<string>('January');
    const [open, setOpen] = useState(false);
    const monthData = {
        January: [60, 40],
        February: [55, 45],
        March: [50, 50],
        April: [65, 35],
        May: [70, 30],
        June: [75, 25],
        July: [60, 40],
        August: [65, 35],
        September: [80, 20],
        October: [55, 45],
        November: [85, 15],
        December: [90, 10],
    };
    const months = Object.keys(monthData);
    const chartData: ChartData = {
        labels: ['Leads', 'Offers'],
        datasets: [
            {
                data: [monthData[month][0], 0],
                backgroundColor: '#FFD5A6',
                borderRadius: 8,
            },
            {
                data: [0, monthData[month][1]],
                backgroundColor: '#484646',
                borderRadius: 8,
            },
        ],

    };
    const progress = Math.round((monthData[month][0] / (monthData[month][0] + monthData[month][1])) * 100);
    return (
        <div className="w-full text-white items-center rounded-2xl p-6  items-end bg-black flex  bg-black text-white  pb-0 ">
            <div className="flex w-[40%]  h-full  justify-end  flex-col gap-4   mb-6">
                <h2 className="text-5xl text-start   font-semibold">{progress}%</h2>
                <div className="flex  w-full items-center">
                    <div className="progress-bar w-full  bg-white   w-3/4 h-1 mr-4">
                        <div className="progress  bg-[#FF8700] " style={{ width: `${progress}%`, height: '100%', borderRight: '4px solid black' }}></div>
                    </div>

                </div>
                <div className=' flex  gap-2 text-[10px]'>
                    <div className='flex gap-2 items-center'>
                        <div className=' w-2 h-2  rounded-full bg-[#FF8700]' />
                        Leads
                    </div>
                    <div className='flex gap-2 items-center'>
                        <div className=' w-2 h-2  rounded-full bg-white' />Offers
                    </div>
                </div>
            </div>

            <div className='  w-[10%] flex justify-between  mx-4 ml-6 mb-6 h-[70%] ' >
                <div className='w-[1px]  bg-gray-500' />
            </div>

            <div className="w-[50%] flex justify-between  items-end h-[240px]">

                <Bar
                    width={100}
                    className='mt-4  -mb-2 '
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                stacked: true,
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },

                            },
                            y: {
                                ticks: {
                                    display: false,
                                },
                                grid: {
                                    display: false,
                                },
                            },
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                enabled: false,
                            },
                        },
                    }}
                />
                <div className='h-full w-fit relative flex-col items-between justify-between'>
                    <div className="relative w-40 text-sm text-white">
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex justify-between items-center px-4 py-2 bg-[#1f1f1f] border border-gray-700 rounded-md hover:border-orange-400 focus:outline-none"
                        >
                            {month}
                            <ChevronDownIcon className="w-4 h-4 ml-2 text-gray-400" />
                        </button>

                        {open && (
                            <ul className="absolute z-10 mt-2 w-full bg-[#2c2c2c] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {months?.map((m) => (
                                    <li
                                        key={m}
                                        onClick={() => {
                                            setMonth(m);
                                            setOpen(false);
                                        }}
                                        className={`px-4 py-2 hover:bg-orange-500 hover:text-white cursor-pointer ${m === month ? 'bg-orange-600 text-white' : 'text-gray-300'
                                            }`}
                                    >
                                        {m}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className=' absolute bottom-12 flex flex-col gap-2 text-xs'>
                        <div className='flex gap-2 items-center'>
                            <div className=' w-2 h-2  rounded-full bg-[#FFD5A6]' />
                            Buyer
                        </div>
                        <div className='flex gap-2 items-center'>
                            <div className=' w-2 h-2  rounded-full bg-[#484646]' />Seller
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


