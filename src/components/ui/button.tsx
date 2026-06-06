type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`.trim()} type="button" {...props} />
}
