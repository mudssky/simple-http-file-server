import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'antd/locale/zh_CN'
import 'antd/dist/reset.css'
// 全局css
import './index.css'
import './style/scss/common.scss'
// 全局路由
import { globalRouter } from './router/routeList'
// 导入svg配置
import 'virtual:svg-icons-register'
// redux配置
import { Provider } from 'react-redux'
import { store } from './store/store'

dayjs.locale('zh-cn')

ConfigProvider.config({
  prefixCls: 'ant',
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={globalRouter} />
    </ConfigProvider>
  </Provider>
  // </React.StrictMode>
)
