import { createRootRoute, Outlet } from '@tanstack/react-router'
import React, { Suspense } from 'react'
// import NotFound from '../components/common/NotFound.tsx'

// Initialize the tanstack router and tanstack query devtools
const loadDevTools = () =>
    Promise.all([
        import("@tanstack/react-router-devtools"),
        import("@tanstack/react-query-devtools")
    ]).then(([routerDevtools, reactQueryDevtools]) => {
        return {
            default: () => (
                <>
                    <routerDevtools.TanStackRouterDevtools />
                    <reactQueryDevtools.ReactQueryDevtools />
                </>
            )
        }
    })

// Make sure the devtools are only loaded in development
const TanStackDevtools = 
    process.env.NODE_ENV === "production" 
        ? () => null
        : React.lazy(loadDevTools);


export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </>
  ),
//   notFoundComponent: () => <NotFound />,
})