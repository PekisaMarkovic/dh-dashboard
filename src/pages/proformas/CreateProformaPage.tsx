import { useNavigate } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/a-routes'
import GeneralLayout from '@/src/layouts/GeneralLayout'
import CreateProforma from '@/src/modules/proformas/CreateProforma'

const CreateProformaPage = () => {
  const navigate = useNavigate()

  return (
    <GeneralLayout isBottomHidden backButton={{ onClick: () => navigate(ROUTE_NAMES.proformas) }}>
      {/* the page is as high as the screen: the top and the bottom stay, only the middle of the card scrolls */}
      <div className="h-full pb-6">
        <CreateProforma />
      </div>
    </GeneralLayout>
  )
}

export default CreateProformaPage
