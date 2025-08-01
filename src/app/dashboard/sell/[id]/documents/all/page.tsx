import AllDocument from 'components/dashboard/documents/all-documents'
import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { SellerPropertyTransactionItem } from 'components/overview/SellerPropertyTransactionItem'
import React from 'react'

function page() {
  return (
    <section className="pb-6">
      <SellerPropertyTransactionItem />
      <AllDocument/>
    </section>
  )
}

export default page