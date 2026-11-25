# DH Dashboard

The web app of **DH**: companies keep track of the drinks in their warehouses, make proformas (price quotes) from them, add bought goods to the stock from a photo or a PDF of the document, and manage their public website.

Built with React, TypeScript, Vite, Tailwind and TanStack Query. It talks to the `dh-api` repo.

- App: `http://localhost:4300`
- Languages: English and Serbian
- Made for a phone as much as for a computer: every list is a table on a wide screen and cards on a phone, every window fits a small screen.

## Quick start

You need Node 20+, pnpm and a running `dh-api` (it listens on `http://localhost:4200`).

```bash
cp .env.example .env     # check VITE_API_URL
pnpm install
pnpm dev
```

Log in with the super admin from the `.env` of the API.

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on port 4300. |
| `pnpm build` | Type check and production build into `dist/`. |
| `pnpm preview` | Serve the build locally. |
| `pnpm lint` | ESLint. |

**Environment.** There is one variable, `VITE_API_URL`: the address of the API, it has to end with a slash (`http://localhost:4200/api/`). Vite puts it into the build, so set it **when building** for production.

## Pages

| Page | Address | Who |
| --- | --- | --- |
| Log in | `/` | everyone |
| Finish registration | `/first-time-register/:invitationId` | the person that got the invitation |
| Proforma | `/proformas` | all users |
| Create proforma | `/proformas/create` | all users |
| Edit proforma | `/proformas/:proformaId/edit` | admins only |
| Drinks | `/drinks` | all users (only admins can change) |
| Import goods | `/purchase-import` | admins only |
| Customers | `/customers` | all users (only admins can change) |
| Warehouses | `/warehouses` | all users (only admins can change) |
| Company | `/company` | admins only |
| Website | `/website` | admins of a company that has a website (shown in the menu under Company only then) |
| Profile | `/profile` | all users |

Where you land after login: **Proforma**. A user without the right role is sent to the "not found" page, and admin pages are not even in their menu.

### What each page does

- **Proforma.** A table of the proformas of the company with a status (Active or Returned to stock). A click on a row opens its lines. The three dots on a row: **Download** (PDF), and for admins **Edit** (while it is active) and **Return to stock**. (The API can also search proformas by number, buyer or warehouse, the page has no search box yet.)
- **Create proforma** (also used to edit). Step one: pick a warehouse (the default one is already selected) and the drinks, search them and set the quantity, and if needed a price and a discount for this proforma only. Step two: check the lines, pick a buyer (optional) and create. Creating takes the drinks off the stock, the PDF opens in a new tab together with the print window. If there is no warehouse or no drinks yet, the page says so and offers to create them.
- **Drinks.** All drinks of the company, with search and filters (warehouse, and stock: warning or critical). A drink that is low is coloured orange (warning) or red (has to be bought again). Every drink shows its **picture** (a bottle icon while it has none) in front of the name, in all the lists that show drinks. Admins add, edit and delete, the window has the picture field with the recommended size (1200 × 1200) and uploads it together with the drink.
- **Import goods.** Admins pick the warehouse and upload a photo or a PDF of a purchase document (on a phone the button also offers the camera, on a computer a file can be dropped on the box). The AI reads the drinks and quantities, they open in a window: every line already has the matching drink, the admin can change the drink or the quantity, skip a line, and then **Add to stock**. Below is the **history** of the uploads (search, pages): a click opens a document again, to add the lines that were left out, the three dots have **Delete**. The document itself is not kept anywhere.
- **Customers.** The buyers, with search. Admins add, edit and delete.
- **Warehouses.** A card for each warehouse with its drinks and the total value of the stock. The default warehouse is marked and preselected on the other pages. A warehouse can only be deleted when it is empty.
- **Company.** Company info, the users (with their role), the **Add employee** button that sends an invitation, and the table of invitations (Pending, Accepted, Expired). The three dots on a Pending or Expired invitation have **Resend invitation**: the email goes out again and the link is valid for 7 more days.
- **Website** (the page of a white label company, it manages its public site from the `dh-client` repo). A status panel on top (draft or published, what is still missing in red, the **Publish site** button that is inactive until everything is filled in) and tabs, every tab is one part of the site:
  - **General info**: name, city, address, phone, Instagram, opening hours (one day per line), the logo, and the key of the site (the `ACCESS_KEY`, with a copy button).
  - **Hero**, **Featured** (the title and the button and the recommended drinks, picked and ordered by the admin, at most 10), **Story**, **Promo**: the texts of the section and its picture (hero: the background).
  - **SEO**: the title and the description of the site and of the menu page (what Google shows, with a counter) and the picture shown when the site is shared. The tab icon of the site is the logo.
  - **Messages**: who contacted the company through the contact form of the site, newest first.
  Every field is required (an error under the input when it is empty), a tab with something missing has a dot. A picture is saved the moment it is picked (the API makes a WebP of it), the preview shows the whole picture with its size and a click opens it in full size. The site shows a change at once (the API tells it to drop its cache).
