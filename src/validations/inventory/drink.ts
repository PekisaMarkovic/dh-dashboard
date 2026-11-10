import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const DRINK_VALIDATION = yupResolver(
  Yup.object({
    name: Yup.string().typeError('name').trim().required('name').max(150, 'name'),
    price: Yup.number().typeError('price').required('price').min(0, 'price'),
    warehouse: Yup.mixed(),
    quantity: Yup.number().typeError('quantity').required('quantity').integer('quantity').min(0, 'quantity'),
  }),
)
