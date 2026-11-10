import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'

export type ConfirmModalData = {
  title: string
  message: string
  // without onConfirm the modal is only an info message with a close button
  onConfirm?: () => Promise<void> | void
  confirmText?: string
  danger?: boolean
}

const ConfirmModal = () => {
  const { t } = useTranslation(['g'])
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(selectModal)
  const { title, message, onConfirm, confirmText, danger = true } = (data as ConfirmModalData | null) || { title: '', message: '' }
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => dispatch(removeModal())

  const handleConfirm = async () => {
    setIsLoading(true)

    try {
      await onConfirm?.()
    } finally {
      setIsLoading(false)
      handleClose()
    }
  }

  return (
    <div className="max-w-md">
      <Heading text={title} variant="2" size="base" color="black" />
      <Paragraph text={message} size="sm" color="grey" className="mt-3" />

      <div className="flex justify-end gap-x-4 mt-8">
        <MainButton
          text={onConfirm ? t('g:button.cancel') : t('g:button.okey')}
          variant={onConfirm ? 'alternative' : 'contained'}
          size="medium"
          onClick={handleClose}
        />
        {onConfirm && (
          <MainButton
            text={confirmText || t('g:button.confirm')}
            variant={danger ? 'error' : 'contained'}
            size="medium"
            disabled={isLoading}
            onClick={handleConfirm}
          />
        )}
      </div>
    </div>
  )
}

export default ConfirmModal
