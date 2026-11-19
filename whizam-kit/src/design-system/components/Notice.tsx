import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import styles from './controls.module.css'
import { renderTextContent } from './text-content'

export function Notice({
  children,
  tone = 'info',
}: {
  children: ReactNode
  tone?: 'info' | 'success' | 'error'
}) {
  return (
    <div
      className={styles.notice}
      data-design-target="notice"
      data-design-variant={tone}
      data-design-part="root"
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {renderTextContent(children)}
    </div>
  )
}

export function Panel({ children, className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={[styles.panel, className].filter(Boolean).join(' ')}
      data-design-target="panel"
      data-design-variant="default"
      data-design-part="root"
    >
      {renderTextContent(children)}
    </div>
  )
}
