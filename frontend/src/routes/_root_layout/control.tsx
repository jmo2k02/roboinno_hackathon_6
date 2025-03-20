import { getControlApiV1RobotGetControlPostMutation } from '@/client/@tanstack/react-query.gen'
import { Simulator } from '@/components/simulator/simulator'
import { useMutation} from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_root_layout/control')({
  component: RouteComponent,
})

function RouteComponent() {
    const [shouldReloadIframe, setShouldReloadIframe] = useState(false)

    const mutation = useMutation({
        ...getControlApiV1RobotGetControlPostMutation()
    })

    useEffect(() => {

        console.log("Doing call...")

        mutation.mutate({
            query: {
                token: "test"
            }
        })
        // Set to true when the component mounts
        setShouldReloadIframe(true)
      }, [])

    
  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Main Content */}
    <main className="flex-1 p-6 flex flex-col gap-6">
        <Simulator shouldReloadIframe={shouldReloadIframe} setShouldReloadIframe={setShouldReloadIframe} reloadTime={2}/>
        </main>
        </div>
  )
}
