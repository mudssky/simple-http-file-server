import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { DefaultModalOptions, ModalOptions } from '../../util/state'

export interface UserInfo {
  username: string
}
interface State {
  loginModalOptions: ModalOptions
  userInfo?: UserInfo
}

const initialState: State = {
  loginModalOptions: DefaultModalOptions,
  userInfo: undefined,
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
    setUserInfoAction: (state, action: PayloadAction<UserInfo | undefined>) => {
      state.userInfo = action.payload
    },
  },
})

export const { setLoginModalOptionsAction, setUserInfoAction } =
  userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const userState = (state: RootState) => state.user

export default userSlice.reducer
