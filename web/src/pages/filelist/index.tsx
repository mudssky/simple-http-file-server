import {
  Breadcrumb,
  Button,
  Form,
  Input,
  Modal,
  Progress,
  Space,
  Table,
  Tooltip,
  Upload,
  FloatButton,
  Popover,
  Row,
} from 'antd'
import { filesizeFormatter, isImage, isMusic, isVideo, path } from '@/util/util'
import FileIcon from '@/components/fileIcon'
import {
  ArrowDownOutlined,
  DeleteTwoTone,
  EditOutlined,
  PictureOutlined,
  PlayCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import useSetupHook from './hooks'
import dayjs from 'dayjs'
import { FileItem, PROXY_SUFFIX } from '@/api/fileList'
import { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  setPhotoPreviewOptionsAction,
  setRenameModalOptionsAction,
} from '@/store/reducer/homeReducer'
import CustomPhotoViewer from '@/components/customPhotoView'
import Aplayer from '@/components/aplayer'
import { QRCodeSVG } from 'qrcode.react'

export default function FileList() {
  const dispatch = useAppDispatch()
  const {
    breadcrumbitemList,
    currentFileList,
    isNewFolderModalVisible,
    isNewTextModalVisible,
    newFolderName,
    newTextForm,
    currentWorkDir,
    state,
    currentUploadFileList,
    handleJumpPlaylist,
    getUploadFolderData,
    cancelUploadProgressModal,
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
    refreshCurrentWorkDir,
    handleUploadChange,
    handleRenameSubmit,
    handleDownloadItem,
    handleSinglePicPreview,
    handleGalleryMode,
    handleMusicMode,
  } = useSetupHook()
  const {
    uploadProgressModalOptions,
    renameModalOptions,
    newName,
    previewList,
    isTableLoading,
    photoPreviewOptions,
    musicList,
  } = state
  const { serverInfo } = useAppSelector((state) => state.server)
  const { permissionMap } = useAppSelector((state) => state.user)

  const columns: ColumnsType<FileItem> = [
    {
      title: '文件名',
      dataIndex: 'name',
      filters: [
        {
          text: '视频',
          value: '视频',
        },
        {
          text: '音乐',
          value: '音乐',
        },
        {
          text: '图片',
          value: '图片',
        },
      ],
      onFilter: (value: React.Key | boolean, record) => {
        type FileType = '视频' | '音乐' | '图片'
        switch (value as FileType) {
          case '视频':
            return isVideo(record.name)
          case '图片':
            return isImage(record.name)
          case '音乐':
            return isMusic(record.name)
          default:
            return true
        }
      },
      render: (value: unknown, record: FileItem) => {
        return (
          <div>
            <Space>
              <FileIcon
                ext={path.extname(record.name ?? '')}
                isFolder={record.isFolder}
              />
              {record.isFolder ? (
                <span
                  className="btn-link"
                  onClick={() => handleFileClick(record)}
                >
                  {value as string}
                </span>
              ) : (
                <a href={`${record.link}`} target="_blank" rel="noreferrer">
                  {value as string}
                </a>
              )}
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
        return filesizeFormatter(value)
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
      responsive: ['sm'],
    },
    {
      title: '操作',
      fixed: 'right',
      render: (value: unknown, record: FileItem) => {
        return (
          <div>
            {currentWorkDir !== '' ? (
              <Space wrap={true}>
                {!record.isFolder && permissionMap.read ? (
                  <Popover
                    overlayClassName="w-[150px]"
                    content={
                      <Row justify={'center'}>
                        <QRCodeSVG
                          value={`http://${serverInfo.localIpList?.[0]}:${serverInfo.port}${record.link}`}
                        />
                      </Row>
                    }
                    title="扫码访问"
                  >
                    <QrcodeOutlined className="cursor-pointer text-xl text-black" />
                  </Popover>
                ) : null}
                {permissionMap?.read && isImage(record.name) ? (
                  <Tooltip title="预览图片">
                    <PictureOutlined
                      className="cursor-pointer text-xl text-blue-400"
                      onClick={() => handleSinglePicPreview(record)}
                    />
                  </Tooltip>
                ) : null}
                {permissionMap?.read && isVideo(record.name) ? (
                  <Tooltip title="播放视频">
                    <PlayCircleOutlined
                      className="cursor-pointer text-xl text-blue-400"
                      onClick={() => handleJumpPlaylist(record)}
                    />
                  </Tooltip>
                ) : null}
                {permissionMap.read ? (
                  <ArrowDownOutlined
                    className="cursor-pointer text-xl text-green-500"
                    onClick={() => handleDownloadItem(record)}
                  />
                ) : null}
                {permissionMap.delete ? (
                  <DeleteTwoTone
                    twoToneColor={'#ff0000'}
                    className="cursor-pointer text-xl"
                    onClick={() => handleDeleteItem(record)}
                  />
                ) : null}
                {permissionMap.rename ? (
                  <EditOutlined
                    className="cursor-pointer text-xl text-blue-500"
                    onClick={() => showRenameModal(record)}
                  />
                ) : null}
              </Space>
            ) : null}
          </div>
        )
      },
    },
  ]
  return (
    <div>
      <div className="container w-full  md:mx-auto lg:w-3/4  ">
        <div className="py-1">
          {/* 根目录不能操作 */}
          {breadcrumbitemList.length > 1 ? (
            <Space wrap={true}>
              {permissionMap?.write ? (
                <>
                  <Button onClick={showNewFolderModal}>新建目录</Button>
                  <Button onClick={showNewTextModal}>新建文本</Button>

                  <Upload
                    action={`${PROXY_SUFFIX}/uploadMulti`}
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
                  <Upload
                    action={`${PROXY_SUFFIX}/uploadMulti`}
                    name="file"
                    data={getUploadFolderData}
                    method="POST"
                    directory={true}
                    // 不显示文件列表，当作一个普通的下载按钮使用
                    showUploadList={false}
                    fileList={currentUploadFileList}
                    onChange={handleUploadChange}
                  >
                    <Button>上传目录</Button>
                  </Upload>
                </>
              ) : null}
              {permissionMap?.read ? (
                <Button onClick={handleGalleryMode}>相册模式</Button>
              ) : null}
              {permissionMap?.read ? (
                <Button onClick={handleMusicMode}>音乐播放</Button>
              ) : null}
            </Space>
          ) : null}
        </div>
        <Space className="mb-3">
          <div onClick={refreshCurrentWorkDir}>
            <span className="text-blue-500 cursor-pointer">刷新</span>
            <span className="p-1 text-black">|</span>
          </div>
          <div onClick={handleBackToParent}>
            <span className="text-blue-500 cursor-pointer">返回上一层</span>
            <span className="p-1 text-black">|</span>
          </div>
          <Breadcrumb
            items={breadcrumbitemList.map((item, index) => {
              return {
                title: (
                  <div
                    key={item.key}
                    onClick={() => handleBreadcrumbJump(index, item)}
                  >
                    {item.title}
                  </div>
                ),
              }
            })}
          />
        </Space>
        <Aplayer className="my-2" playlist={musicList} />
        <Upload.Dragger
          openFileDialogOnClick={false}
          action={`${PROXY_SUFFIX}/uploadMulti`}
          name="file"
          data={getUploadFolderData}
          multiple={true}
          method="POST"
          directory={true}
          // 不显示文件列表，当作一个普通的下载按钮使用
          showUploadList={false}
          fileList={currentUploadFileList}
          onChange={handleUploadChange}
        >
          <Table
            className="w-full"
            dataSource={currentFileList}
            columns={columns}
            pagination={{
              defaultPageSize: 50,
              hideOnSinglePage: true,
              showTitle: true,
              showTotal: (total) => {
                return `共${total}条`
              },
            }}
            loading={isTableLoading}
            rowKey="name"
          />
        </Upload.Dragger>
        <FloatButton.BackTop />
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
        />
      </Modal>
      <Modal
        title="重命名"
        {...renameModalOptions}
        onCancel={() =>
          dispatch(
            setRenameModalOptionsAction({
              ...renameModalOptions,
              open: false,
            }),
          )
        }
        onOk={handleRenameSubmit}
      >
        <Input
          placeholder="请输入"
          value={newName}
          onChange={handleNewNameChange}
        />
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
            <Input />
          </Form.Item>
          <Form.Item label="内容" name="content">
            <Input.TextArea showCount rows={6} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="上传文件"
        {...uploadProgressModalOptions}
        footer={null}
        onCancel={cancelUploadProgressModal}
      >
        {currentUploadFileList.map((item) => {
          return (
            <div key={item.uid}>
              <div>
                <Space>
                  <span>{item.name}</span>
                  <span>{filesizeFormatter(item.size ?? 0)}</span>
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
      <CustomPhotoViewer
        images={previewList.map((item) => ({ src: item.src, key: item.src }))}
        visible={photoPreviewOptions.visible}
        onClose={() =>
          dispatch(
            setPhotoPreviewOptionsAction({
              ...photoPreviewOptions,
              visible: false,
            }),
          )
        }
        index={photoPreviewOptions.index}
        onIndexChange={(index: number) =>
          dispatch(
            setPhotoPreviewOptionsAction({
              ...photoPreviewOptions,
              index: index,
            }),
          )
        }
      />
    </div>
  )
}
