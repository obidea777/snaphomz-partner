import React from 'react'
import Image from 'next/image'
import { BorderedTextInput } from 'components/common/inputs/BorderedTextInput'

interface EditableSectionProps {
  onEditClick?: () => void
  onDeleteClick?: () => void
  titlePlaceholder?: string
  descriptionPlaceholder?: string
  title?: string
  description?: string
}

const EditableSection: React.FC<EditableSectionProps> = ({
  onEditClick,
  onDeleteClick,
  titlePlaceholder = 'Title',
  descriptionPlaceholder = 'Description',
  title,
  description
}) => {
  return (
    <section className="grid grid-cols-2 gap-x-4 mb-8">
      <section className="flex items-center justify-between gap-x-4">
        <Image
          height={16}
          width={16}
          src="/assets/images/icons/editIcon.svg"
          alt="Edit Icon"
          className="cursor-pointer object-contain"
          onClick={onEditClick}
        />
        <BorderedTextInput
          placeholder={titlePlaceholder}
          defaultValue={title}
        />
      </section>
      <section className="flex items-center justify-between gap-x-4">
        <BorderedTextInput
          placeholder={descriptionPlaceholder}
          defaultValue={description}
        />
        <Image
          height={16}
          width={16}
          src="/assets/images/icons/inputDeleteIcon.svg"
          alt="Delete Icon"
          className="cursor-pointer object-contain"
          onClick={onDeleteClick}
        />
      </section>
    </section>
  )
}

export default EditableSection
