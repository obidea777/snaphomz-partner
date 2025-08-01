import React from 'react'

const SchoolsNearby: React.FC = () => (
  <section>
    <h2 className="text-xl text-black font-bold my-6">Schools nearby</h2>
    <section className="grid grid-cols-6 border-b-[0.015rem] boder-solid border-[#707070] pb-4">
      <h3 className="font-bold text-sm text-black col-span-2">School name</h3>
      <h3 className="font-bold text-sm text-black">Type</h3>
      <h3 className="font-bold text-sm text-black">Grades</h3>
      <h3 className="font-bold text-sm text-black">Distance</h3>
      <h3 className="font-bold text-sm text-black">Ratings</h3>
    </section>
    <section className="grid grid-cols-6 border-b-[0.015rem] boder-solid border-[#707070] py-5">
      <h3 className="font-bold text-sm text-[#8E929C] col-span-2">
        Hidden Valley Elementary
      </h3>
      <h3 className="font-bold text-sm text-[#8E929C]">Public</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">KG - 5</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">1.7 mi</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">8/10</h3>
    </section>
    <section className="grid grid-cols-6 border-b-[0.015rem] boder-solid border-[#707070] py-5">
      <h3 className="font-bold text-sm text-[#8E929C] col-span-2">
        White Hill Middle School
      </h3>
      <h3 className="font-bold text-sm text-[#8E929C]">Public</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">KG - 5</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">1.7 mi</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">8/10</h3>
    </section>
    <section className="grid grid-cols-6 border-b-[0.015rem] boder-solid border-[#707070] py-5">
      <h3 className="font-bold text-sm text-[#8E929C] col-span-2">
        Richie Williams High School
      </h3>
      <h3 className="font-bold text-sm text-[#8E929C]">Public</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">KG - 5</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">1.7 mi</h3>
      <h3 className="font-bold text-sm text-[#8E929C]">8/10</h3>
    </section>
  </section>
)

export { SchoolsNearby }
