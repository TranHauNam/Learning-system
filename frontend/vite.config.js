// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 👉 Thay đổi số port tại đây (VD: 3000, 4000, 5174...)
    host: 'localhost' // hoặc '0.0.0.0' nếu muốn truy cập từ máy khác trong mạng LAN
  }
})
