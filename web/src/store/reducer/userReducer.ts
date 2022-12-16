import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { DefaultModalOptions, ModalOptions } from '../../util/state'

interface State {
  loginModalOptions: ModalOptions
}

const initialState: State = {
  loginModalOptions: DefaultModalOptions,
}
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginModalOptionsAction: (
      state,
      action: PayloadAction<ModalOptions>,
    ) => {
      ;(state.loginModalOptions as ModalOptions) = action.payload
    },
  },
})

export const { setLoginModalOptionsAction } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const userState = (state: RootState) => state.user

export default userSlice.reducer
