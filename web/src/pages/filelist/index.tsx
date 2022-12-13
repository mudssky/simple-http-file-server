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
import { encodeURLAll, filesizeFormatter, isImage, path } from '../../util/util'
import FileIcon from '../../components/fileIcon'
import {
  ArrowDownOutlined,
  DeleteTwoTone,
  EditOutlined,
  PictureOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import useSetupHook from './hooks'
import dayjs from 'dayjs'
import { FileItem, PROXY_SUFFIX } from '../../api'
import { ColumnsType } from 'antd/es/table'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import {
  setPhotoPreviewOptionsAction,
  setRenameModalOptionsAction,
} from '../../store/reducer/homeReducer'
import { getServerStaticUrl, STATIC_SERVER_PREFIX } from '../../config'
import CustomPhotoViewer from '../../components/customPhotoView'
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
    refreshCurentWorkDir,
    handleUploadChange,
    handleRenameSubmit,
    handleDownloadItem,
    handleSinglePicPreview,
    handleGalleryMode,
  } = useSetupHook()
  const {
    uploadProgressModalOptions,
    renameModalOptions,
    newName,
    previewList,
    isTableLoading,
    photoPreviewOptions,
  } = state
  const { serverInfo } = useAppSelector((state) => state.server)

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
              />
              {record.isFolder ? (
                <span
                  className="btn-link"
                  onClick={() => handleFileClick(record)}
                >
                  {value as string}
                </span>
              ) : (
                <a
                  href={`${STATIC_SERVER_PREFIX}${encodeURLAll(record.link)}`}
                  target="_blank"
                  rel="noreferrer"
                >
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
      responsive: ['lg', 'md'],
    },
    {
      title: '操作',
      fixed: 'right',
      render: (value: unknown, record: FileItem) => {
        return (
          <div>
            {currentWorkDir !== '' ? (
              <Space wrap={true}>
                {!record.isFolder ? (
                  <Popover
                    overlayClassName="w-[150px]"
                    content={
                      <Row justify={'center'}>
                        <QRCodeSVG
                          value={`http://${serverInfo.localIpList?.[1]}:${
                            serverInfo.port
                          }${getServerStaticUrl(record.link)}`}
                        />
                      </Row>
                    }
                    title="扫码访问"
                  >
                    <QrcodeOutlined className="cursor-pointer text-xl text-black" />
                  </Popover>
                ) : null}
                {isImage(record.name) ? (
                  <Tooltip title="预览图片">
                    <PictureOutlined
                      className="cursor-pointer text-xl text-blue-400"
                      onClick={() => handleSinglePicPreview(record)}
                    />
                  </Tooltip>
                ) : null}
                <ArrowDownOutlined
                  className="cursor-pointer text-xl text-green-500"
                  onClick={() => handleDownloadItem(record)}
                />
                <DeleteTwoTone
                  twoToneColor={'#ff0000'}
                  className="cursor-pointer text-xl"
                  onClick={() => handleDeleteItem(record)}
                />
                <EditOutlined
                  className="cursor-pointer text-xl text-blue-500"
                  onClick={() => showRenameModal(record)}
                />

                {/* <ReadOutlined /> */}
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
              <Button onClick={handleGalleryMode}>相册模式</Button>
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
              defaultPageSize: 100,
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
      {/* <div style={{ display: 'none' }}> */}
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
      {/* <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: isPreviewVisible,
            onVisibleChange: hanldePreviewVisibleChange,
          }}
        >
          {previewList.map((item) => {
            return <Image key={item.src} src={item.src} />
          })}
        </Image.PreviewGroup>
      </div> */}
    </div>
  )
}
