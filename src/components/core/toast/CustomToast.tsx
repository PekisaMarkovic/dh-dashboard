import { toast } from 'react-toastify'
import ToastLinkWrapper from '@/src/components/core/toast/partials/ToastLinkWrapper'
import ToastIcon from '@/src/icons/toast'

type ToastOptions = {
  link?: string
}

toast.success = (message, options?: unknown) => {
  let link = ''
  const opts = options as ToastOptions

  if (opts?.link) {
    link = opts?.link
  }

  return toast(
    <ToastLinkWrapper link={link}>
      <div className="bg-green flex gap-x-2 items-center px-4 py-2 rounded-sm border-1 border-green border-solid">
        <ToastIcon type="Success" className="flex-shrink-0" />
        <p className="font-poppins text-white text-sm">{String(message)}</p>
      </div>
    </ToastLinkWrapper>,
    { progressClassName: 'bg-green', bodyClassName: 'bg-green', className: 'bg-green', closeButton: false, icon: undefined },
  )
}

toast.info = (message) => {
  return toast(
    <div className="bg-blue flex gap-x-2 items-center px-4 py-2 rounded-sm border-1 border-blue border-solid">
      <ToastIcon type="Question" className="flex-shrink-0" />
      <p className="font-poppins text-white text-sm">{String(message)}</p>
    </div>,
    {
      className: 'bg-blue',
      closeButton: false,
      icon: undefined,
    },
  )
}

toast.warning = (message) => {
  return toast(
    <div className="bg-orange flex gap-x-2 items-center px-4 py-2 rounded-sm border-1 border-orange border-solid">
      <ToastIcon type="Warrning" className="flex-shrink-0" />
      <p className="font-poppins text-white text-sm">{String(message)}</p>
    </div>,
    {
      className: 'bg-orange',
      closeButton: false,
      icon: undefined,
    },
  )
}

toast.error = (message, options) => {
  return toast(
    <div className="bg-red flex gap-x-2 items-center px-4 py-2 rounded-sm border-1 border-red border-solid">
      <ToastIcon type="Error" className="flex-shrink-0" />
      <p className="font-poppins text-white text-sm">{String(message)}</p>
    </div>,
    {
      ...options,
      className: 'bg-red',
      closeButton: false,
      icon: undefined,
    },
  )
}
const customToast = toast
export default customToast
