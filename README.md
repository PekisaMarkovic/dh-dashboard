# DH Dashboard

The web app of **DH**: companies keep track of the drinks in their warehouses and make proformas (price quotes) from them.

Built with React, TypeScript, Vite and Tailwind. It talks to the `dh-api` repo.

- App: `http://localhost:4300`
- Languages: English and Serbian

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
| Drinks | `/drinks` | all users (only admins can change) |
| Warehouses | `/warehouses` | all users (only admins can change) |
| Company | `/company` | admins only |
| Profile | `/profile` | all users |

Where you land after login: **Proforma**. A user without the right role is sent to the "not found" page, and admin pages are not even in their menu.

### What each page does

- **Proforma.** A table of the proformas of the company with a status (Active or Returned to stock). The **Create proforma** button opens a window: pick a warehouse (one is already selected), press **Add drinks**, search the drinks and set quantities for one or more at once, then create. Creating takes the drinks off the stock. The three dots on a row: **Download** (PDF) and, for admins, **Return to stock**. If there is no warehouse or no drinks yet, the window says so and offers to create them.
- **Drinks.** All drinks of the company, with search and a filter by warehouse. Admins add, edit and delete.
- **Warehouses.** A card for each warehouse with its drinks and the total value of the stock. A warehouse can only be deleted when it is empty.
- **Company.** Company info, the users (with their role), the **Add employee** button that sends an invitation, and the table of invitations (Pending, Accepted, Expired). The three dots on a Pending or Expired invitation have **Resend invitation**: the email goes out again and the link is valid for 7 more days.
- **Profile.** Name and email are read only. Phone, date of birth and **language** can be changed. Log out is in the top menu.

## How it works

### Login

- The tokens are kept in `localStorage` (`access_token`, `refresh_token`).
- Every request goes through the axios instance from `hooks/use-api.ts`. It adds the token, and when the token has expired it asks the API for a new one first. If that fails, the user is logged out.
- `routes/ProtectedRoute.tsx` checks the role for a page, `hooks/use-roles.ts` gives `isAdmin` for buttons.

### Windows (modals)

All windows go through one place, the `modal` slice in `state/shared/modal.ts`:

```ts
dispatch(openModal({ modal: ModalEnums.DRINK, data: { warehouseId } })) // open, with data
dispatch(refresh())     // something changed: lists that watch refreshKey load again
dispatch(removeModal()) // close
```

`components/modal/index.tsx` maps each `ModalEnums` value to its component. To add a window: add the enum value, build the component in `components/modal/...`, add it to that file.

`ConfirmModal` is the "are you sure" window (for deleting), it can also be an info message. Do not use `window.confirm`.

### Languages

- Texts are in `translations/en/*.json` and `translations/sr/*.json`, one file per area (`general`, `log-in`, `static`, `errors`, `drinks`, ...). They are registered in `translations/config.ts`. Use `t('namespace:key')`.
- Every key has to exist in **both** languages.
- Each user keeps their own language. It is saved on the API (`users.language`, default `en`), applied when they log in, and remembered in the browser. It can be changed in the top menu or on the profile.
- Roles are translated through `utils/roles.ts` (a user who is a super admin is shown as the strongest role only).

### Dates

All dates are shown as **`10-11-2026`** (day-month-year). The format is one constant, `DATE_FORMAT` in `utils/date.ts`, and everything goes through `formatDate()` (Day.js). Do not format dates by hand. A typed date has to match the format. The API gets `YYYY-MM-DD`.

### Lists with pages

Lists show **10 rows** per page. Use the `usePagedList(items)` hook and `<ListPagination />` under the list. It cuts the list in the browser, nothing to do on the API.

### Forms and fields

- Use the shared fields from `components/core`: `InputText`, `SingleSelect`, `DateSelect`, `QuantityInput`, `MainButton`. Do not use plain browser `<select>` or `<input>`.
- `SingleSelect` works with `{ id, name, value }` options. Clicking the selected option again clears it.
- Forms use react-hook-form with yup rules in `validations/`. A rule's message is a key of `translations/*/errors.json`.

## Project structure

```
src/
  api/          addresses of the API endpoints
  components/
    core/       buttons, inputs, selects, pagination, typography
    modal/      all windows
    section/    DataSection (a card with a title)
    table/      table row with the three dots menu
  hooks/        use-api, use-auth, use-roles, use-paged-list
  layouts/      page frame: left menu, top menu, language select
  modules/      the content of a page (company, drinks, proformas, ...)
  pages/        one thin file per page
  routes/       routes and ProtectedRoute
  state/        Redux: auth, modal, behaviours
  translations/ en and sr texts
  utils/        date, language, roles, token, files
  validations/  yup rules
```

A page (`pages/`) is only the frame, the real work is in `modules/`.

## Good to know

- **Tailwind and dynamic classes.** A class built from a variable, like `` `grid-cols-${n}` ``, is only generated if the same class is written out somewhere else. Write classes out in full (or use `grid-cols-[...]`).
- **Scrollbars** are green everywhere (`styles/general/scrollbar.scss`).
- **Folder names** `constatns` and `paggination` are misspelled (they come from the old template). They are kept so imports keep working.
- **`public/`** still has some images from an older project that are probably not used.
- **Deploy.** `vercel.json` sends every address to `index.html`, which a single page app needs.
