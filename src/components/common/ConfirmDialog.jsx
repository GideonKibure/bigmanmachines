import Button from './Button'
import Modal from './Modal'

export default function ConfirmDialog({ open, title, text, confirmLabel = 'Thibitisha', onCancel, onConfirm, busy }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-muted">{text}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="surface" onClick={onCancel}>
          Ghairi
        </Button>
        <Button type="button" variant="danger" disabled={busy} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
