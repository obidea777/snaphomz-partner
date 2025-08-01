import { RoundedButton } from 'components/common/buttons/RoundedButton'

const RemoveProperty = ({ closeModal, deleteProperty }) => {
  return (
    <section className="py-20  flex flex-col items-center">
      <p className="font-medium text-black text-3xl mb-4">Remove Property</p>
      <p className="font-light text-lg text[#666666 mb-16">
        Are you sure you want to Remove this property?
      </p>
      <section className="flex items-center  gap-3 ">
        <RoundedButton
          label="No"
          onClick={() => {
            closeModal()
          }}
          variant="primary"
          className="bg-white text-black py-2 px-16 text-sm border border-solid border-black"
        />
        <RoundedButton
          label="Yes, Proceed"
          onClick={() => {
            deleteProperty()
          }}
          loading={false}
          variant="primary"
          className="bg-black text-white py-2 text-sm"
        />
      </section>
    </section>
  )
}

export default RemoveProperty
