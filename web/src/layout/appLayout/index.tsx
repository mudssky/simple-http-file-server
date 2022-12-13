import { Layout } from 'antd'

import { Outlet } from 'react-router-dom'
import AppHeader from '../appHeader'
import { useSetupHook } from './hooks'

const { Header, Content } = Layout
export default function AppLayout() {
  useSetupHook()
  return (
    <Layout>
      <Header className="bg-[#0080FF]">
        <AppHeader />
      </Header>
      <Content className="bg-white">
        <Outlet />
      </Content>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  )
}
