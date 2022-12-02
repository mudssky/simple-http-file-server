import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UploadFile } from 'antd'
import { FileItem } from '../../api'
import { DefaultModalOptions, ModalOptions } from '../../util/state'
import { RootState } from '../store'

export interface BreadcrumbItem {
  key: string
  name: string
}
export type UploadProgressItem = Omit<
  UploadFile<unknown>,
  'lastModifiedDate' | 'originFileObj' | 'xhr'
>
interface State {
  fileList: FileItem[]
  breadcrumbitemList: BreadcrumbItem[]
  isNewFolderModalVisible: boolean
  newFolderName: string //创建新目录的名字
  isNewTextModalVisible: boolean
  uploadProgressModalOptions: ModalOptions
}
export const rootBreadcrumbItem = {
  key: '',
  name: 'root',
}

const initialState: State = {
  fileList: [],
  breadcrumbitemList: [rootBreadcrumbItem],
  isNewFolderModalVisible: false,
  newFolderName: '',
  isNewTextModalVisible: false,
  uploadProgressModalOptions: DefaultModalOptions,
}
export const homeSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFileList: (state, action: PayloadAction<FileItem[]>) => {
      state.fileList = action.payload
    },
    setBreadcrumbitemList: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbitemList = action.payload
    },
    setIsNewFolderModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isNewFolderModalVisible = action.payload
    },
    setNewFolderName: (state, action: PayloadAction<string>) => {
      state.newFolderName = action.payload
    },
    setIsNewTextModalVisible: (state, action: PayloadAction<boolean>) => {
      state.isNewTextModalVisible = action.payload
    },
    setUploadProgressModalOptions: (
      state,
      action: PayloadAction<ModalOptions>
    ) => {
      ;(state.uploadProgressModalOptions as ModalOptions) = action.payload
    },
  },
})

export const {
  setFileList,
  setBreadcrumbitemList,
  setIsNewFolderModalVisible,
  setNewFolderName,
  setIsNewTextModalVisible,
  setUploadProgressModalOptions,
} = homeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const homeState = (state: RootState) => state.home

export default homeSlice.reducer
