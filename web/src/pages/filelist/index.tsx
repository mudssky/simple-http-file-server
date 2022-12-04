import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Progress,
  Space,
  Table,
  Upload,
} from 'antd'
import { filesizeFomatter, path } from '../../util/util'
import FileIcon from '../../components/fileIcon'
import {
  ArrowDownOutlined,
  DeleteTwoTone,
  EditOutlined,
} from '@ant-design/icons'
import useSetupHook from './hooks'
import dayjs from 'dayjs'
import { FileItem, SERVER_URL } from '../../api'
import { ColumnsType } from 'antd/es/table'
import { useAppDispatch } from '../../store/hooks'
import { setRenameModalOptionsAction } from '../../store/reducer/homeReducer'

export default function FileList() {
  const dispatch = useAppDispatch()
  const {
    breadcrumbitemList,
    fileList,
    isNewFolderModalVisible,
    isNewTextModalVisible,
    newFolderName,
    newTextForm,
    currentWorkDir,
    state,
    currentUploadFileList,
    showRenameModal,
    handleNewNameChange,
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
    handleRenameSubmit,
  } = useSetupHook()
  const { uploadProgressModalOptions, renameModalOptions, newName } = state
  const columns: ColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'name',
      render: (value: unknown, record: FileItem) => {
        return (
          <div>
            <Space>
              <FileIcon
                ext={path.extname(record.name ?? '')}
                isFolder={record.isFolder}
              ></FileIcon>
              <Button type="link" onClick={() => handleFileClick(record)}>
                {value as string}
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
      render: (value: number) => {
        return filesizeFomatter(value)
      },
      sorter: (a: FileItem, b: FileItem) => {
        return a.size - b.size
      },
    },
    {
      title: '修改时间',
      dataIndex: 'lastModTime',
      render: (value: string) => {
        return dayjs(value).format('YYYY-MM-DD hh:mm:ss')
      },
      sorter: (a: FileItem, b: FileItem) => {
        return a.lastModTime - b.lastModTime
      },
    },
    {
      title: '操作',
      render: (value: unknown, record: FileItem) => {
        return (
          <div>
            {currentWorkDir !== '' ? (
              <Space>
                <ArrowDownOutlined className="cursor-pointer text-xl text-green-500" />
                <DeleteTwoTone
                  twoToneColor={'#ff0000'}
                  className="cursor-pointer text-xl"
                  onClick={() => handleDeleteItem(record)}
                />
                <EditOutlined
                  className="cursor-pointer text-xl text-blue-500"
                  onClick={() => showRenameModal(record)}
                />
              </Space>
            ) : null}
          </div>
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
                fileList={currentUploadFileList}
                onChange={handleUploadChange}
              >
                <Button>上传文件</Button>
              </Upload>
            </Space>
          ) : null}
        </div>
        <Space className="mb-3">
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
        title="重命名"
        {...renameModalOptions}
        onCancel={() =>
          dispatch(
            setRenameModalOptionsAction({
              ...renameModalOptions,
              open: false,
            })
          )
        }
        onOk={handleRenameSubmit}
      >
        <Input
          placeholder="请输入"
          value={newName}
          onChange={handleNewNameChange}
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
      <Modal title="上传文件" {...uploadProgressModalOptions} footer={null}>
        {currentUploadFileList.map((item) => {
          return (
            <div key={item.uid}>
              <div>
                <Space>
                  <span>{item.name}</span>
                  <span>{filesizeFomatter(item.size ?? 0)}</span>
                  {/* <span>{dayjs(item.lastModified).format()}</span> */}
                </Space>
              </div>
              <div>
                <Progress
                  percent={Math.round(item.percent ?? 0)}
                  status={item.status === 'error' ? 'exception' : 'normal'}
                />
              </div>
            </div>
          )
        })}
      </Modal>
    </div>
  )
}
