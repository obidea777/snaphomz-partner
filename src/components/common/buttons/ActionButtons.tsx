import { RoundedButton } from './RoundedButton'

type ActionButtonsProps = {
  onOpen: () => void
  onEdit: () => void
  onRemove: () => void
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOpen,
  onEdit,
  onRemove
}) => (
  <section className="flex items-center gap-4">
    <RoundedButton
      label="Open"
      onClick={onOpen}
      variant="primary"
      className="w-1/3 "
    />
    <RoundedButton
      label="Edit"
      onClick={onEdit}
      variant="secondary"
      className="w-1/3 "
    />
    <RoundedButton
      label="Remove"
      onClick={onRemove}
      variant="danger"
      className="w-1/3 "
    />
  </section>
)

export { ActionButtons }
