import { useTranslation } from 'react-i18next'
import DataSection from '@/src/components/section/DataSection'
import InputText from '@/src/components/core/input/InputText'
import SingleSelect from '@/src/components/core/select/SingleSelect'
import { LANGUAGE_OPTIONS } from '@/src/utils/language'
import DateSelect from '@/src/components/core/select/DateSelect'

const UserInfo = () => {
  const { t } = useTranslation(['user'])
  return (
    <DataSection title={t('user:info.title')} subtitle={t('user:info.subtitle')}>
      <div className="grid grid-cols-3 gap-x-6 gap-y-4">
        <InputText
          disabled
          name="firstName"
          label={t('user:info.fields.firstName')}
          placeholder={t('user:info.fields.firstNamePlh')}
          typeHtml="text"
        />

        <InputText disabled name="lastName" label={t('user:info.fields.lastName')} placeholder={t('user:info.fields.lastNamePlh')} typeHtml="text" />

        <InputText disabled name="email" label={t('user:info.fields.email')} placeholder={t('user:info.fields.emailPlh')} typeHtml="text" />

        <InputText name="phoneNumber" label={t('user:info.fields.phone')} placeholder={t('user:info.fields.phonePlh')} typeHtml="text" />

        <DateSelect name="dateOfBirth" label={t('user:info.fields.dateOfBirth')} placeholder={t('user:info.fields.dateOfBirthPlh')} />

        <SingleSelect
          name="language"
          label={t('user:info.fields.language')}
          placeholder={t('user:info.fields.languagePlh')}
          options={LANGUAGE_OPTIONS}
        />
      </div>
    </DataSection>
  )
}

export default UserInfo
