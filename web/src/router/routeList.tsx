import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layout/appLayout'
import FileList from '../pages/filelist'
import Hello from '../pages/hello'
import { NotFound } from '../pages/not-found'

export const globalRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout></AppLayout>,
    // 是报错时显示的页面，找不到路由的情况也会显示
    // errorElement: <NotFound></NotFound>,
    children: [
      {
        // index路由是outlet路由匹配但是没有组件默认显示的路由
        index: true,
        element: <FileList />,
      },
      {
        path: 'home',
        element: <FileList></FileList>,
      },
      {
        path: '/hello',
        element: <Hello></Hello>,
      },
    ],
  },
  // 404页面配置
  {
    path: '*',
    element: <NotFound></NotFound>,
  },
])
