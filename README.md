# DH Dashboard

This is the admin app of **DH**. Drink shops use it to keep track of the drinks in their warehouses, write proformas (price quotes), add bought goods to the stock straight from a photo or PDF of the invoice, manage their public website and handle the orders that come in through it.

It's built with React, TypeScript, Vite, Tailwind and TanStack Query, and it talks to the API in the `dh-api` repo.

- Runs at `http://localhost:4300`
- Available in English and Serbian
- Works as well on a phone as on a computer. Lists are tables on a wide screen and cards on a phone, and every window fits a small screen.

## Getting started

You'll need Node 20 or newer, pnpm and the API running locally (`dh-api`, on `http://localhost:4200`).

```bash
cp .env.example .env     # check VITE_API_URL
pnpm install
pnpm dev
```

Log in with the super admin from the API's `.env`.

| Command        | What it does                                     |
| -------------- | ------------------------------------------------ |
| `pnpm dev`     | Starts the dev server on port 4300.              |
| `pnpm build`   | Type checks and builds for production (`dist/`). |
| `pnpm preview` | Serves the production build locally.             |
| `pnpm lint`    | ESLint.                                          |

**Environment.** There's a single variable, `VITE_API_URL`, the address of the API. It has to end with a slash (`http://localhost:4200/api/`). Vite bakes it into the build, so set it **before you build** for production.

## Pages

| Page                | Address                              | Who can open it                                               |
| ------------------- | ------------------------------------ | ------------------------------------------------------------- |
| Log in              | `/`                                  | everyone                                                      |
| Finish registration | `/first-time-register/:invitationId` | the person who got the invitation                             |
| Proformas           | `/proformas`                         | all users                                                     |
| Create proforma     | `/proformas/create`                  | all users                                                     |
| Edit proforma       | `/proformas/:proformaId/edit`        | admins                                                        |
| Orders              | `/orders`                            | all users, but only when the company's website accepts orders |
| Drinks              | `/drinks`                            | all users (only admins can change anything)                   |
| Categories          | `/categories`                        | all users (only admins can change anything)                   |
| Import goods        | `/purchase-import`                   | admins                                                        |
| Customers           | `/customers`                         | all users (only admins can change anything)                   |
| Warehouses          | `/warehouses`                        | all users (only admins can change anything)                   |
| Company             | `/company`                           | admins                                                        |
| Website             | `/website`                           | admins of a company that has a website                        |
| Profile             | `/profile`                           | all users                                                     |

After logging in you land on **Proformas**. Users who don't have the right role are sent to the "not found" page, and pages they can't use don't appear in their menu at all. "Website" only shows up for companies that have a site, and "Orders" only when that site accepts orders (`GET orders/enabled`).

### What each page does

