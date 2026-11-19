import { index, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('imported/:definitionId', 'routes/imported-page.tsx'),
  route('health', 'routes/health.ts'),
] satisfies RouteConfig
