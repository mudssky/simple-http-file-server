import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageProps, UploadFile } from "antd";
import { FileItem } from "../../api";
import { DefaultModalOptions, ModalOptions } from "../../util/state";
import { RootState } from "../store";
import { DataType } from "react-photo-view/dist/types";
import React from "react";
import { AudioItem } from "../../components/aplayer";
export interface BreadcrumbItem {
	key: string;
	name: string;
}
export type UploadProgressItem = Omit<
	UploadFile<unknown>,
	"lastModifiedDate" | "originFileObj" | "xhr"
>;

export interface PreviewItem extends ImageProps {
	src: string; //图片地址
}

export interface PhotoPreviewImgItem extends DataType {
	key: React.Key;
	src: string;
}
export interface PhotoPreviewOptions {
	index: number;
	visible: boolean;
}
const DefaultPhotoPreviewOptions: PhotoPreviewOptions = {
	index: 0,
	visible: false,
};
interface State {
	currentFileList: FileItem[];
	rootFolderList: FileItem[];
	isTableLoading: boolean;
	isPreviewVisible: boolean;
	breadcrumbitemList: BreadcrumbItem[];
	isNewFolderModalVisible: boolean;
	newFolderName: string; //创建新目录的名字
	isNewTextModalVisible: boolean;
	uploadProgressModalOptions: ModalOptions;
	renameModalOptions: ModalOptions;
	newName: string;
	currentRenameItem: FileItem | null;
	previewList: PreviewItem[];
	photoPreviewOptions: PhotoPreviewOptions;
	musicList: AudioItem[];
}
export const rootBreadcrumbItem = {
	key: "",
	name: "root",
};

export const initialState: State = {
	currentFileList: [],
	rootFolderList: [],
	previewList: [],
	isTableLoading: false,
	isPreviewVisible: false,
	breadcrumbitemList: [rootBreadcrumbItem],
	isNewFolderModalVisible: false,
	newFolderName: "",
	isNewTextModalVisible: false,
	uploadProgressModalOptions: DefaultModalOptions,
	renameModalOptions: DefaultModalOptions,
	newName: "",
	currentRenameItem: null,
	photoPreviewOptions: DefaultPhotoPreviewOptions,
	musicList: [],
};
export const homeSlice = createSlice({
	name: "counter",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setFileList: (state, action: PayloadAction<FileItem[]>) => {
			state.currentFileList = action.payload;
		},
		setRootFolderList: (state, action: PayloadAction<FileItem[]>) => {
			state.rootFolderList = action.payload;
		},
		setIsTableLoadingAction: (state, action: PayloadAction<boolean>) => {
			state.isTableLoading = action.payload;
		},
		setIsPreviewVisibleAction: (state, action: PayloadAction<boolean>) => {
			state.isPreviewVisible = action.payload;
		},
		setPreviewListAction: (state, action: PayloadAction<PreviewItem[]>) => {
			(state.previewList as PreviewItem[]) = action.payload;
		},
		setBreadcrumbitemList: (state, action: PayloadAction<BreadcrumbItem[]>) => {
			state.breadcrumbitemList = action.payload;
		},
		setIsNewFolderModalVisible: (state, action: PayloadAction<boolean>) => {
			state.isNewFolderModalVisible = action.payload;
		},
		setNewFolderName: (state, action: PayloadAction<string>) => {
			state.newFolderName = action.payload;
		},
		setIsNewTextModalVisible: (state, action: PayloadAction<boolean>) => {
			state.isNewTextModalVisible = action.payload;
		},
		setUploadProgressModalOptions: (
			state,
			action: PayloadAction<ModalOptions>,
		) => {
			(state.uploadProgressModalOptions as ModalOptions) = action.payload;
		},
		setRenameModalOptionsAction: (
			state,
			action: PayloadAction<ModalOptions>,
		) => {
			(state.renameModalOptions as ModalOptions) = action.payload;
		},
		setNewNameAction: (state, action: PayloadAction<string>) => {
			state.newName = action.payload;
		},
		setCurrentRenameItemAction: (state, action: PayloadAction<FileItem>) => {
			state.currentRenameItem = action.payload;
		},
		setPhotoPreviewOptionsAction: (
			state,
			action: PayloadAction<PhotoPreviewOptions>,
		) => {
			state.photoPreviewOptions = action.payload;
		},
		setMusicListAction: (state, action: PayloadAction<AudioItem[]>) => {
			state.musicList = action.payload;
		},
	},
});

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
	setPhotoPreviewOptionsAction,
	setMusicListAction,
} = homeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const homeState = (state: RootState) => state.home;

export default homeSlice.reducer;
