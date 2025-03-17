import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.json',
  output: {
    path: 'src/client',
    format: 'biome',
  },
  plugins: ['@tanstack/react-query', '@hey-api/client-axios'],
})