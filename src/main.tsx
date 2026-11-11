import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/src/App.tsx'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '@/src/state/store.ts'
import { queryClient } from '@/src/state/query-client'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css'
import 'reset-css'
import 'react-toastify/dist/ReactToastify.css'
import '@/src/styles/index.scss'
import { ToastContainer } from 'react-toastify'
import '@/src/translations/config.ts'
import MainModal from '@/src/components/modal/index.js'
import GlobalLoader from '@/src/components/section/GlobalLoader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <App />
          <ToastContainer autoClose={3000} position="top-center" hideProgressBar />
          <MainModal />
          <GlobalLoader />
        </Router>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
