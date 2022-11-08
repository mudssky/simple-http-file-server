import { message } from 'antd'
import { useEffect, useState } from 'react'
import { FileItem, getFileList } from '../../api'

export default function useSetupHook() {
  const [fileList, setFileList] = useState<FileItem[]>([])
  const getData = async () => {
    const res = await getFileList()
    console.log('res', res)
    if (res.code === 0) {
      message.success(res.msg)
      setFileList(res.data)
    } else {
      message.error(res.msg)
    }
  }
  useEffect(() => {
    getData()
    return () => {}
  }, [])
  return {
    fileList,
  }
}
