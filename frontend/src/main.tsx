import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import './styles.css'
import { client } from './client/client.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      
    }
  }
})

client.setConfig({
    baseURL: 'http://localhost:8000',
})
client.instance.interceptors.request.use(config => {
    config.headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
    return config
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </React.StrictMode>,
)