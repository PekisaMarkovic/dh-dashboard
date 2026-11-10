import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/src/App.tsx'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '@/src/state/store.ts'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css'
import 'reset-css'
import 'react-toastify/dist/ReactToastify.css'
import '@/src/styles/index.scss'
import { ToastContainer } from 'react-toastify'
import '@/src/translations/config.ts'
import MainModal from '@/src/components/modal/index.js'
import ScreenSizeWarning from './components/section/ScreenSizeWarnings'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <ScreenSizeWarning>
          <App />
          <ToastContainer autoClose={3000} position="top-center" hideProgressBar />
          <MainModal />
        </ScreenSizeWarning>
      </Router>
    </Provider>
  </StrictMode>,
)
