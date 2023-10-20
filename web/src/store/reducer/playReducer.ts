import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { FileItem } from '../../api/fileList'

interface SubtitleOptions {
  // danmakuList: FileItem[]
  // subtitleList: FileItem[]
  currentDanmaku?: FileItem
  currentSubtitle?: FileItem
}
interface State {
  currentFileItem: FileItem | null
  // playlist: FileItem[]
  subtitleOptions: SubtitleOptions
  fileList: FileItem[]
}

const initialState: State = {
  currentFileItem: null,
  // playlist: [],
  fileList: [],
  subtitleOptions: {
    // danmakuList: [],
    // subtitleList: [],
  },
}

export const playSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentFileItemAction: (state, action: PayloadAction<FileItem>) => {
      state.currentFileItem = action.payload
    },
    // setPlaylistAction: (state, action: PayloadAction<FileItem[]>) => {
    //   state.playlist = action.payload
    // },
    setFileListAction: (state, action: PayloadAction<FileItem[]>) => {
      state.fileList = action.payload
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
  setCurrentFileItemAction,
  // setPlaylistAction,
  setSubtitleOptionsAction,
  setFileListAction,
} = playSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const playState = (state: RootState) => state.play

export default playSlice.reducer
