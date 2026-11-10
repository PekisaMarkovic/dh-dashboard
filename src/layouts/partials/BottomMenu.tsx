import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import { useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectBehaviours } from '@/src/state/shared/behaviours'

type Props = {
  cancelButton?: {
    onClick: () => void
  }
}

const BottomMenu = ({ cancelButton }: Props) => {
  const { t } = useTranslation(['g'])
  const { isSaveDisabled } = useAppSelector(selectBehaviours)

  return (
    <div className="pt-5 pb-6 pr-8 flex flex-row-reverse border-t-1 border-t-lighy-grey border-solid bg-white">
      <div className="flex gap-x-6 items-center">
        {cancelButton && <MainButton text={t('g:button.cancel')} variant="alternative" size="medium" onClick={cancelButton.onClick} />}
        <MainButton disabled={!!isSaveDisabled.length} text={t('g:button.saveChanges')} variant="contained" size="medium" htmlType="submit" />
      </div>
    </div>
  )
}

export default BottomMenu
