import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import './index.css'
import { globalRouter } from './router/routeList'
moment.locale('zh-cn')
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={globalRouter} />
    </ConfigProvider>
  </React.StrictMode>
)
