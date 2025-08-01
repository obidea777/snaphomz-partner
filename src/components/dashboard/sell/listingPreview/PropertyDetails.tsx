import React from 'react'

const placeHolder = `An enchanting tree-lined walkway leads to the front door. Enter to find a bright, open entryway. The light-filled primary suite awaits on this level of the home, complete with beautiful open beam ceilings, updated bath, walk-in closet/laundry and fireplace. The open stairwell ascends to the spacious living room featuring gorgeous cathedral ceilings and tons of natural light. The formal dining room and updated kitchen open to a spacious wrap-around deck shaded by majestic oak trees, perfect for entertaining or dining al fresco. This level also features two additional bedrooms and a full bath.`

type IPropertyDetailsProps = {
  description?: string
}

const PropertyDetails: React.FC<IPropertyDetailsProps> = ({
  description = placeHolder
}) => (
  <section>
    <h2 className="text-xl text-black font-bold mb-6">About This Home</h2>
    <p className="font-mdeium text-base text-[#606060] mb-10">{description}</p>
    <section className="flex items-center">
      <section className="flex items-center mr-6 gap-1">
        <p className="font-bold text-base">4 mins </p>
        <p className="text-base">{' on OCReal'}</p>
      </section>
      <section className="flex items-center mr-6 gap-1">
        <p className="font-bold text-base">3,200 </p>
        <p className="text-base">views</p>
      </section>
      <section className="flex items-center mr-6 gap-1">
        <p className="font-bold text-base">180 </p>
        <p className="text-base">saves</p>
      </section>
    </section>
  </section>
)

export { PropertyDetails }
