import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import 'antd/dist/antd.css'
import './index.css'
import { globalRouter } from './router/routeList'
import 'virtual:svg-icons-register'

moment.locale('zh-cn')

ConfigProvider.config({
  prefixCls: 'ant',
})
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={globalRouter} />
    </ConfigProvider>
  </React.StrictMode>
)
