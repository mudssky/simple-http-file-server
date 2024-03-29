/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, message, Modal } from 'antd'
import { UploadChangeParam, UploadFile } from 'antd/es/upload'
import { useEffect, useMemo, useState } from 'react'
import {
  CREATE_TXT,
  FileItem,
  GET_FILELIST,
  MKDIR,
  REMOVE_ITEM,
  RENAME_ITEM,
} from '../../api/fileList'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  BreadcrumbItem,
  initialState,
  rootBreadcrumbItem,
  setBreadcrumbitemList,
  setCurrentRenameItemAction,
  setFileList,
  setIsNewFolderModalVisible,
  setIsNewTextModalVisible,
  setIsPreviewVisibleAction,
  setIsTableLoadingAction,
  setMusicListAction,
  setNewFolderName,
  setNewNameAction,
  setPhotoPreviewOptionsAction,
  setPreviewListAction,
  setRenameModalOptionsAction,
  setRootFolderList,
  setUploadProgressModalOptions,
} from '../../store/reducer/homeReducer'
import { checkResponse, isImage, isMusic, path } from '../../util/util'
import { flushSync } from 'react-dom'
import { getServerStaticUrl } from '../../config'
import { useNavigate } from 'react-router-dom'

export default function useSetupHook() {
  const state = useAppSelector((state) => state.home)
  const dispatch = useAppDispatch()
  const [currentUploadFileList, setCurrentUploadFileList] = useState<
    UploadFile[]
  >([])
  const {
    currentFileList,
    breadcrumbitemList,
    isNewFolderModalVisible,
    newFolderName,
    isNewTextModalVisible,
    uploadProgressModalOptions,
    newName,
    renameModalOptions,
    currentRenameItem,
    photoPreviewOptions,
  } = state
  const [newTextForm] = Form.useForm()

  const navigate = useNavigate()
  const currentWorkDir = useMemo(
    () => breadcrumbitemList.at(-1)?.key ?? rootBreadcrumbItem.key,
    [breadcrumbitemList],
  )
  const getData = async () => {
    // 如果状态没清空的情况下，再次进入不刷新数据
    if (state !== initialState) {
      return
    }
    await enterFolder({ path: '' })
  }
  const enterFolder = async (
    params: { path: string },
    success?: () => void,
  ) => {
    dispatch(setIsTableLoadingAction(true))
    const res = await GET_FILELIST(params)
    // console.log('res', res)
    dispatch(setIsTableLoadingAction(false))
    if (res.code === 0) {
      message.success(res.msg)
      dispatch(setFileList(res.data))
      success?.()
      if (params.path === '') {
        // 根目录信息，是用来匹配绝对路径前缀，拼接静态路径的。
        dispatch(setRootFolderList(res.data))
      }
    } else {
      message.error(res.msg)
    }
  }
  const refreshCurrentWorkDir = async () => {
    // const currentWorkDir = getCurrentWorkDir()
    enterFolder({
      path: currentWorkDir,
    })
  }
  const handleFileClick = async (record: FileItem) => {
    if (!record.isFolder) {
      message.success('不是文件夹')
      return
    }
    enterFolder({ path: record.path }, () => {
      dispatch(
        setBreadcrumbitemList([
          ...breadcrumbitemList,
          {
            key: record.path,
            title: record.name,
          },
        ]),
      )
    })
  }

  const handleBreadcrumbJump = async (index: number, item: BreadcrumbItem) => {
    if (index >= breadcrumbitemList.length - 1 || index < 0) {
      return
    }
    // console.log({ index, item })
    await enterFolder({ path: item.key }, () => {
      if (item.key === rootBreadcrumbItem.key) {
        dispatch(setBreadcrumbitemList([rootBreadcrumbItem]))
      } else {
        // const newlist = [rootBreadcrumbItem]
        dispatch(setBreadcrumbitemList(breadcrumbitemList.slice(0, index + 1)))
      }
    })
  }
  const handleBackToParent = async () => {
    await handleBreadcrumbJump(
      breadcrumbitemList.length - 2,
      breadcrumbitemList.at(-2) ?? rootBreadcrumbItem,
    )
  }

  const showNewFolderModal = () => {
    dispatch(setIsNewFolderModalVisible(true))
  }
  const cancelNewFolderModal = () => {
    dispatch(setIsNewFolderModalVisible(false))
  }

  const showNewTextModal = () => {
    dispatch(setIsNewTextModalVisible(true))
  }
  const cancelNewTextModal = () => {
    dispatch(setIsNewTextModalVisible(false))
  }
  const handleCreateNewText = async () => {
    const formValues = await newTextForm.validateFields()
    console.log('formValues', formValues)

    const res = await CREATE_TXT({
      path: `${currentWorkDir}/${formValues.filename}.txt`,
      content: formValues.content,
    })
    checkResponse(res, {
      successCallback: () => {
        refreshCurrentWorkDir()
        cancelNewTextModal()
      },
    })
  }
  // const handleNewTextChange = (e: { target: { value: string } }) => {
  //   dispatch(setNewTextContent(e.target.value))
  // }
  const handleNewFolderNameChange = (e: { target: { value: string } }) => {
    dispatch(setNewFolderName(e.target.value))
  }
  const handleNewNameChange = (e: { target: { value: string } }) => {
    dispatch(setNewNameAction(e.target.value))
  }
  const handleCreateNewFolder = async () => {
    // const currentWorkDir = getCurrentWorkDir()
    const res = await MKDIR({
      path: `${currentWorkDir}/${newFolderName}`,
    })
    checkResponse(res, {
      successCallback: () => {
        cancelNewFolderModal()
        dispatch(setNewFolderName(''))
        refreshCurrentWorkDir()
      },
    })
  }
  const handleDeleteItem = async (record: FileItem) => {
    Modal.confirm({
      title: `确认删除${record.isFolder ? '文件夹' : '文件'}`,
      content: `${record.path}`,
      onOk: async () => {
        const res = await REMOVE_ITEM({
          path: record.path,
        })
        checkResponse(res, {
          successCallback: refreshCurrentWorkDir,
        })
      },
    })
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const getUploadFolderData = (file: any) => {
    // if (file?.webkitRelativePath) {
    //   return
    // }
    const pathname = path.dirname(file?.webkitRelativePath ?? '')
    return {
      path: `${currentWorkDir}/${pathname}`,
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log('info', info)
    dispatch(
      setUploadProgressModalOptions({
        ...uploadProgressModalOptions,
        open: true,
      }),
    )
    flushSync(() => setCurrentUploadFileList(info.fileList))

    if (
      !info?.event &&
      info.fileList.every((item) => {
        return item.status === 'done'
      })
    ) {
      refreshCurrentWorkDir()
      setTimeout(() => {
        dispatch(
          setUploadProgressModalOptions({
            ...uploadProgressModalOptions,
            open: false,
          }),
        )
        setCurrentUploadFileList([])
      }, 2000)
    }
  }

  const showRenameModal = (record: FileItem) => {
    dispatch(
      setRenameModalOptionsAction({
        ...renameModalOptions,
        open: true,
      }),
    )
    dispatch(setCurrentRenameItemAction(record))
    dispatch(setNewNameAction(record.name))
  }
  const handleRenameSubmit = async () => {
    dispatch(
      setRenameModalOptionsAction({
        ...renameModalOptions,
        confirmLoading: true,
      }),
    )
    const res = await RENAME_ITEM({
      path: currentRenameItem?.path ?? '',
      newName: newName,
    })

    dispatch(
      setRenameModalOptionsAction({
        ...renameModalOptions,
        confirmLoading: false,
      }),
    )
    if (res.code === 0) {
      dispatch(
        setRenameModalOptionsAction({
          open: false,
          confirmLoading: false,
        }),
      )
      refreshCurrentWorkDir()
    }
  }
  const handleDownloadItem = async (record: FileItem) => {
    window.open(record.link)
    // await DOWNLOAD_ITEM(record)
    // console.log(record)
  }
  const cancelUploadProgressModal = () => [
    dispatch(
      setUploadProgressModalOptions({
        ...uploadProgressModalOptions,
        open: false,
      }),
    ),
  ]
  const handleSinglePicPreview = (record: FileItem) => {
    dispatch(
      setPreviewListAction([
        {
          src: getServerStaticUrl(record.link),
        },
      ]),
    )
    dispatch(setPhotoPreviewOptionsAction({ visible: true, index: 0 }))
  }
  const handleGalleryMode = () => {
    const imgList = currentFileList.filter((item) => {
      return isImage(item.name)
    })
    if (imgList.length <= 0) {
      message.info('当前目录未发现图片')
      return
    }
    dispatch(
      setPreviewListAction(
        imgList.map((item) => {
          return {
            src: getServerStaticUrl(item.link),
          }
        }),
      ),
    )
    showPreviewGroup()
  }
  const handleMusicMode = async () => {
    const audioList = currentFileList.filter((item) => {
      return !item.isFolder && isMusic(item.name)
    })
    if (audioList.length < 1) {
      message.info('当前目录未发现支持的音频文件')
      return
    }
    const musicList = audioList.map((item) => {
      return {
        name: item.name,
        url: item.link,
        path: item.path,
      }
    })
    dispatch(setMusicListAction(musicList))
  }
  function showPreviewGroup() {
    dispatch(
      setPhotoPreviewOptionsAction({
        ...photoPreviewOptions,
        visible: true,
      }),
    )
  }
  const handlePreviewVisibleChange = (value: boolean) => {
    dispatch(setIsPreviewVisibleAction(value))
  }

  const handleJumpPlaylist = (record: FileItem) => {
    console.log({ record })

    navigate('/play', {
      state: {
        currentVideoItem: record,
        fileList: currentFileList,
      },
    })
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    getData()
  }, [])
  return {
    breadcrumbitemList,
    currentFileList,
    isNewFolderModalVisible,
    isNewTextModalVisible,
    newFolderName,
    newTextForm,
    currentWorkDir,
    state,
    currentUploadFileList,
    handleGalleryMode,
    handleMusicMode,
    handleSinglePicPreview,
    getUploadFolderData,
    cancelUploadProgressModal,
    handleNewNameChange,
    cancelNewTextModal,
    handleFileClick,
    handleBreadcrumbJump,
    handleBackToParent,
    showNewFolderModal,
    cancelNewFolderModal,
    handleNewFolderNameChange,
    handleCreateNewFolder,
    handleDeleteItem,
    showNewTextModal,
    handleCreateNewText,
    refreshCurrentWorkDir,
    handleUploadChange,
    handleRenameSubmit,
    showRenameModal,
    handleDownloadItem,
    handlePreviewVisibleChange,
    handleJumpPlaylist,
  }
}
