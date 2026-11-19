import { useId } from 'react'
import { TextField, Label, Input, TextArea, Text, FieldError } from 'react-aria-components'
import styles from './controls.module.css'

type FieldProps = {
  name: string
  label: string
  defaultValue?: string
  error?: string
  hint?: string
  required?: boolean
  disabled?: boolean
  maxLength?: number
  multiline?: boolean
}

export function Field({ label, error, hint, multiline, disabled, required, ...props }: FieldProps) {
  const id = useId()
  const details =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
  const control = {
    id,
    required,
    maxLength: props.maxLength,
    className:
      'project:w-full project:min-w-0 project:border-solid project:token-control-background-default project:token-control-foreground-default project:token-control-border-color-default project:token-control-border-width-default project:token-control-border-radius-default project:token-control-padding-block-default project:token-control-padding-inline-default project:token-control-font-size-default project:token-control-font-weight-default project:token-control-line-height-default project:token-control-font-family-default project:focus-visible:outline-solid project:focus-visible:token-control-ring-color-focus-visible project:focus-visible:token-control-ring-width-focus-visible project:focus-visible:token-control-ring-offset-focus-visible project:disabled:cursor-not-allowed project:disabled:token-control-background-disabled project:disabled:token-control-foreground-disabled project:disabled:token-control-border-color-disabled project:disabled:token-control-border-width-disabled project:disabled:token-control-border-radius-disabled project:disabled:token-control-padding-block-disabled project:disabled:token-control-padding-inline-disabled project:disabled:token-control-font-size-disabled project:disabled:token-control-font-weight-disabled project:disabled:token-control-line-height-disabled project:disabled:token-control-font-family-disabled project:aria-invalid:token-control-border-color-error',
    'data-design-part': 'control',
    'aria-describedby': details,
  }
  return (
    <TextField
      id={id}
      name={props.name}
      defaultValue={props.defaultValue}
      isDisabled={disabled}
      isRequired={required}
      isInvalid={Boolean(error)}
      validationBehavior="aria"
      className="project:grid project:min-w-0 project:token-root-gap-default"
      data-design-target="field"
      data-design-variant={multiline ? 'multiline' : 'single-line'}
      data-design-part="root"
    >
      <Label
        htmlFor={id}
        className="project:token-label-foreground-default project:token-label-font-size-default project:token-label-font-weight-default project:token-label-line-height-default project:token-label-font-family-default"
        data-design-part="label"
      >
        {label}
        {required ? ' *' : ''}
      </Label>
      {hint && (
        <Text
          slot="description"
          id={`${id}-hint`}
          className="project:m-0 project:token-hint-foreground-default project:token-hint-font-size-default project:token-hint-font-weight-default project:token-hint-line-height-default project:token-hint-font-family-default"
          data-design-part="hint"
        >
          {hint}
        </Text>
      )}
      {multiline ? <TextArea {...control} rows={5} /> : <Input {...control} type="text" />}
      {error && (
        <FieldError
          id={`${id}-error`}
          className="project:m-0 project:token-error-foreground-default project:token-error-font-size-default project:token-error-font-weight-default project:token-error-line-height-default project:token-error-font-family-default"
          data-design-part="error"
        >
          {error}
        </FieldError>
      )}
    </TextField>
  )
}

export function SelectField({
  label,
  name,
  options,
  disabled = false,
}: {
  label: string
  name: string
  options: string[]
  disabled?: boolean
}) {
  const id = useId()
  return (
    <div
      className={styles.field}
      data-design-target="select-field"
      data-design-variant="default"
      data-design-part="root"
    >
      <label htmlFor={id} data-design-part="label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        disabled={disabled}
        className={styles.input}
        data-design-part="control"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  )
}
