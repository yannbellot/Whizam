import { Children, Fragment, isValidElement, type ReactNode } from 'react'

// A stable element makes direct text inspectable without the editor mutating
// React-owned DOM. Existing elements keep their own structure and semantics.
export function renderTextContent(children: ReactNode): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number' || typeof child === 'bigint')
      return <span data-loomata-text="">{child}</span>
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment)
      return <Fragment>{renderTextContent(child.props.children)}</Fragment>
    return child
  })
}
