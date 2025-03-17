import { createFileRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout')({
  component: () => 
    <>
      <div>This is The root layout</div>
      <Link
        to={'/'}
      >
        <button>Go to home</button>
      </Link>
      <Link
        to={'/about'}
      >
        <button>Go to /about</button>
      </Link>
      <Outlet />
    </>
})