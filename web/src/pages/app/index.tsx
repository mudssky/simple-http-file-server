import { Breadcrumb, Button, Form, Input, Modal, Space, Table } from 'antd'
import { filesizeFomatter, path } from '../../util/util'
import FileIcon from '../../components/fileIcon'

import useSetupHook from './hooks'

import dayjs from 'dayjs'
import { FileItem } from '../../api'

export default function App() {
  const {
    breadcrumbitemList,
    fileList,
    isNewFolderModalVisible,
    cancelNewFolderModal,
    showNewFolderModal,
    handleFileClick,
    handleBreadcrumbJump,
    handleBackToParent,
  } = useSetupHook()
  const columns = [
    {
      title: '文件名',
      dataIndex: 'name',
      render: (text: any, record: any, index: number) => {
        return (
          <div>
            <Space>
              <FileIcon
                ext={path.extname(record.name ?? '')}
                isFolder={record.isFolder}
              ></FileIcon>
              <Button type="link" onClick={() => handleFileClick(record)}>
                {text}
              </Button>
            </Space>
          </div>
        )
      },
      sorter: (a: FileItem, b: FileItem) => {
        return a.name.localeCompare(b.name)
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (text: any, record: any, index: number) => {
        return filesizeFomatter(text)
      },
      sorter: (a: FileItem, b: FileItem) => {
        return a.size - b.size
      },
    },
    {
      title: '修改时间',
      dataIndex: 'lastModTime',
      render: (text: any, record: any, index: number) => {
        return dayjs(text).format('YYYY-MM-DD hh:mm:ss')
      },
      sorter: (a: FileItem, b: FileItem) => {
        return a.lastModTime - b.lastModTime
      },
    },
    {
      title: '操作',
      render: (text: any, record: any, index: number) => {
        return <span> text</span>
      },
    },
  ]
  return (
    <div>
      <div className="mx-auto w-3/4 min-w-[800px]">
        <div className="py-1">
          <Space>
            <Button onClick={showNewFolderModal}>新建目录</Button>
          </Space>
        </div>
        <Breadcrumb>
          <Breadcrumb.Item separator="|" onClick={handleBackToParent}>
            <span className="text-blue-500">返回上一层</span>
            <span className="p-1 text-black">|</span>
          </Breadcrumb.Item>
          {breadcrumbitemList.map((item, index) => {
            return (
              <Breadcrumb.Item
                key={item.key}
                onClick={() => handleBreadcrumbJump(index, item)}
              >
                {item.name}
              </Breadcrumb.Item>
            )
          })}
        </Breadcrumb>
        <Table
          dataSource={fileList}
          columns={columns}
          pagination={false}
          rowKey="name"
        ></Table>
      </div>
      <Modal
        title="新建目录"
        visible={isNewFolderModalVisible}
        onCancel={cancelNewFolderModal}
      >
        <Input placeholder="请输入目录名称"></Input>
      </Modal>
    </div>
  )
}
