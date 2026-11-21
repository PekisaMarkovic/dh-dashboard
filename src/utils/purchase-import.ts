import { PurchaseImportStatus } from '@/src/services/use-purchase-import-service'

// the state of a document in one word: waiting for a check, partly added, added, failed
export const getImportState = ({ status, linesCount, appliedCount }: { status: PurchaseImportStatus; linesCount: number; appliedCount: number }) => {
  if (status === 'applied') return appliedCount >= linesCount ? 'applied' : 'partial'

  return status
}

// the title the AI read from the document, or the name of the uploaded file when it found none
export const getImportName = ({ title, fileName }: { title: string | null; fileName: string }) => title || fileName
