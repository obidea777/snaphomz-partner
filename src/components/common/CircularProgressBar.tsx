import React, { useEffect, useState } from 'react'

type CircularProgressBarProps = {
  size: number
  strokeWidth: number
  percentage: number
  backgroundColor: string
  progressColor: string
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  size,
  strokeWidth,
  percentage,
  backgroundColor,
  progressColor
}) => {
  const [circumference, setCircumference] = useState(0)

  useEffect(() => {
    const radius = (size - strokeWidth) / 2
    setCircumference(2 * Math.PI * radius)
  }, [size, strokeWidth])

  const radius = (size - strokeWidth) / 2
  const dashOffset = circumference - (percentage / 100) * circumference

  return (
    <div
      className="flex items-center justify-center relative"
      style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="transition-stroke-dashoffset duration-500"
        />
      </svg>
      <span
        className="absolute text-white"
        style={{ fontSize: `${size / 5}px` }}>
        {`${percentage}%`}
      </span>
    </div>
  )
}

export default CircularProgressBar
