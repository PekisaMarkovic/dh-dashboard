import { MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  handleDelete?: () => void
  handleEdit?: () => void
}

const EditOrDeleteDropdown = ({ handleDelete, handleEdit }: Props) => {
  const { t } = useTranslation(['g'])

  const handleOnDelete: MouseEventHandler<HTMLParagraphElement> = () => {
    if (handleDelete) {
      handleDelete()
    }
  }
  const handleOnEdit: MouseEventHandler<HTMLParagraphElement> = () => {
    if (handleEdit) {
      handleEdit()
    }
  }

  return (
    <div className="shadow-drop-down bg-white absolute top-full right-3 py-1.5 border-1 border-lighy-grey rounded-sm z-5 w-36">
      {handleEdit && (
        <p className="font-poppins text-black py-2 px-2.5 bg-light-grey-transparent cursor-pointer" onClick={handleOnEdit}>
          {t('g:button.edit')}
        </p>
      )}
      {handleDelete && (
        <p className="font-poppins text-red py-2 px-2.5 cursor-pointer" onClick={handleOnDelete}>
          {t('g:button.delete')}
        </p>
      )}
    </div>
  )
}

export default EditOrDeleteDropdown
