import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from '../pages/app'
import Hello from '../pages/hello'

export const globalRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/hello',
    element: <Hello></Hello>,
  },
])
