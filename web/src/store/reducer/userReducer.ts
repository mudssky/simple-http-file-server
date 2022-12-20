import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { DefaultModalOptions, ModalOptions } from '../../util/state'

export interface UserInfo {
  username: string
}
type PermissionType = 'read' | 'write' | 'delete' | 'rename'
interface State {
  loginModalOptions: ModalOptions
  userInfo?: UserInfo
  permissionList: PermissionType[]
}

const initialState: State = {
  loginModalOptions: DefaultModalOptions,
  userInfo: undefined,
  permissionList: [],
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
    setPermissionListAction: (
      state,
      action: PayloadAction<PermissionType[]>,
    ) => {
      state.permissionList = action.payload
    },
  },
})

export const {
  setLoginModalOptionsAction,
  setUserInfoAction,
  setPermissionListAction,
} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const userState = (state: RootState) => state.user

export default userSlice.reducer
