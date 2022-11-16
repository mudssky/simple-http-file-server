import { Space, Table } from 'antd'
import { filesizeFomatter, path } from '../../util/util'
import FileIcon from '../../components/fileIcon'

import useSetupHook from './hooks'
import moment from 'moment'

export default function App() {
  const { fileList } = useSetupHook()
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
              <span> {text}</span>
            </Space>
          </div>
        )
      },
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (text: any, record: any, index: number) => {
        return filesizeFomatter(text)
      },
    },
    {
      title: '修改时间',
      dataIndex: 'lastModTime',
      render: (text: any, record: any, index: number) => {
        return moment(text).format('YYYY-MM-DD hh:mm:ss')
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
        <Table
          dataSource={fileList}
          columns={columns}
          pagination={false}
          rowKey="name"
        ></Table>
      </div>
    </div>
  )
}
// const columns = [
//   {
//     title: '文件名',
//     dataIndex: 'name',
//     onCell: (record: any) => {
//       return (
//         <div>
//           <Space>
//             <FileIcon
//               ext={path.extname(record.name ?? '')}
//               isFolder={record.isFolder}
//             ></FileIcon>
//             <span> {record.name}</span>
//           </Space>
//         </div>
//       )
//     },
//   },
//   {
//     title: '大小',
//     dataIndex: 'size',
//   },
//   {
//     title: '修改时间',
//     dataIndex: 'lastModTime',
//     onCell: (record: any) => {
//       return moment(record.lastModTime).format('YYYY-MM-DD hh:mm:ss')
//     },
//   },
//   {
//     title: '操作',
//     onCell: (record: any) => {
//       return record.name
//     },
//   },
// ]
