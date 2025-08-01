import Image from 'next/image'
import Checkbox from './Checkbox'
import TimePicker from './inputs/TimePicker'
import { useState } from 'react'

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const WeekScheduler: React.FC = () => {
  const [scheduledDays, setScheduledDays] = useState<string[]>(daysOfWeek)
  const [checkedDays, setCheckedDays] = useState<{ [key: string]: boolean }>({})

  const handleCheckboxChange = (day: string) => {
    setCheckedDays((prevCheckedDays) => ({
      ...prevCheckedDays,
      [day]: !prevCheckedDays[day]
    }))
  }

  const handleDeleteDay = (day: string) => {
    // Remove the day from the scheduledDays array
    setScheduledDays((prevScheduledDays) =>
      prevScheduledDays.filter((scheduledDay) => scheduledDay !== day)
    )
    // Optionally, also remove the checkbox state for that day
    setCheckedDays((prevCheckedDays) => {
      const { [day]: _, ...rest } = prevCheckedDays
      return rest
    })
  }
  return (
    <>
      <p className="text-black font-semibold text-lg mb-6">Weekly</p>
      {scheduledDays.map((day) => (
        <section className="flex justify-between items-center mb-4" key={day}>
          <Checkbox
            label={<p className="text-md text-[#848484]">{day}</p>}
            InputclassName="checked:bg-[#FF8700]"
            SpanclassName="text-black"
            checked={!!checkedDays[day]} // Check if the specific day is checked
            onChange={() => handleCheckboxChange(day)}
          />
          <TimePicker />
          <section className=" flex items-center justify-center gap-5">
            <Image
              src="/assets/images/icons/delete.svg"
              alt="delete"
              height={25}
              width={25}
              onClick={() => handleDeleteDay(day)} // Call delete function on click
              className="cursor-pointer" // Add a cursor pointer for better UX
            />
            <Image
              src="/assets/images/icons/add.svg"
              alt="logo"
              height={25}
              width={25}
            />
          </section>
        </section>
      ))}
    </>
  )
}

export default WeekScheduler
