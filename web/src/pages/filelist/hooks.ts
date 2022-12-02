import { Form, message, Modal } from 'antd'
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload'
import { useEffect, useMemo, useState } from 'react'
import {
  createTxt,
  FileItem,
  getFileList,
  mkdir,
  removeItem,
  SERVER_URL,
} from '../../api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  BreadcrumbItem,
  rootBreadcrumbItem,
  setBreadcrumbitemList,
  setFileList,
  setIsNewFolderModalVisible,
  setIsNewTextModalVisible,
  setNewFolderName,
  setUploadProgressModalOptions,
} from '../../store/reducer/homeReducer'
import { uploadFile } from '../../request/request'
import { checkResponse } from '../../util/util'
import { omit, pick } from 'lodash-es'

export default function useSetupHook() {
  const state = useAppSelector((state) => state.home)
  const dispatch = useAppDispatch()
  const [currentUploadFileList, setCurrentUploadFileList] = useState<
    UploadFile[]
  >([])
  const {
    fileList,
    breadcrumbitemList,
    isNewFolderModalVisible,
    newFolderName,
    isNewTextModalVisible,
    uploadProgressModalOptions,
  } = state
  const [newTextForm] = Form.useForm()

  const currentWorkDir = useMemo(
    () => breadcrumbitemList.at(-1)?.key ?? rootBreadcrumbItem.key,
    [breadcrumbitemList]
  )
  const getData = async () => {
    await enterFolder({ path: '' })
  }
  const enterFolder = async (
    params: { path: string },
    success?: () => void
  ) => {
    const res = await getFileList(params)
    console.log('res', res)
    if (res.code === 0) {
      message.success(res.msg)
      dispatch(setFileList(res.data))
      success?.()
    } else {
      message.error(res.msg)
    }
  }
  const refreshCurentWorkDir = async () => {
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
            name: record.name,
          },
        ])
      )
    })
  }

  const handleBreadcrumbJump = async (index: number, item: BreadcrumbItem) => {
    if (index >= breadcrumbitemList.length - 1 || index < 0) {
      return
    }
    console.log({ index, item })

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
      breadcrumbitemList.at(-2) ?? rootBreadcrumbItem
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

    const res = await createTxt({
      path: `${currentWorkDir}/${formValues.filename}.txt`,
      content: formValues.content,
    })
    checkResponse(res, {
      successCallback: () => {
        refreshCurentWorkDir()
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

  const handleCreateNewFolder = async () => {
    // const currentWorkDir = getCurrentWorkDir()
    const res = await mkdir({
      path: currentWorkDir + '/' + newFolderName,
    })
    checkResponse(res, {
      successCallback: () => {
        cancelNewFolderModal()
        dispatch(setNewFolderName(''))
        refreshCurentWorkDir()
      },
    })
  }
  const handleDeleteItem = async (record: FileItem) => {
    Modal.confirm({
      title: `确认删除${record.isFolder ? '文件夹' : '文件'}`,
      content: `${record.path}`,
      onOk: async () => {
        const res = await removeItem({
          path: record.path,
        })
        checkResponse(res, {
          successCallback: refreshCurentWorkDir,
        })
      },
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleUpoadFiles = async (file: RcFile, files: RcFile[]) => {
    await uploadFile(`${SERVER_URL}/uploadMulti`, file)
    // {
    //   onUploadProgress: (loaded, total) => {
    //     console.log(`${loaded}/${total}`)
    //   },
    //   // infoDict: {
    //   //   path: 'ceads',
    //   // },
    // })

    return false
  }
  const handleUploadChange = (info: UploadChangeParam<UploadFile<any>>) => {
    dispatch(
      setUploadProgressModalOptions({
        ...uploadProgressModalOptions,
        open: true,
      })
    )

    setCurrentUploadFileList(info.fileList)
    // dispatch(
    //   setCurrentUploadProgressList(
    //     info.fileList.map((item) => {
    //       return {
    //         ...omit(item, ['lastModifiedDate', 'originFileObj', 'xhr']),
    //       } as UploadProgressItem
    //     })
    //   )
    // )
    if (
      !info?.event &&
      info.fileList.every((item) => {
        return item.status == 'done'
      })
    ) {
      refreshCurentWorkDir()
      setTimeout(() => {
        dispatch(
          setUploadProgressModalOptions({
            ...uploadProgressModalOptions,
            open: false,
          })
        )
        setCurrentUploadFileList([])
      }, 2000)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return {
    breadcrumbitemList,
    fileList,
    isNewFolderModalVisible,
    isNewTextModalVisible,
    newFolderName,
    newTextForm,
    currentWorkDir,
    state,
    currentUploadFileList,
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
    refreshCurentWorkDir,
    handleUpoadFiles,
    handleUploadChange,
  }
}
