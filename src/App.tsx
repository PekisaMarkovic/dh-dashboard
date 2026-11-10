import { Fragment } from 'react/jsx-runtime'
import { useAuth } from '@/src/hooks/use-auth'
import AppRoutes from '@/src/routes/AppRoutes'

function App() {
  const { isLoad } = useAuth()

  return isLoad ? <AppRoutes /> : <Fragment />
}

export default App
