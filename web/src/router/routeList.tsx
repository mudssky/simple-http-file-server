import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
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
