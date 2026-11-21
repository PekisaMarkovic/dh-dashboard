const MAX_SIDE = 2200
const QUALITY = 0.85

/**
 * A photo from a phone is 5-10 MB, which is slow to send and over the limit of the api.
 * The text of a document is readable at 2200 px, so a bigger image is made smaller (jpeg).
 * Anything that is not an image (a PDF), or can not be drawn, is returned as it is.
 */
export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))

    // small enough already
    if (scale === 1 && file.size < 2 * 1024 * 1024) return file

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY))

    return blob ? new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : file
  } catch {
    return file
  }
}
