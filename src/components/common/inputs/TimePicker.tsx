import React, { useState } from 'react'
import { cn } from 'utils/styleUtilities'

interface TimePickerProps {
  startTimePlaceholder?: string
  endTimePlaceholder?: string
  label?: string
  labelClassName?: string
  onStartTimeChange?: (time: string) => void // Callback for start time
  onEndTimeChange?: (time: string) => void // Callback for end time
}

const TimePicker: React.FC<TimePickerProps> = ({
  startTimePlaceholder = 'Select start time',
  endTimePlaceholder = 'Select end time',
  label,
  labelClassName,
  onStartTimeChange,
  onEndTimeChange
}) => {
  const [startTime, setStartTime] = useState<string>('11:00')
  const [endTime, setEndTime] = useState<string>('23:00')
  const [startTimeVisible, setStartTimeVisible] = useState<boolean>(false)
  const [endTimeVisible, setEndTimeVisible] = useState<boolean>(false)

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const time = event.target.value
    setStartTime(time)
    if (onStartTimeChange) onStartTimeChange(time) // Call callback with selected time
  }

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = event.target.value
    setEndTime(time)
    if (onEndTimeChange) onEndTimeChange(time) // Call callback with selected time
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const period = parseInt(hours) >= 12 ? 'PM' : 'AM'
    const formattedHours = (parseInt(hours) % 12 || 12)
      .toString()
      .padStart(2, '0')
    return `${formattedHours}:${minutes} ${period}`
  }

  return (
    <section>
      {label ? (
        <label
          className={cn(
            'mb-2 block text-sm font-normal text-black',
            labelClassName
          )}>
          {label}
        </label>
      ) : null}
      <div className="max-w-[16rem] flex items-center gap-3">
        <div className="relative">
          <input
            type={startTimeVisible ? 'time' : 'text'}
            id="start-time"
            value={startTimeVisible ? startTime : formatTime(startTime)}
            onFocus={() => setStartTimeVisible(true)}
            onBlur={() => setTimeout(() => setStartTimeVisible(false), 100)}
            onChange={handleStartTimeChange}
            className="text-black text-sm block w-full p-2.5 cursor-pointer h-full border border-[#707070] bg-[#F5F8FA] font-satoshi text-sm font-normal outline-none transition-all placeholder-shown:border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] rounded-md px-4 items-center"
            min="00:00"
            max="23:59"
            required
            placeholder={startTimePlaceholder}
          />
        </div>
        <p>-</p>
        <div className="relative">
          <input
            type={endTimeVisible ? 'time' : 'text'}
            id="end-time"
            value={endTimeVisible ? endTime : formatTime(endTime)}
            onFocus={() => setEndTimeVisible(true)}
            onBlur={() => setTimeout(() => setEndTimeVisible(false), 100)}
            onChange={handleEndTimeChange}
            className="text-black text-sm block w-full p-2.5 cursor-pointer h-full border border-[#707070] bg-[#F5F8FA] font-satoshi text-sm font-normal outline-none transition-all placeholder-shown:border-[#D5D9DC] focus:border-[#FF8700] disabled:border-0 disabled:bg-[#ACACAC] rounded-md px-4 items-center"
            min="00:00"
            max="23:59"
            required
            placeholder={endTimePlaceholder}
          />
        </div>
      </div>
    </section>
  )
}

export default TimePicker
