import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Upload,
} from 'antd'
import { filesizeFomatter, path } from '../../util/util'
import FileIcon from '../../components/fileIcon'
import { DeleteTwoTone } from '@ant-design/icons'
import useSetupHook from './hooks'

import dayjs from 'dayjs'
import { FileItem, SERVER_URL } from '../../api'

export default function App() {
  const {
    breadcrumbitemList,
    fileList,
    isNewFolderModalVisible,
    isNewTextModalVisible,
    newFolderName,
    newTextForm,
    currentWorkDir,
    cancelNewTextModal,
    cancelNewFolderModal,
    showNewFolderModal,
    showNewTextModal,
    handleFileClick,
    handleBreadcrumbJump,
    handleBackToParent,
    handleNewFolderNameChange,
    handleCreateNewFolder,
    handleDeleteItem,
    handleCreateNewText,
    refreshCurentWorkDir,
    handleUploadChange,
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
        return (
          <Space>
            <DeleteTwoTone
              twoToneColor={'#ff0000'}
              className="cursor-pointer text-xl "
              onClick={() => handleDeleteItem(record)}
            />
          </Space>
        )
      },
    },
  ]
  return (
    <div>
      <div className="mx-auto w-3/4 min-w-[800px]">
        <div className="py-1">
          {/* 根目录不能操作 */}
          {breadcrumbitemList.length > 1 ? (
            <Space>
              <Button onClick={showNewFolderModal}>新建目录</Button>
              <Button onClick={showNewTextModal}>新建文本</Button>
              <Upload
                action={`${SERVER_URL}/uploadMulti`}
                name="file"
                data={{
                  path: currentWorkDir,
                }}
                multiple={true}
                method="POST"
                // 不显示文件列表，当作一个普通的下载按钮使用
                showUploadList={false}
                onChange={handleUploadChange}
              >
                <Button>上传文件</Button>
              </Upload>
            </Space>
          ) : null}
        </div>
        <Space>
          <div onClick={refreshCurentWorkDir}>
            <span className="text-blue-500 cursor-pointer">刷新</span>
            <span className="p-1 text-black">|</span>
          </div>
          <div onClick={handleBackToParent}>
            <span className="text-blue-500 cursor-pointer">返回上一层</span>
            <span className="p-1 text-black">|</span>
          </div>
          <Breadcrumb>
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
        </Space>

        <Table
          dataSource={fileList}
          columns={columns}
          pagination={false}
          rowKey="name"
        ></Table>
      </div>
      <Modal
        title="新建目录"
        open={isNewFolderModalVisible}
        onCancel={cancelNewFolderModal}
        onOk={handleCreateNewFolder}
      >
        <Input
          placeholder="请输入目录名称"
          value={newFolderName}
          onChange={handleNewFolderNameChange}
        ></Input>
      </Modal>
      <Modal
        title="新建文本"
        open={isNewTextModalVisible}
        onCancel={cancelNewTextModal}
        onOk={handleCreateNewText}
      >
        <Form form={newTextForm} layout="vertical">
          <Form.Item
            label="文件名"
            name="filename"
            rules={[
              {
                required: true,
                whitespace: true,
              },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item label="内容" name="content">
            <Input.TextArea showCount rows={6}></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
      <Modal title="上传文件"></Modal>
    </div>
  )
}
