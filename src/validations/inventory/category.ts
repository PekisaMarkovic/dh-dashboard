import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

export const CATEGORY_VALIDATION = yupResolver(
  Yup.object({
    name: Yup.string().typeError('name').trim().required('name').max(100, 'name'),
  }),
)
