import { useEffect, type ReactNode } from 'react'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  useRouteLoaderData,
  type LoaderFunctionArgs,
} from 'react-router'
import '../src/styles/tokens.generated.css'
import '../src/styles/global.css'
import '../src/styles/project.css'
import { bindInterface } from '../src/core/interface-binding'
import { bindContextualStyles } from '../src/core/contextual-style-render'

export const meta = () => [{ title: 'Application' }, { name: 'description', content: '' }]

export async function loader({ request }: LoaderFunctionArgs) {
  const { readInterfaceView } = await import('./server/interface.server')
  const interfaceView = await readInterfaceView(process.cwd(), new URL(request.url).pathname)
  return { interfaceView }
}
export const shouldRevalidate = () => true
export function Layout({ children }: { children: ReactNode }) {
  const data = useRouteLoaderData<typeof loader>('root')
  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {data?.interfaceView && (
          <meta name="loomata-interface-revision" content={data.interfaceView.revision} />
        )}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  const data = useRouteLoaderData<typeof loader>('root')
  useEffect(() => bindInterface(document, data?.interfaceView ?? null), [data?.interfaceView])
  useEffect(
    () => bindContextualStyles(document, data?.interfaceView?.contextualStyles ?? []),
    [data?.interfaceView],
  )
  useEffect(() => {
    const reload = () => {
      location.reload()
    }
    import.meta.hot?.on('adl:design-generation', reload)
    import.meta.hot?.on('loomata:interface-generation', reload)
    return () => {
      import.meta.hot?.off('adl:design-generation', reload)
      import.meta.hot?.off('loomata:interface-generation', reload)
    }
  }, [])
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const missing = isRouteErrorResponse(error) && error.status === 404

  return (
    <main>
      <h1>{missing ? 'Page introuvable' : 'Une erreur est survenue'}</h1>
      <p>
        <a href="/">Revenir à l’accueil</a>
      </p>
    </main>
  )
}
