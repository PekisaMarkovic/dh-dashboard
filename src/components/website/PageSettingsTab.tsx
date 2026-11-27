import { useMemo } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { ConfirmModalData } from '@/src/components/modal/ConfirmModal'
import DataSection from '@/src/components/section/DataSection'
import { ModalEnums } from '@/src/enum'
import { useWebsiteAction } from '@/src/hooks/use-save-website'
import { IWebsitePage } from '@/src/interfaces'
import { useWebsiteService } from '@/src/services/use-website-service'
import { useAppDispatch } from '@/src/state/redux-hooks/reduxHooks'
import { openModal } from '@/src/state/shared/modal'
import { isSystemPage, MAX_MENU_PAGES } from '@/src/utils/website'
import { PAGE_VALIDATION } from '@/src/validations/website/website'

type Props = {
  page: IWebsitePage
  // how many pages are in the main menu
  menuCount: number
  // after the page is deleted
  onDeleted: () => void
}

// "Podešavanja" of a page: its name, its address, whether it is on the site, and deleting it.
// The home page and the drinks menu keep their address, stay published and can not be deleted
const PageSettingsTab = ({ page, menuCount, onDeleted }: Props) => {
  const { t } = useTranslation(['website'])
  const run = useWebsiteAction()
  const dispatch = useAppDispatch()
  const { updatePage, deletePage } = useWebsiteService()
  const isSystem = isSystemPage(page)
  const isPublished = page.status === 'published'
  const values = useMemo(() => ({ title: page.title, slug: page.slug }), [page])
  const methods = useForm<FieldValues>({ resolver: PAGE_VALIDATION as unknown as Resolver<FieldValues>, values })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await run(() => updatePage(page.pageId, isSystem ? { title: data.title } : { title: data.title, slug: data.slug }))
  }

  const handleStatus = () =>
    void run(
      () => updatePage(page.pageId, { status: isPublished ? 'draft' : 'published' }),
      isPublished ? t('website:page.unpublished') : t('website:page.published'),
    )

  const isHome = page.slug === ''
  const isMenuFull = !page.isInMenu && menuCount >= MAX_MENU_PAGES

  const handleMenu = () =>
    void run(() => updatePage(page.pageId, { isInMenu: !page.isInMenu }), page.isInMenu ? t('website:page.menuRemoved') : t('website:page.menuAdded'))

  const handleDelete = () =>
    dispatch(
      openModal({
        modal: ModalEnums.CONFIRM,
        data: {
          title: t('website:page.deleteTitle', { title: page.title }),
          message: t('website:page.deleteMessage'),
          confirmText: t('website:page.delete'),
          onConfirm: async () => {
            if (await run(() => deletePage(page.pageId), t('website:page.deleted'))) onDeleted()
          },
        } satisfies ConfirmModalData,
      }),
    )

  return (
    <>
      <DataSection title={t('website:page.settingsTitle')}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
            <InputText isRequired name="title" initValue={values.title} label={t('website:page.title')} placeholder={t('website:page.titlePlh')} />
            <div>
              <InputText name="slug" initValue={values.slug} label={t('website:page.slug')} placeholder={t('website:page.slugPlh')} disabled={isSystem} />
              <Paragraph text={isSystem ? t('website:page.systemSlug') : t('website:page.slugHint')} size="sm" className="mt-1" />
            </div>
            <div className="flex justify-center">
              <MainButton text={t('website:save')} variant="contained" size="medium" htmlType="submit" disabled={methods.formState.isSubmitting} />
            </div>
          </form>
        </FormProvider>
      </DataSection>

      <DataSection title={t('website:page.menuTitle')}>
        <Paragraph
          text={
            isHome
              ? t('website:page.menuHome')
              : page.isInMenu
                ? t('website:page.inMenu')
                : isMenuFull
                  ? t('website:page.menuFull', { max: MAX_MENU_PAGES })
                  : t('website:page.inFooter')
          }
          size="sm"
        />
        {!isHome && (
          <div className="mt-4">
            <MainButton
              text={page.isInMenu ? t('website:page.menuRemove') : t('website:page.menuAdd')}
              variant={page.isInMenu ? 'alternative' : 'contained'}
              size="small"
              htmlType="button"
              isInactive={isMenuFull}
              onClick={handleMenu}
            />
          </div>
        )}
      </DataSection>

      <DataSection title={t('website:page.statusTitle')}>
        <Paragraph text={isSystem ? t('website:page.systemStatus') : isPublished ? t('website:page.publishedText') : t('website:page.draftText')} size="sm" />
        {!isSystem && (
          <div className="mt-4 flex flex-wrap gap-3">
            <MainButton
              text={isPublished ? t('website:page.unpublish') : t('website:page.publish')}
              variant={isPublished ? 'alternative' : 'contained'}
              size="small"
              htmlType="button"
              onClick={handleStatus}
            />
            <MainButton text={t('website:page.delete')} variant="outlined" size="small" htmlType="button" onClick={handleDelete} />
          </div>
        )}
      </DataSection>
    </>
  )
}

export default PageSettingsTab