- **Profile.** Name and email are read only. Phone, date of birth and **language** can be changed. Log out is in the top menu.

## How it works

### Login

- The tokens are kept in `localStorage` (`access_token`, `refresh_token`).
- Every request goes through the axios instance from `hooks/use-api.ts`. It adds the token, and when the token has expired it asks the API for a new one first. If that fails, the user is logged out. The API sends `application/json` by default, a file upload has to set `multipart/form-data` itself (see `use-purchase-import-service.ts`), otherwise axios turns the form into json and the file is lost.
- `routes/ProtectedRoute.tsx` checks the role for a page, `hooks/use-roles.ts` gives `isAdmin` for buttons.

### Data from the API (TanStack Query)

Every list and every detail is a query, so a page that was visited shows its data at once and loads it again in the background when it is old.

- `services/use-*-service.ts`: the calls to the API (one hook per area).
- `hooks/queries/use-*-queries.ts`: the queries on top of them. The keys are in `constatns/query-keys.ts` and **how long the data is fresh** in `constatns/stale-times.ts` (the stock only 30 seconds, because every proforma changes it).
- `hooks/queries/use-refresh-data.ts` says **what depends on what**. After you change something call the right function (`afterDrinkChange()`, `afterWarehouseChange()`, `afterProformaChange()`, `afterPurchaseImport()` ...) and every list that shows it loads again. Do not reload data by hand.
- A thin green bar at the top shows that something is loading (`GlobalLoader`), a failed request shows its message from the API as a toast (`useErrorToast`), tables show a skeleton while they load.

### Lists with pages and search

The API cuts the lists into pages. A list is made of three things: `usePageState([search])` (the page, it goes back to 1 when the search changes), `useDebouncedValue` for the search box, and `<ListPagination page totalPages onPageChange />` under the list. The page before stays visible while the next one loads. A list is a table on a wide screen and cards on a phone: `DefaultTableRowContainer` and `TableCell` do that, give every cell a `label` so a card knows what the value is. The pagination shows only the first, the current and the last page on a narrow phone.

### Windows (modals)

All windows go through one place, the `modal` slice in `state/shared/modal.ts`:

```ts
dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId } })) // open, with data
dispatch(removeModal())                                                // close
```

`components/modal/index.tsx` maps each `ModalEnums` value to its component. To add a window: add the enum value, build the component in `components/modal/...`, add it to that file. Give the inside a width like `w-[480px] max-w-full` so it fits a phone, and let the window scroll, not a list inside it (an open select would be cut off).

`ConfirmModal` is the "are you sure" window (for deleting), it can also be an info message. Do not use `window.confirm`.

### Languages

