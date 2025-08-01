import SharedDocument from 'components/dashboard/documents/shared-document'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import React from 'react'

function page() {
  return (
    <section className="pb-6">
    <PropertyTransactionItem />
    <SharedDocument/>
  </section>
  )
}

export default page