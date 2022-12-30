import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../layout/appLayout'
import FileList from '../pages/filelist'
import Hello from '../pages/hello'
import { NotFound } from '../pages/not-found'
import Play from '../pages/play'

export const globalRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
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
        element: <FileList />,
      },
      {
        path: 'play',
        element: <Play />,
      },
      {
        path: 'hello',
        element: <Hello />,
      },
    ],
  },
  // 404页面配置
  {
    path: '*',
    element: <NotFound />,
  },
])
