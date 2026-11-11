import { useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectModal } from '@/src/state/shared/modal'
import ModalConfiguration, { ModalVariant } from '@/src/components/modal/partials/ModalConfiguration'
import { ModalEnums } from '@/src/enum'
import WarehouseModal from '@/src/components/modal/warehouses/WarehouseModal'
import ConfirmModal from '@/src/components/modal/ConfirmModal'
import InviteModal from '@/src/components/modal/company/InviteModal'
import ProformaDetailModal from '@/src/components/modal/proformas/ProformaDetailModal'
import DrinkModal from '@/src/components/modal/drinks/DrinkModal'
import CustomerModal from '@/src/components/modal/customers/CustomerModal'
import CompanyModal from '@/src/components/modal/company/CompanyModal'

type Props = {
  variant?: ModalVariant
}

const MainModal = ({ variant }: Props) => {
  const { modal } = useAppSelector(selectModal)

  const modalContext = () => {
    switch (modal) {
      case ModalEnums.WAREHOUSE:
        return <WarehouseModal />

      case ModalEnums.DRINK:
        return <DrinkModal />

      case ModalEnums.COMPANY:
        return <CompanyModal />

      case ModalEnums.CUSTOMER:
        return <CustomerModal />

      case ModalEnums.PROFORMA_DETAIL:
        return <ProformaDetailModal />

      case ModalEnums.INVITE:
        return <InviteModal />

      case ModalEnums.CONFIRM:
        return <ConfirmModal />
    }
  }

  return <>{modal ? <ModalConfiguration variant={variant}>{modalContext()}</ModalConfiguration> : null}</>
}

export default MainModal
