/**
 * Saves a blob (e.g. a PDF from the api) as a file in the browser
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

/**
 * Opens the print dialog for a PDF blob, without leaving the page.
 * The PDF is loaded in a hidden frame and that frame is printed.
 * With Chrome started with --kiosk-printing the dialog is skipped and it goes straight to the default printer.
 */
export const printBlob = (blob: Blob) =>
  new Promise<void>((resolve, reject) => {
    const url = window.URL.createObjectURL(blob)
    const frame = document.createElement('iframe')

    const cleanup = () => {
      frame.remove()
      window.URL.revokeObjectURL(url)
    }

    frame.style.position = 'fixed'
    frame.style.right = '0'
    frame.style.bottom = '0'
    frame.style.width = '0'
    frame.style.height = '0'
    frame.style.border = '0'

    frame.onload = () => {
      try {
        frame.contentWindow?.focus()
        frame.contentWindow?.print()
        resolve()
      } catch (error) {
        reject(error)
      } finally {
        // the print dialog keeps the document it needs, the frame can go a bit later
        window.setTimeout(cleanup, 60_000)
      }
    }

    frame.src = url
    document.body.appendChild(frame)
  })

export type PdfTab = {
  /** shows the PDF in the tab and opens the print dialog for it */
  show: (blob: Blob, title: string) => void
  /** closes the tab, e.g. when the PDF could not be made */
  close: () => void
}

/**
 * Opens a new, empty tab to show a PDF in later.
 * It has to be called right in the click, before any waiting, otherwise the browser blocks the tab as a pop-up.
 * Returns null when the browser did block it.
 */
export const openPdfTab = (): PdfTab | null => {
  const tab = window.open('', '_blank')

  if (!tab) return null

  tab.document.title = '...'

  return {
    show: (blob, title) => {
      const url = window.URL.createObjectURL(blob)
      const frame = tab.document.createElement('iframe')

      tab.document.title = title
      tab.document.body.style.margin = '0'
      frame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0'
      frame.onload = () => {
        frame.contentWindow?.focus()
        frame.contentWindow?.print()
      }
      frame.src = url
      tab.document.body.appendChild(frame)
    },
    close: () => tab.close(),
  }
}
