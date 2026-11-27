import TabButton from '@/src/components/core/navigation/partials/TabButton'

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
    {tabs.map((tab) => (
      <TabButton key={tab.id} label={tab.label} isActive={tab.id === active} hasWarning={tab.hasWarning} onClick={() => onChange(tab.id)} />
    ))}
  </div>
)

export default TabBar
