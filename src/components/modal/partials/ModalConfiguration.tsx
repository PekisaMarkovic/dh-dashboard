import { PropsWithChildren, useCallback } from 'react'
import Modal from 'react-modal'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal } from '@/src/state/shared/modal'

export type ModalVariant = 'new' | 'old'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    maxWidth: '800px',
    maxHeight: '90vh',
    minWidth: 354,
    zIndex: '999',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.30)', // Adjust the opacity as needed
    zIndex: '999',
  },
}

const customStylesNewVariant = {
  content: {
    padding: 0,
  },
}

const getCustomStyles = (variant: ModalVariant) => ({
  ...customStyles,
  content: {
    ...customStyles.content,
    ...(variant === 'new' ? customStylesNewVariant.content : undefined),
  },
})

type Props = {
  variant?: ModalVariant
}

const ModalConfiguration = ({ variant = 'old', children }: PropsWithChildren<Props>) => {
  const dispatch = useAppDispatch()

  const handleClose = useCallback(() => {
    dispatch(removeModal())
  }, [])

  Modal.setAppElement('#root')
  return (
    <Modal isOpen onRequestClose={handleClose} style={getCustomStyles(variant)}>
      {children}
    </Modal>
  )
}

export default ModalConfiguration
