import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const baseConfig = {
    plugins: [react()],
  }

  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  console.log('env', env)

  return {
    plugins: [react()],
    server: {
      port: env.VITE_PORT,
    },
  }
  // if (mode == 'development') {
  //   return {
  //     ...baseConfig,
  //     // server: {
  //     //   port: 5001,
  //     // },
  //   }
  // } else {
  //   return {
  //     ...baseConfig,
  //   }
  // }
})
