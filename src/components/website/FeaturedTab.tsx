import { useEffect, useMemo, useState } from 'react'
import { FieldValues, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import MainButton from '@/src/components/core/buttons/MainButton'
import InputText from '@/src/components/core/input/InputText'
import Paragraph from '@/src/components/core/typography/Paragraph'
import DataSection from '@/src/components/section/DataSection'
import { useDrinksQuery } from '@/src/hooks/queries/use-drink-queries'
import { useDebouncedValue } from '@/src/hooks/use-debounced-value'
import { useSaveWebsite } from '@/src/hooks/use-save-website'
import { IDrink, IWebsite } from '@/src/interfaces'
import { FEATURED_VALIDATION } from '@/src/validations/website/website'

// the same as the api (MAX_FEATURED_DRINKS)
const MAX_PICKED = 10
const SEARCH_LIMIT = 8
const NO_DRINKS: IDrink[] = []

type Picked = { drinkId: number; name: string }

const LinkButton = ({ text, onClick, disabled }: { text: string; onClick: () => void; disabled?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="font-poppins text-sm text-green hover:underline disabled:cursor-not-allowed disabled:text-grey disabled:no-underline"
  >
    {text}
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
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())
  const results = useDrinksQuery({ page: 1, limit: SEARCH_LIMIT, search: debouncedSearch }, debouncedSearch.length > 0).data?.items ?? NO_DRINKS

  // the saved list came again from the api
  useEffect(() => setPicked(website.featuredDrinks), [website.featuredDrinks])
  useEffect(() => {
    if (picked.length) setHasPickedError(false)
  }, [picked])

  const isFull = picked.length >= MAX_PICKED
  const isPicked = (drinkId: number) => picked.some((p) => p.drinkId === drinkId)

  const move = (index: number, step: -1 | 1) =>
    setPicked((list) => {
      const next = [...list]
      const target = index + step

      if (target < 0 || target >= next.length) return list
      ;[next[index], next[target]] = [next[target], next[index]]

      return next
    })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!picked.length) {
      setHasPickedError(true)

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

          <div className="flex flex-col gap-y-2">
            <span className="font-poppins text-sm font-medium text-black">
              {t('website:featured.picked')}<span className="text-red"> *</span> ({picked.length}/{MAX_PICKED})
            </span>
            {picked.length ? (
              <ul className="flex flex-col divide-y-1 divide-light-grey-alt divide-solid rounded-sm border-1 border-light-grey-alt border-solid">
                {picked.map((drink, index) => (
                  <li key={drink.drinkId} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                    <span className="font-poppins text-sm text-black">{drink.name}</span>
                    <span className="flex items-center gap-x-4">
                      <LinkButton text={t('website:featured.up')} disabled={index === 0} onClick={() => move(index, -1)} />
                      <LinkButton text={t('website:featured.down')} disabled={index === picked.length - 1} onClick={() => move(index, 1)} />
                      <LinkButton text={t('website:featured.remove')} onClick={() => setPicked((list) => list.filter((p) => p.drinkId !== drink.drinkId))} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Paragraph text={t('website:featured.pickedEmpty')} color={hasPickedError ? 'red' : 'grey-secondary'} />
            )}
            {isFull && <Paragraph text={t('website:featured.pickedLimit', { max: MAX_PICKED })} />}
            {hasPickedError && <Paragraph text={t('website:featured.pickedRequired')} color="red" size="sm" />}
          </div>

          <div className="flex flex-col gap-y-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('website:featured.search')}
              aria-label={t('website:featured.search')}
              className="font-poppins h-12 w-full rounded-xs-plus border-1 border-solid border-grey bg-white px-4 text-sm text-black focus:border-green focus:outline-none"
            />
            {debouncedSearch && (
              <ul className="flex flex-col divide-y-1 divide-light-grey-alt divide-solid rounded-sm border-1 border-light-grey-alt border-solid">
                {results.length ? (
                  results.map((drink) => (
                    <li key={drink.drinkId} className="flex items-center justify-between gap-2 px-3 py-2">
                      <span className="font-poppins text-sm text-black">{drink.name}</span>
                      <LinkButton
                        text={t('website:featured.add')}
                        disabled={isFull || isPicked(drink.drinkId)}
                        onClick={() => setPicked((list) => [...list, { drinkId: drink.drinkId, name: drink.name }])}
                      />
                    </li>
                  ))
                ) : (
                  <li className="px-3 py-2">
                    <Paragraph text={t('website:featured.noResults')} />
                  </li>
                )}
              </ul>
            )}
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
