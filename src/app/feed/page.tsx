'use client'

import ComingSoon from 'components/common/ComingSoon'

const Rent = () => {
  return (
    <ComingSoon
      title="Stay Informed!"
      message="Bringing endless social property packages soon."
      placeholder="Enter your email"
      onSubmit={function (email: string): void {
        console.log('Function not implemented.')
      }}
    />
  )
}

export default Rent
