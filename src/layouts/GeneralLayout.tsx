import { PropsWithChildren } from 'react'
import { FieldValues, SubmitHandler, useFormContext } from 'react-hook-form'
import { useAppSelector } from '@/src/state/redux-hooks/reduxHooks'
import { selectBehaviours } from '@/src/state/shared/behaviours'
import BottomMenu from '@/src/layouts/partials/BottomMenu'
import LeftMenu from '@/src/layouts/partials/LeftMenu'
import TopMenu from '@/src/layouts/partials/TopMenu'

type GeneralLayoutProps = {
  type?: 'GENERAL' | 'GENERAL_FORM'
  submit?: SubmitHandler<FieldValues>
  isBottomHidden?: boolean
  cancelButton?: {
    onClick: () => void
  }
  backButton?: {
    onClick: () => void
  }
}

const GeneralLayoutContent = ({ backButton, children, cancelButton, isBottomHidden }: PropsWithChildren<GeneralLayoutProps>) => {
  const { isScrollDisabled } = useAppSelector(selectBehaviours)

  return (
    <>
      <div className="w-1/5 h-full flex">
        <LeftMenu />
      </div>
      <div className={`relative w-full general-layout-content ${isBottomHidden ? 'general-layout-content--buttom-0' : ''} bg-light-grey-transparent`}>
        <TopMenu backButton={backButton} />
        <div className={`${isScrollDisabled ? 'overflow-hidden' : 'overflow-y-scroll'} h-full pt-5 px-8`}>{children}</div>
        {!isBottomHidden && <BottomMenu cancelButton={cancelButton} />}
      </div>
    </>
  )
}

const GeneralLayoutDiv = (props: PropsWithChildren<GeneralLayoutProps>) => {
  return (
    <div className="relative flex flex-row h-full w-full">
      <GeneralLayoutContent {...props} />
    </div>
  )
}

const GeneralLayoutForm = (props: PropsWithChildren<GeneralLayoutProps>) => {
  const { submit } = props
  const { handleSubmit } = useFormContext()

  return (
    <form className="relative flex flex-row h-full w-full" onSubmit={submit ? handleSubmit(submit) : undefined}>
      <GeneralLayoutContent {...props} />
    </form>
  )
}

const GeneralLayout = ({ type = 'GENERAL', ...rest }: PropsWithChildren<GeneralLayoutProps>) => {
  switch (type) {
    case 'GENERAL_FORM':
      return <GeneralLayoutForm {...rest} />

    default:
      return <GeneralLayoutDiv {...rest} />
  }
}

export default GeneralLayout
