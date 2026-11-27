import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import SingleSelectFormless from '@/src/components/core/select/SingleSelectFormless'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { SelectOption } from '@/src/interfaces'

// one line of a purchase document, as the modal edits it
export type Row = {
  id: number
  name: string
  quantity: string
  drink: SelectOption | null
  skip: boolean
  // the line was already added to the stock, it can not be changed any more
  isAdded: boolean
}

// the names take the free space, the quantity and the button have a fixed width so nothing overlaps (the same columns in the header)
export const COLUMNS = 'md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_5.5rem_6rem]'

const INPUT_CLASS = 'w-full py-3 px-3 rounded-xs-plus border-1 border-solid border-grey font-poppins text-sm focus:outline-none focus:border-green'

type Props = {
  row: Row
  // the drinks of the warehouse to pick from
  options: SelectOption[]
  onChange: (change: Partial<Row>) => void
}

// one line of the document: the name on the document, the picked drink, the quantity and skip / include; an added line is only shown
const PurchaseImportLineRow = ({ row, options, onChange }: Props) => {
  const { t } = useTranslation(['purchase'])

  return (
    <div
      className={`grid grid-cols-2 ${COLUMNS} gap-x-4 gap-y-2 items-center px-1 py-3 border-b-1 border-b-light-grey-alt border-solid ${
        row.isAdded ? 'bg-green-transparent/40' : ''
      }`}
    >
      <div className={`col-span-2 md:col-span-1 min-w-0 break-words ${row.skip ? 'opacity-50' : ''}`}>
        <Paragraph text={row.name} size="sm" color="black" />
      </div>

      {row.isAdded ? (
        <>
          <div className="col-span-2 md:col-span-1 min-w-0 break-words">
            <Paragraph text={row.drink?.name ?? ''} size="sm" color="green" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <Paragraph text={row.quantity} size="sm" color="green" />
          </div>
          <span className="hidden md:block" />
        </>
      ) : (
        <>
          <div className={`col-span-2 md:col-span-1 min-w-0 ${row.skip ? 'opacity-50' : ''}`}>
            <SingleSelectFormless
              isLabelHidden
              disabled={row.skip}
              name={`drink-${row.id}`}
              label={t('purchase:modal.drink')}
              placeholder={t('purchase:modal.pickDrink')}
              options={options}
              selected={row.drink}
              setSelected={(drink: SelectOption | null) => onChange({ drink })}
            />
          </div>

          <div className={`min-w-0 ${row.skip ? 'opacity-50' : ''}`}>
            <span className="md:hidden block mb-0.5 font-poppins text-xs text-grey">{t('purchase:modal.quantity')}</span>
            <input
              type="number"
              min={1}
              disabled={row.skip}
              value={row.quantity}
              onChange={(e) => onChange({ quantity: e.target.value })}
              className={INPUT_CLASS}
            />
          </div>

          <div className="flex justify-end items-end md:items-center">
            <MainButton
              text={row.skip ? t('purchase:modal.include') : t('purchase:modal.skip')}
              variant="text"
              size="extra-small"
              className="whitespace-nowrap"
              onClick={() => onChange({ skip: !row.skip })}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default PurchaseImportLineRow
