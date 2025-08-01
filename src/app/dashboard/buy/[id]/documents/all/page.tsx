import AllDocument from 'components/dashboard/documents/all-documents'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import React from 'react'

function page() {
  return (
    <section className="pb-6">
      <PropertyTransactionItem />
      <AllDocument/>
    </section>
  )
}

export default page