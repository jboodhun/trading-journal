import { useId } from 'react'
import clsx from 'clsx'

type NativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'id' | 'className'
>

export interface InputProps extends NativeInputProps {
  /** Controlled value. */
  value: string
  /** Called with the next string value on every change. */
  onChange: (value: string) => void
  /** Optional label rendered above the input. */
  label?: string
  /** Helper text rendered below the input. */
  description?: string
  /** Validation message; when set, the field is styled as invalid. */
  error?: string
  /** Extra class names applied to the field wrapper. */
  className?: string
  /** Explicit id; a unique one is generated when omitted. */
  id?: string
}

/**
 * Reusable controlled text input with label, description and error support.
 * Native validation props (`required`, `minLength`, `maxLength`, `type`, …)
 * are forwarded straight to the underlying `<input>`.
 */
export function Input({
  value,
  onChange,
  label,
  description,
  error,
  className,
  id,
  required,
  ...rest
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined

  return (
    <div className={clsx('field', className)}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {required && (
            <span className="field-required" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      <input
        id={inputId}
        className="input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={clsx(descriptionId, errorId) || undefined}
        {...rest}
      />
      {description && (
        <span id={descriptionId} className="field-desc">
          {description}
        </span>
      )}
      {error && (
        <span id={errorId} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
