import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // GitHub Pages のサブパス(/リポジトリ名/)でも動くように相対パスにする
  base: './',
  plugins: [vue()],
})
