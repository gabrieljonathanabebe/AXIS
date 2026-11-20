import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The `@/` alias is defined once, in `tsconfig.app.json` (`paths`).
  resolve: { tsconfigPaths: true },
})