- **Proformas.** A table of the company's proformas, each with its status (Active or Returned to stock). Click a row to see its lines. The three-dot menu on a row has **Download** (PDF), and for admins also **Edit** (while it's active) and **Return to stock**. The API can search proformas by number, customer or warehouse, but the page doesn't have a search box yet.
- **Create proforma** (also used for editing). First pick a warehouse (the default one is already selected) and the drinks: search for them, set quantities, and if needed a special price or discount for this proforma only. Then check the lines, optionally pick a customer, and create it. Creating takes the drinks off the stock and opens the PDF in a new tab with the print dialog. If there are no warehouses or drinks yet, the page tells you and offers to create them.
- **Orders.** The orders that came in through the website, newest first, with the buyer, the delivery day, when the order arrived, the total and a colored status: New, In progress (the courier has it), Delivered or Cancelled. You can filter by status. Click a row to see the buyer's contact details, delivery address and the drinks, and change the status with the select at the top. The three-dot menu has quick shortcuts for **In progress**, **Delivered** and **Cancel**. Cancelling always asks for a reason (optional) and then emails the buyer. No other status change sends an email.
- **Drinks.** All of the company's drinks, with search and filters for warehouse, stock level (warning or critical) and categories (you can pick several, and you get drinks in any of them). Drinks that are running low are shown in orange or red, and each drink shows its picture (or a bottle icon) and its categories as small tags. Admins add, edit and delete drinks. The drink form has a picture field (1200 × 1200 recommended) and category chips you click to put the drink in or out of a category.
- **Categories.** The company's drink categories with the number of drinks in each, and a search box. Admins add, rename and delete them. Deleting a category doesn't delete its drinks, they just aren't in it anymore. Renaming changes the category's address on the website.
- **Import goods.** An admin picks a warehouse and uploads a photo or PDF of a purchase invoice. On a phone the button also offers the camera, and on a computer you can drop a file on the box. The AI reads the drinks and quantities and opens them in a window where every line is already matched to a drink. You can change the drink or the quantity, skip lines, and then **Add to stock**. Below that is the **history** of uploads (with search and pages). Clicking one opens it again so you can add lines you skipped, and the three-dot menu has **Delete**. The document itself is never stored.
- **Customers.** The company's buyers, with search. Admins add, edit and delete them.
- **Warehouses.** One card per warehouse with its drinks and the total value of its stock. The default warehouse is marked and preselected on the other pages. A warehouse can only be deleted once it's empty.
- **Company.** Company details, the users with their roles, an **Add employee** button that sends an invitation, and a table of invitations (Pending, Accepted, Expired). The three-dot menu on a pending or expired invitation has **Resend invitation**, which sends the email again and extends the link by 7 days.
- **Website.** This is where a company manages its public site (the `dh-client` app). At the top there's a status panel: draft or published, anything still missing in red, and a **Publish site** button that stays disabled until everything is filled in. Below are tabs, one for each part of the site:

  - **General info**: name, city, address, phone, Instagram, opening hours (one day per line), the logo, and the site's key (the `ACCESS_KEY`, with a copy button).
  - **Hero**, **Story** and **Promo**: the texts of each section and its picture (for the hero, the background).
  - **Featured**: the title, the button and the recommended drinks. Click the search box and a dropdown opens with the first 10 drinks, so you can pick without typing, or type to search. Picked drinks are shown as cards with their picture and can be reordered. The number has to be even (2, 4, 6, 8 or 10), because the site shows them in pairs.
  - **SEO**: the title and description of the site and of the menu page, with a character counter, and the picture used when the site is shared. The site's tab icon is the logo.
  - **Messages**: everyone who wrote through the site's contact form, newest first.

  Every field is required: an empty one shows an error under it, and a tab with something missing gets a dot. Pictures are saved as soon as you pick them (the API converts them to WebP). The preview shows the whole picture with its size, and clicking it opens it full size. Changes show on the site right away, because the API tells the site to drop its cache.

- **Profile.** Name and email are read-only. Phone, date of birth and **language** can be changed. Log out is in the top menu.

## How it works

### Logging in

- The tokens are kept in `localStorage` (`access_token` and `refresh_token`).
- Every request goes through the axios instance in `hooks/use-api.ts`. It adds the token, and when the token has expired it gets a new one from the API first. If that fails, the user is logged out.
- Requests are sent as `application/json` by default. A file upload has to set `multipart/form-data` itself (see `use-purchase-import-service.ts`), otherwise axios turns the form into JSON and the file is lost.
- `routes/ProtectedRoute.tsx` checks the role for each page, and `hooks/use-roles.ts` gives you `isAdmin` for showing or hiding buttons.

### Data from the API (TanStack Query)

Every list and every detail view is a query. A page you've already visited shows its data instantly and quietly reloads it in the background when it's stale.

- `services/use-*-service.ts` has the API calls, one hook per area.
- `hooks/queries/use-*-queries.ts` has the queries built on top of them. The query keys are in `constatns/query-keys.ts`, and **how long data stays fresh** is in `constatns/stale-times.ts` (stock only 30 seconds, since every proforma changes it).
- `hooks/queries/use-refresh-data.ts` describes **what depends on what**. After you change something, call the matching function (`afterDrinkChange()`, `afterCategoryChange()`, `afterOrderChange()`, `afterProformaChange()`, `afterPurchaseImport()` and so on) and every list that shows that data reloads. Please don't reload data by hand.
- A thin green bar at the top shows that something is loading (`GlobalLoader`), a failed request shows the API's message in a toast (`useErrorToast`), and tables show a skeleton while they load.

### Lists with pages and search

The API sends lists in pages. A list is built from three pieces: `usePageState([search])` (the current page, which goes back to 1 when the search changes), `useDebouncedValue` for the search box, and `<ListPagination page totalPages onPageChange />` under the list. The previous page stays on screen while the next one loads.

`DefaultTableRowContainer` and `TableCell` turn a row into a table row on a wide screen and a card on a phone. Give every cell a `label` so the card knows what each value is. On a narrow phone the pagination only shows the first, current and last page.

### Windows (modals)

All windows go through one place, the `modal` slice in `state/shared/modal.ts`:

```ts
dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId } })) // open, with data
dispatch(removeModal()) // close
```

`components/modal/index.tsx` maps each `ModalEnums` value to its component. To add a window, add the enum value, build the component in `components/modal/...` and register it in that file. Give the content a width like `w-[480px] max-w-full` so it fits on a phone, and let the window scroll rather than a list inside it (an open select would get cut off). Only one window is open at a time, so a window that opens another one (like cancelling an order from its details) replaces it.

