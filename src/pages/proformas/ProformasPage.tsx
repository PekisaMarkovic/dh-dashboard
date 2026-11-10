import GeneralLayout from '@/src/layouts/GeneralLayout'
import SavedProformas from '@/src/modules/proformas/SavedProformas'

const ProformasPage = () => (
  <GeneralLayout isBottomHidden>
    <div className="pb-8">
      <SavedProformas />
    </div>
  </GeneralLayout>
)

export default ProformasPage
