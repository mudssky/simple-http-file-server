import { Link } from 'react-router-dom'
// 404 page
export function NotFound() {
  return (
    <div className='bg-slate-700 h-screen flex items-center justify-center'>
      <div>
        <div className='text-white text-4xl'>404</div>
        <Link to={'/'} className='text-white'>
          返回首页
        </Link>
      </div>
    </div>
  )
}
