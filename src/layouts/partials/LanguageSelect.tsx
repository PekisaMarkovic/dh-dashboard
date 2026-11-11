import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import { useClickAway } from '@/src/hooks/use-click-outside'
import GeneralIcons from '@/src/icons/general'
import FlagIcon from '@/src/icons/flags/FlagIcon'
import { useUserService } from '@/src/services/use-user-service'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectAuthUser, setUserProfileData } from '@/src/state/user/authSlice'
import { applyLanguage, isLanguage, Language, LANGUAGES } from '@/src/utils/language'

/**
 * A small dropdown of flags (English, Serbian) instead of the names of the languages.
 * A pick switches the language immediately and saves it as the preference of the logged in user.
 */
const LanguageSelect = () => {
  const { t, i18n } = useTranslation(['g'])
  const showError = useErrorToast()
  const { updateProfile } = useUserService()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(selectAuthUser)
  const [open, setOpen] = useState(false)

  const handleClose = useCallback(() => setOpen(false), [])
  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const current: Language = isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en'
  const currentLabel = LANGUAGES.find((l) => l.value === current)?.label

  const changeLanguage = async (next: Language) => {
    setOpen(false)

    if (next === current) return

    applyLanguage(next)

    if (!user) return

    dispatch(setUserProfileData({ user: { ...user, language: next } }))

    try {
      await updateProfile({ language: next })
    } catch (error) {
      showError(error)
    }
  }

  const handleToggle = () => setOpen((prev) => !prev)

  // one handler for every flag in the list
  const handleSelect = (language: Language) => () => changeLanguage(language)

  return (
    <div className="relative" ref={clickAwayRef}>
      <button
        type="button"
        aria-label={`${t('g:language')}: ${currentLabel}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={currentLabel}
        onClick={handleToggle}
        className={`flex items-center justify-between gap-x-2 h-9 px-2.5 bg-white rounded-xs-plus border-1 border-solid ${open ? 'border-green' : 'border-grey'}`}
      >
        <FlagIcon language={current} className="h-4 w-6 block rounded-[2px]" />
        <GeneralIcons type="ArrowSelect" className={open ? 'rotate-180' : ''} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1.5 z-10 w-full bg-white rounded-xs-plus border-1 border-light-grey-alt border-solid shadow-drop-down overflow-hidden"
        >
          {LANGUAGES.map(({ value, label }) => (
            <li key={value} role="option" aria-selected={value === current}>
              <button
                type="button"
                title={label}
                aria-label={label}
                onClick={handleSelect(value)}
                className={`flex w-full items-center justify-center py-2 hover:bg-light-grey-transparent ${value === current ? 'bg-light-grey-transparent' : ''}`}
              >
                <FlagIcon language={value} className="h-4 w-6 block rounded-[2px]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSelect
