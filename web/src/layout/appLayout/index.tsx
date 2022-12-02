import { Layout } from 'antd'

import { Outlet } from 'react-router-dom'
import AppHeader from '../appHeader'

const { Header, Content } = Layout
export default function AppLayout() {
  return (
    <Layout>
      <Header className="bg-[#0080FF]">
        <AppHeader></AppHeader>
      </Header>
      <Content className="bg-white">
        <Outlet></Outlet>
      </Content>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  )
}
