import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
  
      <iframe content='https://www.youtube.com/watch?v=Rf2hW_ckl380'>

      </iframe>
    </>
  )
}
