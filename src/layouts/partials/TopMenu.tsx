import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthApis from '@/src/api/auth'
import CustomDropdowns from '@/src/components/core/dropdowns/CustomDropdowns'
import customToast from '@/src/components/core/toast/CustomToast'
import Heading from '@/src/components/core/typography/Heading'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import { TOP_MENU_LINKS_FOR_TRANSLATIONS } from '@/src/constatns/navigation'
import { useApi } from '@/src/hooks/use-api'
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
}

const TopMenu = ({ backButton }: Props) => {
  const { t } = useTranslation(['g', 'info', 'static'])
  const api = useApi()
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
      await api.post(AuthApis.logout())
    } catch {
      customToast.error(t('g:errorMessage'))
    } finally {
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
    <div className="pl-8 pr-14 flex items-center justify-between py-3 border-b-1 border-b-lighy-grey border-solid absolute top-0 left-0 right-0 bg-white">
      <div>
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
        <div className="flex gap-x-6 items-center relative">
          <LanguageSelect />
          <div className="flex items-center cursor-pointer" onClick={handleToggle} ref={clickAwayRef}>
            <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
              <span className="font-medium text-gray-600 dark:text-gray-300">{extractFirstLetters(fullName)}</span>
            </div>
            <GeneralIcons type="ArrowDown" className={`ml-2 ${open ? 'rotate-180' : ''}`} />
            {open && <CustomDropdowns dropdownOptions={checkOptions()} position="top-full -right-1/4 z-10" />}
          </div>
        </div>
      )}
    </div>
  )
}

export default TopMenu
