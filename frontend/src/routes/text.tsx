import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { returnListApiV1HealthTestListGetOptions } from '../client/@tanstack/react-query.gen'

export const Route = createFileRoute('/text')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, error, isLoading } = useQuery({
    ...returnListApiV1HealthTestListGetOptions({
      query: {
        token: 'str'
      }
    })
  })
  return (
    <>
      <h1>Hello</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        JSON.stringify(data)
      )
    
    }
    </>
  )
}
