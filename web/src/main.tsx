import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { globalRouter } from './router/routeList'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={globalRouter} />
  </React.StrictMode>
)
