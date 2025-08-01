'use client'

import { PropertyTransactionItem } from 'components/overview/PropertyTransactionItem'
import { DocumentCard } from 'components/common/DocumentCard'

const DownloadCmaPage = () => {
  return (
    <>
      <section className="">
        <PropertyTransactionItem />
      </section>
      <section className="w-full items-center justify-center gap-3 pt-20">
        <section className="flex flex-wrap items-center gap-5">
          <DocumentCard
            downloadDocument={() => {}}
            title="Comparative Market Analysis"
            updatedDate="Updated Dec 18, 2023 03:02 PM"
            moreOptions={false}
            copyOption={true}
          />
        </section>
      </section>
    </>
  )
}

export default DownloadCmaPage
