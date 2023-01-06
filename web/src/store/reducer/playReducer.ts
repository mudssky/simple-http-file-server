import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { FileItem } from '../../api'

interface SubtitleOptions {
  danmakuList: FileItem[]
  subtitleList: FileItem[]
  currentDanmaku?: FileItem
  currentSubtitle?: FileItem
}
interface State {
  currentVideo: FileItem | null
  playlist: FileItem[]
  subtitleOptions: SubtitleOptions
}

const initialState: State = {
  currentVideo: null,
  playlist: [],
  subtitleOptions: {
    danmakuList: [],
    subtitleList: [],
  },
}

export const playSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentFileitemAction: (state, action: PayloadAction<FileItem>) => {
      state.currentVideo = action.payload
    },
    setPlaylistAction: (state, action: PayloadAction<FileItem[]>) => {
      state.playlist = action.payload
    },
    setSubtitleOptionsAction: (
      state,
      action: PayloadAction<SubtitleOptions>,
    ) => {
      state.subtitleOptions = action.payload
    },
  },
})

export const {
  setCurrentFileitemAction,
  setPlaylistAction,
  setSubtitleOptionsAction,
} = playSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const playState = (state: RootState) => state.play

export default playSlice.reducer
