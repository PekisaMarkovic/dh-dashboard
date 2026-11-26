import { useTranslation } from 'react-i18next'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DefaultTableRowContainer from '@/src/components/table/DefaultTableRowContainer'
import TableCell from '@/src/components/table/TableCell'
import { CustomDropdown, ICategory } from '@/src/interfaces'

type Props = {
  category: ICategory
  dropdownOptions: CustomDropdown[]
}

const CategoryRow = ({ category, dropdownOptions }: Props) => {
  const { t } = useTranslation(['drink'])

  return (
    <DefaultTableRowContainer cols={3} dropdownOptions={dropdownOptions}>
      <TableCell isTitle label={t('drink:categories.table.name')} className="col-span-2">
        <Paragraph text={category.name} size="sm" color="black" />
      </TableCell>
      <TableCell label={t('drink:categories.table.drinks')}>
        <Paragraph text={String(category.drinksCount ?? 0)} size="sm" color="black" noWrap />
      </TableCell>
    </DefaultTableRowContainer>
  )
}

export default CategoryRow
