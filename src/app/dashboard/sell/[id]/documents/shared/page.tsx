import SharedDocument from 'components/dashboard/documents/shared-document'
import { SellerPropertyTransactionItem } from 'components/overview/SellerPropertyTransactionItem'
import React from 'react'

function page() {
  return (
    <section className="pb-6">
   <SellerPropertyTransactionItem/>
    <SharedDocument/>
  </section>
  )
}

export default page