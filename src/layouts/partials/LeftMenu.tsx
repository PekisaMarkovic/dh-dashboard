import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import NavigationLink from '@/src/components/core/navigation/NavigationLink'
import Heading from '@/src/components/core/typography/Heading'
import { LEFT_SIDE_MENU_LINKS } from '@/src/constatns/navigation'
import { checkIsLinkActiv } from '@/src/utils/route'
import NavigationIcons from '@/src/icons/navigation'
import Logo from '@/src/icons/Logo'
import { useRoles } from '@/src/hooks/use-roles'

const LeftMenu = () => {
  const { t } = useTranslation(['static'])
  const { pathname } = useLocation()
  const { isAdmin } = useRoles()

  return (
    <div className="py-8 px-5 flex flex-col gap-y-8 border-r-1 border-r-lighy-grey border-solid h-full w-full">
      <div className="px-0.5 flex items-baseline">
        <Logo type="DARK" />
      </div>
      <div className="px-0.5 flex flex-col gap-y-6">
        <Heading text={t('static:navigation.leftSide.title')} variant="2" size="base" color="grey" />
        <div className="flex flex-col gap-y-4">
          {LEFT_SIDE_MENU_LINKS.filter((link) => isAdmin || !link.adminOnly).map(({ text, icon, link }, index) => (
            <NavigationLink
              isActiv={checkIsLinkActiv(pathname, link)}
              href={link}
              text={t(`static:navigation.leftSide.${text}`)}
              variant="side"
              leftIcon={<NavigationIcons type={icon} />}
              key={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftMenu
