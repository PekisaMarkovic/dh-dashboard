import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { isValidPriceInput } from '@/src/utils/money'

export const DRINK_VALIDATION = yupResolver(
  Yup.object({
    code: Yup.string().typeError('code').trim().required('code').max(50, 'code'),
    name: Yup.string().typeError('name').trim().required('name').max(150, 'name'),
    // typed like it is shown: 2,304.500 (up to 3 decimals, commas separate thousands)
    price: Yup.string()
      .required('price')
      .test('price-format', 'price', (value) => isValidPriceInput(value ?? '')),
    warehouse: Yup.mixed(),
    quantity: Yup.number().typeError('quantity').required('quantity').integer('quantity').min(0, 'quantity'),
    warningQuantity: Yup.number().typeError('warningQuantity').required('warningQuantity').integer('warningQuantity').min(0, 'warningQuantity'),
    // the red level has to be lower than the orange one (0 means it is off)
    criticalQuantity: Yup.number()
      .typeError('criticalQuantity')
      .required('criticalQuantity')
      .integer('criticalQuantity')
      .min(0, 'criticalQuantity')
      .test('lower-than-warning', 'criticalQuantity', function (value) {
        const warning = Number(this.parent.warningQuantity)

        return !(value > 0 && value >= warning)
      }),
  }),
)
