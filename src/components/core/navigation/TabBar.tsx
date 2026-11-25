// hasWarning: a small dot on the tab (something on it is missing)
type Tab<T extends string> = { id: T; label: string; hasWarning?: boolean }

type Props<T extends string> = {
  tabs: Tab<T>[]
  active: T
  onChange: (id: T) => void
  // for screen readers
  label: string
}

/**
 * Tabs of one page (the page itself does not change, only what is shown under the tabs).
 * On a narrow screen the tabs scroll sideways.
 */
const TabBar = <T extends string>({ tabs, active, onChange, label }: Props<T>) => (
  <div role="tablist" aria-label={label} className="flex gap-x-1 overflow-x-auto border-b-1 border-b-light-grey-alt border-solid">
    {tabs.map((tab) => {
      const isActive = tab.id === active

      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`font-poppins text-sm whitespace-nowrap px-4 py-3 -mb-px border-b-2 border-solid ${
            isActive ? 'text-green border-b-green' : 'text-dark-grey border-b-transparent hover:text-black'
          }`}
        >
          {tab.label}
          {tab.hasWarning && <span aria-hidden="true" title="!" className="ml-2 inline-block h-2 w-2 rounded-full bg-orange align-middle" />}
        </button>
      )
    })}
  </div>
)

export default TabBar
