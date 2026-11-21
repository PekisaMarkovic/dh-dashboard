import { useNavigate, useParams } from 'react-router-dom'
import { ROUTE_NAMES } from '@/src/constatns/routes'
import GeneralLayout from '@/src/layouts/GeneralLayout'
import CreateProforma from '@/src/modules/proformas/CreateProforma'

const EditProformaPage = () => {
  const navigate = useNavigate()
  const { proformaId } = useParams()

  const handleBack = () => navigate(ROUTE_NAMES.proformas)

  return (
    <GeneralLayout isBottomHidden backButton={{ onClick: handleBack }}>
      <div className="h-full pb-6">
        <CreateProforma proformaId={Number(proformaId)} />
      </div>
    </GeneralLayout>
  )
}

export default EditProformaPage
