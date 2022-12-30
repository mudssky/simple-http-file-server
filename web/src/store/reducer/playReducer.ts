import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { FileItem } from '../../api'

interface State {
  currentFileitem: FileItem | null
  playlist: FileItem[]
}

const initialState: State = {
  currentFileitem: null,
  playlist: [],
}

export const playSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentFileitemAction: (state, action: PayloadAction<FileItem>) => {
      state.currentFileitem = action.payload
    },
    setPlaylistAction: (state, action: PayloadAction<FileItem[]>) => {
      state.playlist = action.payload
    },
  },
})

export const { setCurrentFileitemAction, setPlaylistAction } = playSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const playState = (state: RootState) => state.play

export default playSlice.reducer
