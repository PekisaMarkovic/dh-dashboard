import { useCallback } from 'react'
import { useProformaService } from '@/src/services/use-proforma-service'
import { printBlob } from '@/src/utils/files'

/**
 * Opens the print dialog for the PDF of a proforma. Throws when it fails,
 * so the caller decides what to tell the user.
 */
export const useProformaPrint = () => {
  const { getProformaPdf } = useProformaService()

  return useCallback(
    async (proformaId: number) => {
      await printBlob(await getProformaPdf(proformaId))
    },
    [getProformaPdf],
  )
}
