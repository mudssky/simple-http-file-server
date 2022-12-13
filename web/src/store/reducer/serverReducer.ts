import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { ServerInfo } from '../../api/server'

interface State {
  serverInfo: ServerInfo
}

const initialState: State = {
  serverInfo: {
    localIpList: [],
    port: 0,
  },
}
export const serverSlice = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServerInfoAction: (state, action: PayloadAction<ServerInfo>) => {
      state.serverInfo = action.payload
    },
  },
})

export const { setServerInfoAction } = serverSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const serverState = (state: RootState) => state.server

export default serverSlice.reducer
