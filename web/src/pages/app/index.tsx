import { Table } from 'antd'

import useSetupHook from './hooks'

export default function App() {
  const { fileList } = useSetupHook()
  const columns = []
  return (
    <div>
      <Table dataSource={fileList}></Table>
    </div>
  )
}
