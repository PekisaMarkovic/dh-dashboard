import { PropsWithChildren, useCallback } from 'react'
import Modal from 'react-modal'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { useMediaQuery } from '@/src/hooks/use-media-query'
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

// on a phone the window takes the whole width (with a small margin) and has less padding
const phoneStyles = {
  content: {
    width: 'calc(100% - 1.5rem)',
    minWidth: 0,
    padding: '16px',
    maxHeight: '92dvh',
  },
}

const getCustomStyles = (variant: ModalVariant, isPhone: boolean) => ({
  ...customStyles,
  content: {
    ...customStyles.content,
    ...(variant === 'new' ? customStylesNewVariant.content : undefined),
    ...(isPhone ? phoneStyles.content : undefined),
  },
})

type Props = {
  variant?: ModalVariant
}

const ModalConfiguration = ({ variant = 'old', children }: PropsWithChildren<Props>) => {
  const dispatch = useAppDispatch()
  const isPhone = useMediaQuery('(max-width: 767px)')

  const handleClose = useCallback(() => {
    dispatch(removeModal())
  }, [])

  Modal.setAppElement('#root')
  return (
    <Modal isOpen onRequestClose={handleClose} style={getCustomStyles(variant, isPhone)}>
      {children}
    </Modal>
  )
}

export default ModalConfiguration
