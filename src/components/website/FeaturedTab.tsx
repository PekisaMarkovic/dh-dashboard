import { KeyboardEvent, ReactNode, useEffect, useId, useMemo, useRef, useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DrinkImage from '@/src/components/drinks/DrinkImage'
import DataSection from '@/src/components/section/DataSection'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { useSaveWebsite } from '@/src/hooks/use-save-website'
import { IDrink, IWebsite } from '@/src/interfaces'
import { FEATURED_VALIDATION } from '@/src/validations/website/website'

// the same as the api (MAX_FEATURED_DRINKS)
const MAX_PICKED = 10
// the drinks the list shows: the first ones of the menu before typing, the best matches after
const LIST_LIMIT = 10
const NO_DRINKS: IDrink[] = []

type Picked = IWebsite['featuredDrinks'][number]

const IconButton = ({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className={`flex h-8 w-8 items-center justify-center rounded-md border-1 border-solid border-light-grey-alt bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      danger ? 'text-red hover:border-red hover:bg-red/5' : 'text-grey-secondary hover:border-green hover:text-green'
    }`}
  >
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  </button>
)

// "Preporučeno iz naše ponude": the title and the button of the section and the drinks it shows, in the order the admin picks
const FeaturedTab = ({ website }: { website: IWebsite }) => {
  const { t } = useTranslation(['website'])
  const save = useSaveWebsite()
  const featured = website.sections.featured
  const values = useMemo(() => ({ title: featured?.title ?? '', buttonText: featured?.buttonText ?? '' }), [featured])
  const methods = useForm<FieldValues>({ resolver: FEATURED_VALIDATION as unknown as Resolver<FieldValues>, values })
  const [picked, setPicked] = useState<Picked[]>(website.featuredDrinks)
  // true after a try to save without a picked drink (at least one is required)
  const [hasPickedError, setHasPickedError] = useState(false)
  // true after a try to save an odd number of drinks (the site shows them in pairs)
  const [hasOddError, setHasOddError] = useState(false)

  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  // the option the arrow keys are on
  const [active, setActive] = useState(0)
  const boxRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const debouncedSearch = useDebouncedValue(search.trim())
  // asked only while the list is open; an empty search gives the first drinks of the menu
  const drinksQuery = useDrinksQuery({ page: 1, limit: LIST_LIMIT, search: debouncedSearch }, isOpen)
  const options = drinksQuery.data?.items ?? NO_DRINKS

  // the saved list came again from the api
  useEffect(() => setPicked(website.featuredDrinks), [website.featuredDrinks])
  useEffect(() => {
    if (picked.length) setHasPickedError(false)
    if (picked.length % 2 === 0) setHasOddError(false)
  }, [picked])
  useEffect(() => setActive(0), [debouncedSearch])

  // a click outside the search and its list closes the list
  useEffect(() => {
    if (!isOpen) return

    const close = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('mousedown', close)

    return () => document.removeEventListener('mousedown', close)
  }, [isOpen])

  const isFull = picked.length >= MAX_PICKED
  const isOdd = picked.length % 2 === 1
  const isPicked = (drinkId: number) => picked.some((p) => p.drinkId === drinkId)

  const remove = (drinkId: number) => setPicked((list) => list.filter((p) => p.drinkId !== drinkId))

  // a click on a drink in the list adds it, a click on an added one removes it
  const toggle = (drink: IDrink) => {
    if (isPicked(drink.drinkId)) return remove(drink.drinkId)
    if (isFull) return

    setPicked((list) => [...list, { drinkId: drink.drinkId, name: drink.name, imageUrl: drink.image?.url ?? null }])
  }

  const move = (index: number, step: -1 | 1) =>
    setPicked((list) => {
      const next = [...list]
      const target = index + step

      if (target < 0 || target >= next.length) return list
      ;[next[index], next[target]] = [next[target], next[index]]

      return next
    })

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') return setIsOpen(false)
    if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key)) return

    // Enter must not submit the form
    event.preventDefault()

    if (!isOpen) return setIsOpen(true)
    if (!options.length) return

    if (event.key === 'ArrowDown') setActive((i) => (i + 1) % options.length)
    else if (event.key === 'ArrowUp') setActive((i) => (i - 1 + options.length) % options.length)
    else toggle(options[Math.min(active, options.length - 1)])
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!picked.length) {
      setHasPickedError(true)

      return
    }

    if (isOdd) {
      setHasOddError(true)

      return
    }

    await save({ featured: { title: data.title ?? '', buttonText: data.buttonText ?? '', drinkIds: picked.map((p) => p.drinkId) } })
  }

  return (
    <DataSection title={t('website:featured.title')} subtitle={t('website:featured.subtitle')}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
          <InputText isRequired name="title" initValue={values.title} label={t('website:fields.title')} placeholder={t('website:placeholders.featured.title')} />
          <InputText
            isRequired
            name="buttonText"
            initValue={values.buttonText}
            label={t('website:fields.buttonText')}
            placeholder={t('website:placeholders.featured.buttonText')}
          />

          <div className="flex flex-col gap-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-poppins text-sm font-medium text-black">
                {t('website:featured.picked')}
                <span className="text-red"> *</span>
              </span>
              <span className={`font-poppins rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  isOdd ? 'bg-red-transparent text-red' : isFull ? 'bg-green text-white' : 'bg-green-transparent text-green'
                }`}>
                {picked.length}/{MAX_PICKED}
              </span>
            </div>

            {/* the drink picker: opens on focus with the first drinks, typing searches */}
            <div ref={boxRef} className="relative">
              <div className="relative">
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grey" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  type="search"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-label={t('website:featured.search')}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setIsOpen(true)
                  }}
                  onFocus={() => setIsOpen(true)}
                  onClick={() => setIsOpen(true)}
                  onKeyDown={onSearchKeyDown}
                  placeholder={t('website:featured.search')}
                  className="font-poppins h-12 w-full rounded-xs-plus border-1 border-solid border-grey bg-white pl-11 pr-10 text-sm text-black focus:border-green focus:outline-none"
                />
                <svg
                  viewBox="0 0 24 24"
                  className={`pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-grey transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>

              {isOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-sm border-1 border-solid border-light-grey-alt bg-white shadow-lg">
                  {!debouncedSearch && options.length > 0 && (
                    <p className="font-poppins border-b-1 border-solid border-light-grey-alt bg-light-grey-transparent px-3 py-2 text-xs text-dark-grey">
                      {t('website:featured.firstDrinks')}
                    </p>
                  )}
                  <ul id={listId} role="listbox" aria-multiselectable="true" className="max-h-80 overflow-y-auto">
                    {drinksQuery.isLoading ? (
                      <li className="font-poppins px-3 py-3 text-sm text-dark-grey">{t('website:featured.loading')}</li>
                    ) : options.length ? (
                      options.map((drink, index) => {
                        const added = isPicked(drink.drinkId)
                        const disabled = !added && isFull

                        return (
                          <li
                            key={drink.drinkId}
                            role="option"
                            aria-selected={added}
                            aria-disabled={disabled}
                            // keeps the focus in the search so the list stays open
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => !disabled && toggle(drink)}
                            onMouseEnter={() => setActive(index)}
                            className={`flex items-center gap-3 px-3 py-2 transition-colors ${
                              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            } ${index === active && !disabled ? 'bg-green-transparent' : ''}`}
                          >
                            <DrinkImage src={drink.image?.url} alt={drink.name} />
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="font-poppins truncate text-sm font-medium text-black">{drink.name}</span>
                              <span className="font-poppins truncate text-xs text-dark-grey">{drink.code}</span>
                            </span>
                            {added ? (
                              <span className="font-poppins flex items-center gap-1 text-xs font-medium text-green">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                  <path d="m5 12 5 5 9-10" />
                                </svg>
                                {t('website:featured.added')}
                              </span>
                            ) : (
                              !disabled && <span className="font-poppins text-xs font-medium text-green">+ {t('website:featured.add')}</span>
                            )}
                          </li>
                        )
                      })
                    ) : (
                      <li className="font-poppins px-3 py-3 text-sm text-dark-grey">{t('website:featured.noResults')}</li>
                    )}
                  </ul>
                  {isFull && (
                    <p className="font-poppins border-t-1 border-solid border-light-grey-alt bg-light-grey-transparent px-3 py-2 text-xs text-dark-grey">
                      {t('website:featured.pickedLimit', { max: MAX_PICKED })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* the picked drinks, in the order the site shows them */}
            {picked.length ? (
              <ol className="flex flex-col gap-2">
                {picked.map((drink, index) => (
                  <li
                    key={drink.drinkId}
                    className="flex items-center gap-3 rounded-lg border-1 border-solid border-light-grey-alt bg-white p-2 pr-3 transition-shadow hover:shadow-md"
                  >
                    <span className="font-poppins flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-transparent text-xs font-semibold text-green">
                      {index + 1}
                    </span>
                    <DrinkImage src={drink.imageUrl} alt={drink.name} size="md" />
                    <span className="font-poppins min-w-0 flex-1 truncate text-sm font-medium text-black">{drink.name}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <IconButton label={t('website:featured.up')} disabled={index === 0} onClick={() => move(index, -1)}>
                        <path d="m18 15-6-6-6 6" />
                      </IconButton>
                      <IconButton label={t('website:featured.down')} disabled={index === picked.length - 1} onClick={() => move(index, 1)}>
                        <path d="m6 9 6 6 6-6" />
                      </IconButton>
                      <IconButton danger label={t('website:featured.remove')} onClick={() => remove(drink.drinkId)}>
                        <path d="M18 6 6 18M6 6l12 12" />
                      </IconButton>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className={`rounded-lg border-1 border-dashed px-4 py-6 text-center ${hasPickedError ? 'border-red' : 'border-light-grey-alt'}`}>
                <Paragraph className="text-center" text={t('website:featured.pickedEmpty')} color={hasPickedError ? 'red' : 'grey-secondary'} />
              </div>
            )}
            {hasPickedError && <Paragraph text={t('website:featured.pickedRequired')} color="red" size="sm" />}
            {isOdd && <Paragraph text={t('website:featured.pickedOdd')} color={hasOddError ? 'red' : 'grey-secondary'} size="sm" />}
          </div>

          <div className="flex justify-center">
            <MainButton text={t('website:save')} variant="contained" size="medium" htmlType="submit" disabled={methods.formState.isSubmitting} />
          </div>
        </form>
      </FormProvider>
    </DataSection>
  )
}

export default FeaturedTab
