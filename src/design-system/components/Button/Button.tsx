import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useButton } from 'react-aria/useButton'
import { mergeProps } from 'react-aria/mergeProps'
import { renderTextContent } from '../text-content'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  children: ReactNode
}

export function Button({
  children,
  className,
  type = 'button',
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton({ type, isDisabled: disabled || loading }, ref)
  const classes = [
    'project:border-0 project:cursor-pointer project:token-root-background-default project:token-root-foreground-default project:token-root-border-radius-default project:token-root-padding-block-default project:token-root-padding-inline-default project:token-root-font-size-default project:token-root-font-weight-default project:token-root-line-height-default project:token-root-font-family-default project:hover:token-root-background-hover project:focus-visible:outline-solid project:focus-visible:token-root-ring-color-focus-visible project:focus-visible:token-root-ring-width-focus-visible project:focus-visible:token-root-ring-offset-focus-visible project:disabled:cursor-not-allowed project:disabled:token-root-background-disabled project:disabled:aria-busy:cursor-progress project:disabled:aria-busy:token-root-background-loading',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={classes}
      {...mergeProps(buttonProps, props)}
      ref={ref}
      data-design-target="button"
      data-design-variant="default"
      data-design-part="root"
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {renderTextContent(loading ? 'Enregistrement…' : children)}
    </button>
  )
}
