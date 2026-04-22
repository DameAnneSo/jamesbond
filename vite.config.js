import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
  build: { outDir: 'public' },
  base: './',
  plugins: [dsv(), svelte({})],
  server: {
    port: 5000
  }
})