- Texts are in `translations/en/*.json` and `translations/sr/*.json`, one file per area (`general`, `log-in`, `static`, `errors`, `drinks`, `customers`, `proforma`, `purchase`, ...). They are registered in `translations/config.ts`. Use `t('namespace:key')`.
- Every key has to exist in **both** languages.
- The title of a page in the top menu is `static:navigation.leftSidePage.<route without the slash>`, a new page needs its key there.
- Each user keeps their own language. It is saved on the API (`users.language`, default `en`), applied when they log in, and remembered in the browser. It can be changed in the top menu or on the profile.
- Roles are translated through `utils/roles.ts` (a user who is a super admin is shown as the strongest role only).

### Dates

All dates are shown as **`10-11-2026`** (day-month-year). The format is one constant, `DATE_FORMAT` in `utils/date.ts`, and everything goes through `formatDate()` (Day.js). Do not format dates by hand. A typed date has to match the format. The API gets `YYYY-MM-DD`.

### Forms and fields

- Use the shared fields from `components/core`: `InputText`, `SingleSelect`, `DateSelect`, `QuantityInput`, `Checkbox`, `MainButton`. Do not use plain browser `<select>` or `<input>` (the exceptions are a file input and a number field inside a table row).
- `SingleSelect` works with `{ id, name, value }` options. Clicking the selected option again clears it. `SingleSelectFormless` is the same without react-hook-form, for a select in the middle of a table row.
- Forms use react-hook-form with yup rules in `validations/`. A rule's message is a key of `translations/*/errors.json`.
- **Photos from a phone** are 5 to 10 MB. `utils/image.ts` shrinks an image to 2200 px (jpeg) before it is sent, so it is quick and under the 10 MB limit of the API.

## Project structure

```
src/
  api/          addresses of the API endpoints
  components/
    core/       buttons, inputs, selects, pagination, typography, toast
    modal/      all windows
    section/    DataSection (a card with a title), GlobalLoader
    skeleton/   loading placeholders
    table/      table row / card with the three dots menu
    drinks/ customers/ proformas/ warehouses/ company/ purchase-import/ website/   parts of a page (drinks/DrinkImage is the picture of a drink)
  constatns/    routes, query keys, stale times, navigation (misspelled on purpose, see below)
  hooks/        use-api, use-roles, use-page-state, queries/ ...
  layouts/      page frame: left menu, top menu, language select
  modules/      the content of a page (company, drinks, proformas, purchase-import, website, ...)
  pages/        one thin file per page
  routes/       routes and ProtectedRoute
  services/     the calls to the API
  state/        Redux (auth, modal, behaviours) and the query client
  translations/ en and sr texts
  utils/        date, money, image, language, roles, token, stock ...
  validations/  yup rules
```

A page (`pages/`) is only the frame, the real work is in `modules/`.

## Good to know

- **Tailwind and dynamic classes.** A class built from a variable, like `` `grid-cols-${n}` ``, is only generated if the same class is written out somewhere else. Write classes out in full (or use `grid-cols-[...]`).
- **Svg files are URLs.** `import Icon from '...svg'` gives a path, not a component, and React then fails with `'/public/...svg' is not a valid name` (a white page). Use the icons from `src/icons`.
- **Scrollbars** are green everywhere (`styles/general/scrollbar.scss`).
- **Folder names** `constatns` and `paggination` are misspelled (they come from the old template). They are kept so imports keep working.
- **Error messages say what happened.** `utils/api-error.ts` shows the message the API sent. When there is none it says there is no connection, the request timed out or the status of the answer, not a general text. In `local` the API also sends the real cause of an unexpected error.
- **A section of the website** is built from `components/website/SectionTab.tsx` (a form of texts: fields, placeholders, validation) and `WebsiteImageField.tsx` (the picture of a slot). To add a section: a tab component, its yup rules in `validations/website/website.ts`, the texts in `translations/*/website.json` (`tabs`, `placeholders`, `missing`) and the field names in `errors.json`.
- **`public/`** still has some images from an older project that are probably not used.
- **Deploy.** `vercel.json` sends every address to `index.html`, which a single page app needs. Set `VITE_API_URL` before the build.
- **There are no tests here yet**, the API has them (`pnpm test` in `dh-api`). `pnpm build` and `pnpm lint` are the checks.
