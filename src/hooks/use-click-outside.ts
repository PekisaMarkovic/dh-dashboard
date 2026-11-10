import { useEffect, useRef } from 'react'

interface useClickAwayProps {
  clickAwayCallback: () => void
}

export const useClickAway = <T extends HTMLElement>({ clickAwayCallback }: useClickAwayProps) => {
  const ref = useRef<T>(null)

  useEffect(() => {
    const onClickAway = ({ target }: MouseEvent) => {
      if (ref.current && !ref.current.contains(target as Node)) {
        clickAwayCallback()
      }
    }
    window.addEventListener('mousedown', onClickAway, true)
    return () => {
      window.removeEventListener('mousedown', onClickAway, true)
    }
  }, [clickAwayCallback])
  return ref
}
