/* eslint-disable react-refresh/only-export-components */
import { Dialog } from '@base-ui-components/react/dialog'

interface ModalRootProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function ModalRoot({ open, onOpenChange, children }: ModalRootProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

interface ModalContentProps {
  title: string
  children: React.ReactNode
}

function ModalContent({ title, children }: ModalContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="modal-backdrop" />
      <Dialog.Popup className="modal">
        <Dialog.Title className="modal-title">{title}</Dialog.Title>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  )
}

export const Modal = {
  Root: ModalRoot,
  Content: ModalContent,
  Close: Dialog.Close,
}
