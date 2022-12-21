import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { DefaultModalOptions, ModalOptions } from '../../util/state'

export interface UserInfo {
  username: string
}
export type PermissionType = 'read' | 'write' | 'delete' | 'rename'
export type PermissionMap = { [key in PermissionType]?: boolean }
interface State {
  loginModalOptions: ModalOptions
  userInfo?: UserInfo
  permissionMap: PermissionMap
}

const initialState: State = {
  loginModalOptions: DefaultModalOptions,
  userInfo: undefined,
  permissionMap: {},
}
/**
 * 转换权限列表为map，这样以后查询的时候快一点
 * @param permissionList
 * @returns
 */
export function convertPermissionList(permissionList: PermissionType[]) {
  const permissionMap: PermissionMap = {}
  for (const key of permissionList) {
    permissionMap[key] = true
  }
  return permissionMap
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
    setPermissionMapAction: (state, action: PayloadAction<PermissionMap>) => {
      state.permissionMap = action.payload
    },
  },
})

export const {
  setLoginModalOptionsAction,
  setUserInfoAction,
  setPermissionMapAction,
} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const userState = (state: RootState) => state.user

export default userSlice.reducer
