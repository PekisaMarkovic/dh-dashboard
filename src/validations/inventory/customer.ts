import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const CUSTOMER_VALIDATION = yupResolver(
  Yup.object({
    code: Yup.string().typeError('code').trim().required('code').max(50, 'code'),
    name: Yup.string().typeError('name').trim().required('name').max(150, 'name'),
  }),
)
