import { message } from 'antd'
import { useEffect } from 'react'
import { FileItem, getFileList } from '../../api'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  BreadcrumbItem,
  rootBreadcrumbItem,
  setBreadcrumbitemList,
  setFileList,
  setIsNewFolderModalVisible,
} from '../../store/reducer/homeReducer'

export default function useSetupHook() {
  const state = useAppSelector((state) => state.home)
  const dispatch = useAppDispatch()
  const { fileList, breadcrumbitemList, isNewFolderModalVisible } = state

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
  useEffect(() => {
    getData()
    return () => {}
  }, [])
  return {
    breadcrumbitemList,
    fileList,
    isNewFolderModalVisible,
    handleFileClick,
    handleBreadcrumbJump,
    handleBackToParent,
    showNewFolderModal,
    cancelNewFolderModal,
  }
}
