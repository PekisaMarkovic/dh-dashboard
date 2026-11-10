import { configureStore } from '@reduxjs/toolkit'
import auth from '@/src/state/user/authSlice'
import modal from '@/src/state/shared/modal'
import behaviours from '@/src/state/shared/behaviours'

export const store = configureStore({
  reducer: {
    auth,
    behaviours,
    modal,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type State = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const getStoreState = () => store.getState()
