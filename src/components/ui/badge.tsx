type BadgeTone = 'green' | 'slate' | 'red' | 'blue'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone
}

export function Badge({ className = '', tone = 'slate', ...props }: BadgeProps) {
  return <span className={`badge badge-${tone} ${className}`.trim()} {...props} />
}
