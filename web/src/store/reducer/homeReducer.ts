import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ImageProps, UploadFile } from 'antd'
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

export interface PreviewItem extends ImageProps {
  src: string //图片地址
}

interface State {
  currentFileList: FileItem[]
  rootFolderList: FileItem[]
  isTableLoading: boolean
  isPreviewVisible: boolean
  breadcrumbitemList: BreadcrumbItem[]
  isNewFolderModalVisible: boolean
  newFolderName: string //创建新目录的名字
  isNewTextModalVisible: boolean
  uploadProgressModalOptions: ModalOptions
  renameModalOptions: ModalOptions
  newName: string
  currentRenameItem: FileItem | null
  previewList: PreviewItem[]
}
export const rootBreadcrumbItem = {
  key: '',
  name: 'root',
}

const initialState: State = {
  currentFileList: [],
  rootFolderList: [],
  previewList: [],
  isTableLoading: false,
  isPreviewVisible: false,
  breadcrumbitemList: [rootBreadcrumbItem],
  isNewFolderModalVisible: false,
  newFolderName: '',
  isNewTextModalVisible: false,
  uploadProgressModalOptions: DefaultModalOptions,
  renameModalOptions: DefaultModalOptions,
  newName: '',
  currentRenameItem: null,
}
export const homeSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setFileList: (state, action: PayloadAction<FileItem[]>) => {
      state.currentFileList = action.payload
    },
    setRootFolderList: (state, action: PayloadAction<FileItem[]>) => {
      state.rootFolderList = action.payload
    },
    setIsTableLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.isTableLoading = action.payload
    },
    setIsPreviewVisibleAction: (state, action: PayloadAction<boolean>) => {
      state.isPreviewVisible = action.payload
    },
    setPreviewListAction: (state, action: PayloadAction<PreviewItem[]>) => {
      ;(state.previewList as PreviewItem[]) = action.payload
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
    setRenameModalOptionsAction: (
      state,
      action: PayloadAction<ModalOptions>
    ) => {
      ;(state.renameModalOptions as ModalOptions) = action.payload
    },
    setNewNameAction: (state, action: PayloadAction<string>) => {
      state.newName = action.payload
    },
    setCurrentRenameItemAction: (state, action: PayloadAction<FileItem>) => {
      state.currentRenameItem = action.payload
    },
  },
})

export const {
  setFileList,
  setRootFolderList,
  setPreviewListAction,
  setBreadcrumbitemList,
  setIsNewFolderModalVisible,
  setNewFolderName,
  setIsNewTextModalVisible,
  setUploadProgressModalOptions,
  setRenameModalOptionsAction,
  setNewNameAction,
  setCurrentRenameItemAction,
  setIsTableLoadingAction,
  setIsPreviewVisibleAction,
} = homeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const homeState = (state: RootState) => state.home

export default homeSlice.reducer
