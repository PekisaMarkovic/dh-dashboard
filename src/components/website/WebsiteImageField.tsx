import { ChangeEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import customToast from '@/src/components/core/toast/CustomToast'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { IWebsiteImage, WebsiteImageSlot } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { formatFileSize } from '@/src/utils/files'

// the same numbers as the api (storage.constants.ts)
const IMAGE_MAX_MB = 5
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

type Props = {
  slot: WebsiteImageSlot
  image: IWebsiteImage | null
  // the title above the picture
  label: string
  // the recommended size and format
  hint: string
  // the shape of the preview: it is the shape the picture has on the site
  previewClass?: string
}

// how wide the picture is shown after it is uploaded: the whole picture, in its own proportions (it is not cropped)
const MAX_PREVIEW_WIDTH: Record<WebsiteImageSlot, string> = { logo: 'max-w-sm', hero: 'max-w-xl', story: 'max-w-md', promo: 'max-w-[260px]' }

// a checkerboard behind the picture, so a transparent logo is visible
const CHECKERBOARD = {
  backgroundImage: 'conic-gradient(#e2e8f0 25%, #f8fafc 0 50%, #e2e8f0 0 75%, #f8fafc 0)',
  backgroundSize: '16px 16px',
}

const SLOT_FOLDERS = { logo: 'general', hero: 'hero', story: 'story', promo: 'promo' }

/**
 * One picture of the site (logo, background of the hero, story, promo). It is saved the moment it is picked,
 * the api makes a WebP of it and keeps it in the folder client/<section> of the company.
 */
const WebsiteImageField = ({ slot, image, label, hint, previewClass = 'aspect-video w-64' }: Props) => {
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
    void run(() => uploadImage(slot, file), t('website:image.uploaded'))
  }

  return (
    <div className="flex flex-col gap-y-3" data-folder={SLOT_FOLDERS[slot]}>
      <span className="font-poppins text-sm font-medium text-black">
        {label}
        <span className="text-red"> *</span>
      </span>
      <div className="flex flex-wrap items-start gap-4">
        {image ? (
          <div className={`w-full ${MAX_PREVIEW_WIDTH[slot]} flex flex-col gap-y-1`}>
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
            <span className="font-poppins text-xs text-dark-grey">
              {t('website:image.info', { width: image.width, height: image.height, size: formatFileSize(image.size) })}
            </span>
          </div>
        ) : (
          <div className={`${previewClass} flex items-center justify-center overflow-hidden rounded-sm border-1 border-red border-solid bg-grey-100`}>
            <span className="font-poppins text-xs text-grey">{t('website:image.noImage')}</span>
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
                onClick={() => void run(() => deleteImage(slot), t('website:image.removed'))}
              />
            )}
          </div>
          <p className="font-poppins text-xs text-dark-grey">{hint}</p>
          {!image && <p className="font-poppins text-sm text-red">{t('website:image.required')}</p>}
          {error && <p className="font-poppins text-xs text-red">{error}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept={IMAGE_ACCEPT} onChange={handleFile} className="hidden" />
    </div>
  )
}

export default WebsiteImageField
