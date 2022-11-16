import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  console.log('env', env)

  return {
    plugins: [
      react(),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]',
        /**
         * 自定义插入位置
         * @default: body-last
         */
        // inject: 'body-last' | 'body-first',
        /**
         * custom dom id
         * @default: __svg__icons__dom__
         */
        customDomId: '__svg__icons__dom__',
      }),
    ],
    server: {
      port: parseInt(env.VITE_PORT),
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
