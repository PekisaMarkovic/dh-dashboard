import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const WAREHOUSE_VALIDATION = yupResolver(
  Yup.object({
    name: Yup.string().typeError('name').trim().required('name').max(150, 'name'),
  }),
)
