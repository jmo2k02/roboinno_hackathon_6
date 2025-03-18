import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://127.0.0.1:8000/api/openapi.json',
  output: {
    path: 'src/client',
    format: 'biome',
  },
  plugins: ['@tanstack/react-query', '@hey-api/client-axios'],
})