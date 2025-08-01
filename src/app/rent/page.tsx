'use client'

import ComingSoon from 'components/common/ComingSoon'

const Rent = () => {
  return (
    <ComingSoon
      title="Coming Soon!"
      message="Bringing endless rental property packages soon."
      placeholder="Enter your email"
      onSubmit={function (email: string): void {
        console.log('Function not implemented.')
      }}
    />
  )
}

export default Rent