Use `ConfirmModal` for "are you sure?" questions (for example before deleting). It can also show a plain info message. Please don't use `window.confirm`.

### Languages

- The texts are in `translations/en/*.json` and `translations/sr/*.json`, one file per area (`general`, `log-in`, `static`, `errors`, `drinks`, `orders`, `proforma`, `purchase`, `website`, ...), registered in `translations/config.ts`. Use them with `t('namespace:key')`.
- Every key has to exist in **both** languages.
- The page title in the top menu comes from `static:navigation.leftSidePage.<route without the slash>`, so a new page needs a key there, and its menu item one in `leftSide`.
- Each user has their own language. It's saved in the API (`users.language`, default `en`), applied when they log in and remembered in the browser. It can be changed in the top menu or on the profile page.
- Role names are translated in `utils/roles.ts`. A user with several roles is shown with the strongest one.

### Dates

Every date is shown as **`10-11-2026`** (day-month-year). The format is a single constant, `DATE_FORMAT` in `utils/date.ts`, and all dates go through `formatDate()` (Day.js). Please don't format dates by hand. A typed date has to match the format, and the API always gets `YYYY-MM-DD`.

### Forms and fields

- Use the shared fields in `components/core`: `InputText`, `SingleSelect`, `MultySelect`, `DateSelect`, `QuantityInput`, `Checkbox` and `MainButton`, instead of plain browser `<select>` or `<input>` elements. The exceptions are file inputs and number fields inside a table row.
- `SingleSelect` and `MultySelect` take options shaped like `{ id, name, value }`. Clicking the selected option again clears it. `SingleSelectFormless` is the same select without react-hook-form, for use in the middle of a table row.
- Forms use react-hook-form with yup rules from `validations/`. A rule's message is a key in `translations/*/errors.json`.
- **Photos taken on a phone** are often 5 to 10 MB. `utils/image.ts` shrinks them to 2200 px (JPEG) before upload, so they're quick to send and stay under the API's 10 MB limit.

## Project structure

```
src/
  api/          the addresses of the API endpoints
  components/
    core/       buttons, inputs, selects, pagination, typography, toast
    modal/      every window
    section/    DataSection (a card with a title), GlobalLoader
    skeleton/   loading placeholders
    table/      the table row / card with the three-dot menu
    drinks/ categories/ customers/ orders/ proformas/ warehouses/ company/ purchase-import/ website/
                pieces of individual pages
  constatns/    routes, query keys, stale times, navigation (yes, misspelled, see below)
  hooks/        use-api, use-roles, use-page-state, queries/ ...
  icons/        the icons, including the ones in the menu
  layouts/      the page frame: left menu, top menu, language select
  modules/      the actual content of each page (categories, company, drinks, orders, proformas, ...)
  pages/        one thin file per page
  routes/       the routes and ProtectedRoute
  services/     the API calls
  state/        Redux (auth, modal, behaviours) and the query client
  translations/ English and Serbian texts
  utils/        dates, money, images, languages, roles, tokens, stock, order statuses ...
  validations/  yup rules
```

A page in `pages/` is just the frame. The real work happens in `modules/`.

## Good to know

- **Tailwind and dynamic classes.** A class built from a variable, like `` `grid-cols-${n}` ``, only gets generated if the exact same class appears written out somewhere else. Write classes out in full (or use `grid-cols-[...]`).
- **SVG files are URLs.** `import Icon from '...svg'` gives you a path, not a component, and React then fails with `'/public/...svg' is not a valid name` (a blank page). Use the icons in `src/icons`, or write the SVG inline.
- **Scrollbars** are green everywhere (`styles/general/scrollbar.scss`).
- **Misspelled folders.** `constatns` and `paggination` come from the old template. They're kept as they are so the imports keep working.
- **Error messages explain what happened.** `utils/api-error.ts` shows whatever message the API sent. If there isn't one, it says there's no connection, the request timed out, or which status came back, rather than a generic text. Locally the API also sends the real cause of unexpected errors.
- **Adding a website section.** A section is built from `components/website/SectionTab.tsx` (the form with its fields, placeholders and validation) and `WebsiteImageField.tsx` (the picture). To add one you need a tab component, its yup rules in `validations/website/website.ts`, its texts in `translations/*/website.json` (`tabs`, `placeholders`, `missing`) and the field names in `errors.json`.
- **`public/`** still holds a few images from an older project that are probably unused.
- **Deploying.** `vercel.json` sends every address to `index.html`, which a single-page app needs. Remember to set `VITE_API_URL` before the build.
- **There are no tests here yet.** The API has them (`pnpm test` in `dh-api`). For the dashboard, `pnpm build` and `pnpm lint` are the checks.
