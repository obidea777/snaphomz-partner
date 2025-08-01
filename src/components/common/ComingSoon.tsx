import React, { useState } from 'react'
import { Button } from './buttons/Button'
import { BorderedTextInput } from './inputs/BorderedTextInput'

type ComingSoonProps = {
  title: string
  message: string
  placeholder: string
  onSubmit: (email: string) => void
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  message,
  placeholder,
  onSubmit
}) => {
  const [email, setEmail] = useState('')

  const handleSubmit = () => {
    onSubmit(email)
  }

  return (
    <section className="justify-center items-center flex gap-6 h-screen flex-col">
      <h1 className="text-4xl font-semibold text-center">{title}</h1>
      <p className="text-xl font-medium text-[#9D9D9D]">{message}</p>
      <section className="w-1/2 mt-6 flex flex-col items-center">
        <BorderedTextInput
          type="email"
          placeholder={placeholder}
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          // error={errors?.email?.message} // Optionally handle errors here
        />
        <Button
          className="text-white bg-black font-semibold text-lg mt-6 w-1/2"
          type="submit"
          onClick={handleSubmit}>
          Notify me
        </Button>
      </section>
    </section>
  )
}

export default ComingSoon
