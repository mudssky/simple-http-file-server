import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode, ssrBuild }) => {
  const baseConfig = {
    plugins: [react()],
  }
  if (mode == 'development') {
    return {
      ...baseConfig,
      server: {
        port: 5001,
      },
    }
  } else {
    return {
      ...baseConfig,
    }
  }
})
