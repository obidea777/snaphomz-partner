import { FeatureItem } from 'components/FeatureItem'
import React from 'react'

const HomeFeatures: React.FC = () => (
  <section>
    <h2 className="text-xl text-black font-bold mb-6">Home Features</h2>
    <section className="bg-[#F4F4F4] pl-6 py-3 items-center flex rounded-sm mb-6">
      <h3 className="text-lg text-black font-medium">Interior</h3>
    </section>
    <section className="grid grid-cols-3">
      <section>
        <FeatureItem items={['Hardwood floors']} title="Flooring" />
        <FeatureItem items={['Hardwood floors']} title="Cooling" />
        <FeatureItem items={['Hardwood floors']} title="Heating" />
      </section>
      <section>
        <FeatureItem
          items={['4 Bedroom', '3 Bathroom', 'Hot tub', 'Shower in tub']}
          title="Bedroom & Bathroom"
        />
        <FeatureItem
          items={['Double pane windows', 'High Ceilings']}
          title="Interior Features"
        />
      </section>
      <section>
        <FeatureItem items={['4 Bedroom', '3 Bathroom']} title="Kitchen" />
        <FeatureItem
          items={['Double pane windows', 'High Ceilings']}
          title="Appliances"
        />
      </section>
    </section>
    <section className="bg-[#F4F4F4] pl-6 py-3 items-center flex rounded-sm mb-6">
      <h3 className="text-lg text-black font-medium">Exterior</h3>
    </section>
    <section className="grid grid-cols-3">
      <section>
        <FeatureItem items={['Hardwood floors']} title="Roofing" />
      </section>
      <section>
        <FeatureItem items={['3 Car lot']} title="Parking" />
      </section>
      <section>
        <FeatureItem items={['Swimming Pool']} title="Yard" />
      </section>
    </section>
  </section>
)

export { HomeFeatures }
