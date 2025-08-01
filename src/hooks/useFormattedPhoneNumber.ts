import { useState } from 'react'
import { normalizeInput } from 'utils/mathutilities'

const useFormattedPhoneNumber = (initialValue: string = '') => {
  const [formattedValue, setFormattedValue] = useState<string>(initialValue)

  const setValue = (value: string) => {
    // Update the state with the formatted value
    setFormattedValue((prev) => normalizeInput(value, prev))
  }

  return [formattedValue, setValue] as const
}

export default useFormattedPhoneNumber
