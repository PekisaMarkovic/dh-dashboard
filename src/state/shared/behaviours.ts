import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { State as AppState } from '@/src/state/store'
import { SaveDisabledEnums } from '@/src/enum'

type State = {
  isScrollDisabled: boolean
  isSaveDisabled: SaveDisabledEnums[]
}

const initialState: State = {
  isScrollDisabled: false,
  isSaveDisabled: [],
}

const behaviourSlice = createSlice({
  name: 'behaviours',
  initialState,
  reducers: {
    initializeTributes: () => initialState,
    handleDisableScroll: (state) => {
      state.isScrollDisabled = true
    },

    handleAllowScroll: (state) => {
      state.isScrollDisabled = false
    },

    handleDisableSave: (state, action: PayloadAction<SaveDisabledEnums>) => {
      state.isSaveDisabled = [...state.isSaveDisabled, action.payload]
    },

    handleAllowSave: (state, action: PayloadAction<SaveDisabledEnums>) => {
      state.isSaveDisabled = state.isSaveDisabled.filter((dis) => dis !== action.payload)
    },
  },
})

export const { handleDisableScroll, handleAllowScroll, handleDisableSave, handleAllowSave } = behaviourSlice.actions

export default behaviourSlice.reducer

export const selectBehaviours = (state: AppState) => state.behaviours
