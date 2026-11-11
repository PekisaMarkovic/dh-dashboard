import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Nullable } from '@/src/interfaces'
import { State as AppState } from '@/src/state/store'
import { ModalEnums } from '@/src/enum'

type State = {
  modal: Nullable<ModalEnums>
  // data handed to the opened modal, e.g. the item that is being edited
  data: unknown
}

const initialState: State = {
  modal: null,
  data: null,
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    initializeModal: () => initialState,
    setModal: (state, action: PayloadAction<ModalEnums>) => {
      state.modal = action.payload
      state.data = null
    },
    openModal: (state, action: PayloadAction<{ modal: ModalEnums; data?: unknown }>) => {
      state.modal = action.payload.modal
      state.data = action.payload.data ?? null
    },
    removeModal: (state) => {
      state.modal = null
      state.data = null
    },
  },
})

export const { initializeModal, setModal, openModal, removeModal } = modalSlice.actions

export default modalSlice.reducer

export const selectModal = (state: AppState) => state.modal
