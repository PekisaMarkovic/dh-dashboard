import { FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import Paragraph from '@/src/components/core/typography/Paragraph'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { ICompany } from '@/src/interfaces'
import { useRefreshData } from '@/src/hooks/queries/use-refresh-data'
import { useCompanyService } from '@/src/services/use-company-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeModal, selectModal } from '@/src/state/shared/modal'
import { COMPANY_VALIDATION } from '@/src/validations/company/company'

type CompanyModalData = { company: ICompany } | null

const CompanyModal = () => {
  const { t } = useTranslation(['company', 'g'])
  const showError = useErrorToast()
  const { data } = useAppSelector(selectModal)
  const company = (data as CompanyModalData)?.company
  const { updateCompany } = useCompanyService()
  const dispatch = useAppDispatch()
  const { afterCompanyChange } = useRefreshData()
  const methods = useForm({
    resolver: COMPANY_VALIDATION,
    defaultValues: {
      name: company?.name || '',
      street: company?.street || '',
      city: company?.city || '',
      pib: company?.pib || '',
      registrationNumber: company?.registrationNumber || '',
      phone: company?.phone || '',
      invoiceName: company?.invoiceName || '',
      bankAccount: company?.bankAccount || '',
    },
  })

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (!company) return

    try {
      await updateCompany(company.companyId, {
        name: values.name.trim(),
        street: values.street.trim(),
        city: values.city.trim(),
        pib: values.pib.trim(),
        registrationNumber: values.registrationNumber.trim(),
        // an empty phone is saved as nothing
        phone: values.phone?.trim() || null,
        // an empty name is saved as nothing, the PDF then uses the name of the employee
        invoiceName: values.invoiceName?.trim() || null,
        bankAccount: values.bankAccount.trim(),
      })

      customToast.success(t('company:modal.saved'))
      afterCompanyChange()
      dispatch(removeModal())
    } catch (error) {
      showError(error)
    }
  }

  const handleClose = () => dispatch(removeModal())

  return (
    <FormProvider {...methods}>
      <div className="w-[640px] max-w-full">
        <Heading text={t('company:modal.title')} variant="2" size="base" color="black" />
        <Paragraph text={t('company:modal.subtitle')} size="sm" color="grey" className="mt-1" />

        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 mt-6">
          <InputText isRequired name="name" initValue={company?.name} label={t('company:modal.name')} placeholder={t('company:modal.namePlh')} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputText
              isRequired
              name="street"
              initValue={company?.street}
              label={t('company:modal.street')}
              placeholder={t('company:modal.streetPlh')}
            />
            <InputText isRequired name="city" initValue={company?.city} label={t('company:modal.city')} placeholder={t('company:modal.cityPlh')} />
            <InputText isRequired name="pib" initValue={company?.pib} label={t('company:modal.pib')} placeholder={t('company:modal.pibPlh')} />
            <InputText
              isRequired
              name="registrationNumber"
              initValue={company?.registrationNumber}
              label={t('company:modal.registrationNumber')}
              placeholder={t('company:modal.registrationNumberPlh')}
            />
            <InputText name="phone" initValue={company?.phone || ''} label={t('company:modal.phone')} placeholder={t('company:modal.phonePlh')} />
            <InputText
              name="invoiceName"
              initValue={company?.invoiceName || ''}
              label={t('company:modal.invoiceName')}
              placeholder={t('company:modal.invoiceNamePlh')}
            />
            <InputText
              isRequired
              name="bankAccount"
              initValue={company?.bankAccount}
              label={t('company:modal.bankAccount')}
              placeholder={t('company:modal.bankAccountPlh')}
            />
          </div>

          <div className="flex justify-end gap-x-4 pt-2">
            <MainButton text={t('g:button.cancel')} variant="alternative" size="medium" onClick={handleClose} />
            <MainButton text={t('g:button.submit')} variant="contained" size="medium" htmlType="submit" />
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default CompanyModal
