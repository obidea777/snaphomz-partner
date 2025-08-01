import React from 'react'

type IFeaturesProps = {
  title: string
  items: string[]
}

const FeatureItem = ({ title, items }: IFeaturesProps) => {
  return (
    <section className="mb-5">
      <h4 className="font-medium text-base mb-4">{title}</h4>
      {items.map((item, index) => (
        <section className="flex items-center mb-2" key={index}>
          <div className="rounded-full h-2 w-2 bg-[#FFB895] mr-4" />
          <p className="font-mdeium text-sm text-[#8E929C]">{item}</p>
        </section>
      ))}
    </section>
  )
}

export { FeatureItem }
