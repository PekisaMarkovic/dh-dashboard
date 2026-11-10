import { useCallback } from 'react'
import { useProformaService } from '@/src/services/use-proforma-service'
import { downloadBlob } from '@/src/utils/files'

type DownloadableProforma = {
  proformaId: number
  number: string
}

/**
 * Downloads the PDF of a proforma. Throws when the request fails,
 * so the caller decides what to tell the user.
 */
export const useProformaDownload = () => {
  const { getProformaPdf } = useProformaService()

  return useCallback(
    async ({ proformaId, number }: DownloadableProforma) => {
      downloadBlob(await getProformaPdf(proformaId), `${number}.pdf`)
    },
    [getProformaPdf],
  )
}
