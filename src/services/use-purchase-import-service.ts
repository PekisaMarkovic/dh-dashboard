import { useMemo } from 'react'
import PurchaseImportApis from '@/src/api/purchase-import'
import { useApi } from '@/src/hooks/use-api'
import { PageParams, Paginated } from '@/src/interfaces'

export type PurchaseLine = { purchaseImportItemId: number; name: string; quantity: number; drinkId: number | null }
export type PurchaseDrink = { drinkId: number; name: string }
export type PurchaseParseResult = { purchaseImportId: number; items: PurchaseLine[]; drinks: PurchaseDrink[] }

export type PurchaseImportStatus = 'parsing' | 'parsed' | 'failed' | 'applied'

// a line of the history of the uploaded documents
export type IPurchaseImport = {
  purchaseImportId: number
  createdAt: string
  appliedAt: string | null
  // the title the AI read from the document, empty when it found none (then the file name is shown)
  title: string | null
  fileName: string
  fileSize: number
  status: PurchaseImportStatus
  model: string | null
  durationMs: number | null
  errorMessage: string | null
  warehouseName: string
  userName: string
  linesCount: number
  appliedCount: number
}

// one uploaded document with its lines and the drinks of its warehouse
export type PurchaseImportDetail = {
  purchaseImportId: number
  createdAt: string
  title: string | null
  fileName: string
  status: PurchaseImportStatus
  errorMessage: string | null
  warehouseName: string
  userName: string
  items: {
    purchaseImportItemId: number
    name: string
    quantity: number
    suggestedDrinkId: number | null
    appliedDrinkId: number | null
    appliedQuantity: number | null
  }[]
  drinks: PurchaseDrink[]
}

export type ApplyLine = { purchaseImportItemId: number; drinkId: number; quantity: number }

export const usePurchaseImportService = () => {
  const api = useApi()

  return useMemo(() => {
    // reads the drinks and quantities from an image or a PDF, the stock is not changed yet
    const parse = async (warehouseId: number, file: File) => {
      const body = new FormData()
      body.append('warehouseId', String(warehouseId))
      body.append('file', file)
      // the api sends json by default, which would turn the form data into json and lose the file
      const { data } = await api.post<PurchaseParseResult>(PurchaseImportApis.parse(), body, { headers: { 'Content-Type': 'multipart/form-data' } })

      return data
    }

    const apply = async (purchaseImportId: number, items: ApplyLine[]) => {
      const { data } = await api.post<{ updated: number }>(PurchaseImportApis.apply(), { purchaseImportId, items })

      return data
    }

    // one page of the uploaded documents, newest first
    const getHistory = async ({ search, ...paging }: PageParams) => {
      const { data } = await api.get<Paginated<IPurchaseImport>>(PurchaseImportApis.history(), { params: { ...paging, search: search || undefined } })

      return data
    }

    const getImport = async (purchaseImportId: number) => {
      const { data } = await api.get<PurchaseImportDetail>(PurchaseImportApis.detail(purchaseImportId))

      return data
    }

    // removes the document from the history, the stock that was added stays
    const deleteImport = async (purchaseImportId: number) => {
      await api.delete(PurchaseImportApis.remove(purchaseImportId))
    }

    return { parse, apply, getHistory, getImport, deleteImport }
  }, [api])
}
