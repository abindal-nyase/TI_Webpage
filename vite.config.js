import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Restrict dep scanning to project entry only — prevents try1 folder interference
  optimizeDeps: {
    entries: ["index.html"],
  },
  build: {
    outDir: "dist",
  },
  base: "/TI_Webpage/",
});
