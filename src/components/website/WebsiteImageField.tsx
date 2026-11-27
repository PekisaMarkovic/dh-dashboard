import { ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { IWebsiteImage } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { formatFileSize } from '@/src/utils/files'
import ErrorMessage from '@/src/components/core/typography/ErrorMessage'
import FieldTitle from '@/src/components/core/typography/FieldTitle'
import Paragraph from '@/src/components/core/typography/Paragraph'

// the same numbers as the api (storage.constants.ts)
const IMAGE_MAX_MB = 5
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

// what the picture is, it sets how big the preview is
export type ImageKind = 'logo' | 'hero' | 'story' | 'info' | 'og'

type Props = {
  // where the api keeps it: 'logo', 'sections/<id>/image' or 'pages/<id>/seo/image'
  path: string
  kind: ImageKind
  image: IWebsiteImage | null
  // the title above the picture
  label: string
  // the recommended size and format
  hint: string
  // the shape of the preview: it is the shape the picture has on the site
  previewClass?: string
  // false: the site has a fallback picture (e.g. the picture of the home page)
  isRequired?: boolean
}

// how wide the picture is shown after it is uploaded: the whole picture, in its own proportions (it is not cropped)
const MAX_PREVIEW_WIDTH: Record<ImageKind, string> = { logo: 'max-w-sm', hero: 'max-w-xl', story: 'max-w-md', info: 'max-w-[260px]', og: 'max-w-md' }

// a checkerboard behind the picture, so a transparent logo is visible
const CHECKERBOARD = {
  backgroundImage: 'conic-gradient(#e2e8f0 25%, #f8fafc 0 50%, #e2e8f0 0 75%, #f8fafc 0)',
  backgroundSize: '16px 16px',
}

/**
 * One picture of the site (logo, the picture of a section, the picture for sharing a page). It is saved the moment it is picked,
 * the api makes a WebP of it and keeps it in the folder client/<kind> of the company.
 */
const WebsiteImageField = ({ path, kind, image, label, hint, previewClass = 'aspect-video w-64', isRequired = true }: Props) => {
  const { t } = useTranslation(['website'])
  const showError = useErrorToast()
  const { uploadImage, deleteImage } = useWebsiteService()
  const { afterWebsiteChange } = useRefreshData()
  const input = useRef<HTMLInputElement>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (action: () => Promise<unknown>, doneText: string) => {
    setIsBusy(true)

    try {
      await action()
      await afterWebsiteChange()
      customToast.success(doneText)
    } catch (e) {
      showError(e)
    } finally {
      setIsBusy(false)
    }
  }

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!IMAGE_ACCEPT.split(',').includes(file.type)) {
      setError(t('website:image.notImage'))

      return
    }

    if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
      setError(t('website:image.tooBig', { maxMb: IMAGE_MAX_MB }))

      return
    }

    setError('')
    void run(() => uploadImage(path, file), t('website:image.uploaded'))
  }

  return (
    <div className="flex flex-col gap-y-3">
      <FieldTitle text={label} isRequired={isRequired} />
      <div className="flex flex-wrap items-start gap-4">
        {image ? (
          <div className={`w-full ${MAX_PREVIEW_WIDTH[kind]} flex flex-col gap-y-1`}>
            {/* click to see the picture in its full size */}
            <a href={image.url} target="_blank" rel="noopener noreferrer" title={t('website:image.open')} className="block overflow-hidden rounded-sm border-1 border-light-grey-alt border-solid">
              <img
                src={image.url}
                alt={image.altText || label}
                width={image.width}
                height={image.height}
                style={{ ...CHECKERBOARD, aspectRatio: `${image.width} / ${image.height}` }}
                className="block h-auto w-full object-contain"
              />
            </a>
            <Paragraph text={t('website:image.info', { width: image.width, height: image.height, size: formatFileSize(image.size) })} color="dark-grey" />
          </div>
        ) : (
          <div
            className={`${previewClass} flex items-center justify-center overflow-hidden rounded-sm border-1 border-solid bg-grey-100 ${isRequired ? 'border-red' : 'border-light-grey-alt'}`}
          >
            <Paragraph text={t('website:image.noImage')} color="grey" />
          </div>
        )}
        <div className="flex min-w-[220px] flex-1 flex-col gap-y-2">
          <div className="flex flex-wrap gap-2">
            <MainButton
              text={image ? t('website:image.change') : t('website:image.choose')}
              variant="outlined"
              size="small"
              htmlType="button"
              disabled={isBusy}
              onClick={() => input.current?.click()}
            />
            {image && (
              <MainButton
                text={t('website:image.remove')}
                variant="outlined"
                size="small"
                htmlType="button"
                disabled={isBusy}
                onClick={() => void run(() => deleteImage(path), t('website:image.removed'))}
              />
            )}
          </div>
          <Paragraph text={hint} color="dark-grey" />
          {!image && isRequired && <ErrorMessage message={t('website:image.required')} />}
          {error && <ErrorMessage message={error} />}
        </div>
      </div>
      <input ref={input} type="file" accept={IMAGE_ACCEPT} onChange={handleFile} className="hidden" />
    </div>
  )
}

export default WebsiteImageField
