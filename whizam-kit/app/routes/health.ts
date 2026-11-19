import { getHealth } from '../server/runtime.server'

export function loader() {
  return Response.json(getHealth(), { headers: { 'Cache-Control': 'no-store' } })
}
