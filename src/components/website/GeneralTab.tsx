import { useMemo } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import InputTextarea from '@/src/components/core/input/InputTextarea'
import customToast from '@/src/components/core/toast/CustomToast'
import DataSection from '@/src/components/section/DataSection'
import WebsiteImageField from '@/src/components/website/WebsiteImageField'
import { useSaveWebsite } from '@/src/hooks/use-save-website'
import { IWebsite } from '@/src/interfaces'
import { GENERAL_VALIDATION } from '@/src/validations/website/website'

type Props = { website: IWebsite }

// the general info: name, city, address, phone, Instagram, opening hours and the logo, and the key of the site
const GeneralTab = ({ website }: Props) => {
  const { t } = useTranslation(['website', 'g'])
  const save = useSaveWebsite()
  const values = useMemo(
    () => ({
      name: website.name,
      city: website.city ?? '',
      address: website.address ?? '',
      phone: website.phone ?? '',
      instagram: website.instagram ?? '',
      workingHours: website.workingHours ?? '',
    }),
    [website],
  )
  const methods = useForm<FieldValues>({ resolver: GENERAL_VALIDATION as unknown as Resolver<FieldValues>, values })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    await save({
      name: data.name,
      city: data.city,
      address: data.address,
      phone: data.phone,
      instagram: data.instagram,
      workingHours: data.workingHours,
    })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(website.clientId)
    customToast.success(t('website:copied'))
  }

  return (
    <>
      <DataSection title={t('website:general.title')} subtitle={t('website:general.subtitle')}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 gap-y-6 md:grid-cols-2">
            <InputText isRequired name="name" initValue={values.name} label={t('website:general.name')} placeholder={t('website:general.namePlh')} />
            <InputText isRequired name="city" initValue={values.city} label={t('website:general.city')} placeholder={t('website:general.cityPlh')} />
            <InputText isRequired name="address" initValue={values.address} label={t('website:general.address')} placeholder={t('website:general.addressPlh')} />
            <InputText isRequired name="phone" initValue={values.phone} label={t('website:general.phone')} placeholder={t('website:general.phonePlh')} />
            <InputText isRequired name="instagram" initValue={values.instagram} label={t('website:general.instagram')} placeholder={t('website:general.instagramPlh')} />
            <div className="md:col-span-2">
              <InputTextarea
                isRequired
                name="workingHours"
                rows={7}
                initValue={values.workingHours}
                label={t('website:general.workingHours')}
                placeholder={t('website:general.workingHoursPlh')}
              />
            </div>
            <div className="md:col-span-2 flex justify-center">
              <MainButton text={t('website:save')} variant="contained" size="medium" htmlType="submit" disabled={methods.formState.isSubmitting} />
            </div>
          </form>
        </FormProvider>
      </DataSection>

      <DataSection title={t('website:image.logo')}>
        <WebsiteImageField
          slot="logo"
          image={website.logoImage}
          label={t('website:image.logo')}
          hint={t('website:image.hintLogo', { maxMb: 5 })}
          previewClass="h-20 w-48"
        />
      </DataSection>

      <DataSection title={t('website:keyLabel')} subtitle={t('website:keyHint')}>
        <div className="flex flex-wrap items-center gap-3">
          <code className="break-all rounded-sm bg-grey-100 px-3 py-2 font-mono text-sm text-black">{website.clientId}</code>
          <MainButton text={t('website:copy')} variant="outlined" size="small" htmlType="button" onClick={() => void handleCopy()} />
        </div>
      </DataSection>
    </>
  )
}

export default GeneralTab
