import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomDropdowns from '@/src/components/core/dropdowns/CustomDropdowns'
import { useErrorToast } from '@/src/hooks/use-error-toast'
import Heading from '@/src/components/core/typography/Heading'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { TOP_MENU_LINKS_FOR_TRANSLATIONS } from '@/src/constatns/navigation'
import { queryClient } from '@/src/state/query-client'
import { useAuthService } from '@/src/services/use-auth-service'
import GeneralIcons from '@/src/icons/general'
import { CustomDropdown } from '@/src/interfaces'
import { useAppDispatch, useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { removeUserData, selectAuthUser } from '@/src/state/user/authSlice'
import { extractFirstLetters } from '@/src/utils/string'
import { clearLocalStorageTokens } from '@/src/utils/token'
import LanguageSelect from '@/src/layouts/partials/LanguageSelect'
import { useClickAway } from '@/src/hooks/use-click-outside'

type Props = {
  backButton?: {
    onClick: () => void
  }
  // opens the menu on a tablet or a phone (the button is shown there)
  onMenuClick?: () => void
}

const TopMenu = ({ backButton, onMenuClick }: Props) => {
  const { t } = useTranslation(['g', 'info', 'static'])
  const showError = useErrorToast()
  const { logOut } = useAuthService()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useAppSelector(selectAuthUser)
  const splited = pathname.split('/')
  const page = TOP_MENU_LINKS_FOR_TRANSLATIONS.find((link) => link.replace('/', '') === splited[1])
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const dispatch = useAppDispatch()

  const handleToggle = () => setOpen(!open)
  const handleClose = () => setOpen(false)

  const clickAwayRef = useClickAway<HTMLDivElement>({ clickAwayCallback: handleClose })

  const handleLogout = useCallback(async () => {
    try {
      await logOut()
    } catch (error) {
      showError(error)
    } finally {
      queryClient.clear()
      dispatch(removeUserData())
      clearLocalStorageTokens()
      navigate(ROUTE_NAMES.index)
    }
  }, [])

  const checkOptions = () => {
    const options: CustomDropdown[] = [
      {
        content: {
          type: 'link',
          text: t('g:profile'),
          href: ROUTE_NAMES.profile,
        },
      },

      {
        content: {
          type: 'button',
          text: t('g:logout'),
          onClick: handleLogout,
        },
        textColor: 'red',
      },
    ]
    return options
  }

  return (
    <div className="pl-4 pr-4 md:pl-8 md:pr-14 gap-x-3 flex items-center justify-between py-3 border-b-1 border-b-lighy-grey border-solid absolute top-0 left-0 right-0 bg-white">
      <div className="flex items-center gap-x-3 min-w-0">
        <button
          type="button"
          aria-label={t('static:navigation.leftSide.title')}
          onClick={onMenuClick}
          className="lg:hidden shrink-0 flex items-center justify-center h-10 w-10 rounded-full border-1 border-solid border-light-grey-alt hover:bg-light-grey-transparent"
        >
          <GeneralIcons type="Menu" />
        </button>

        {page && (
          <Heading
            leftIcon={
              backButton && (
                <p onClick={backButton.onClick} className="rounded-full border-1 border-lighy-grey border-solid p-3 cursor-pointer">
                  <GeneralIcons type="ArrowBack" />
                </p>
              )
            }
            variant="1"
            text={t(`static:navigation.leftSidePage.${page.replace('/', '')}`)}
          />
        )}
      </div>

      {user && (
        <div className="flex gap-x-3 md:gap-x-6 items-center relative shrink-0">
          <LanguageSelect />
          <div className="flex items-center cursor-pointer" onClick={handleToggle} ref={clickAwayRef}>
            <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">{extractFirstLetters(fullName)}</span>
            </div>
            <GeneralIcons type="ArrowDown" className={`ml-2 ${open ? 'rotate-180' : ''}`} />
            {open && <CustomDropdowns dropdownOptions={checkOptions()} position="top-full right-0 z-10" />}
          </div>
        </div>
      )}
    </div>
  )
}

export default TopMenu
