import { RoundedButton } from 'components/common/buttons/RoundedButton'
import Dropdown from 'components/common/DropDown'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'

const ShareProperty = () => {
  const handleSelect = (option: string) => {}
  return (
    <section className="p-10 flex flex-col gap-6 ">
      <p className="font-medium text-black text-lg">Share Property</p>
      <Dropdown
        options={[
          { label: 'Agent', value: 'Agent' },
          { label: 'Buyer', value: 'Buyer' },
          { label: 'Seller', value: 'Seller' },
          { label: 'Broker', value: 'Broker' }
        ]}
        placeholder="Role"
        onSelect={handleSelect}
        value={(option) => {
          option.value
        }}
      />
      <section className="flex gap-3">
        <BorderedTextInput
          placeholder="Name"
          inputClassName="font-medium text-sm text-[#020202]  bg-[#F5F6F9]"
          className="border border-[#707070] rounded-md"
        />
        <BorderedTextInput
          placeholder="Enter email address"
          inputClassName="font-medium text-sm text-[#020202]  bg-[#F5F6F9]"
          className="border border-[#707070] rounded-md"
        />
      </section>
      <BorderedTextInput
        placeholder="Message"
        inputClassName="font-medium text-sm text-[#020202] border-[#707070] bg-[#F5F6F9] "
        className="border border-[#707070] rounded-md h-20"
      />
      <section className="flex items-center justify-between">
        <RoundedButton
          label="Copy Link"
          onClick={() => {}}
          variant="primary"
          className="bg-white text-black py-2 px-12 text-sm border border-solid border-black"
        />
        <RoundedButton
          label="Share"
          onClick={() => {}}
          variant="primary"
          className="bg-black text-white py-3 px-16 text-sm"
        />
      </section>
    </section>
  )
}

export default ShareProperty
