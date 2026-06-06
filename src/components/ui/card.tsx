/* eslint-disable react-refresh/only-export-components */
type CardProps = React.HTMLAttributes<HTMLDivElement>

function Root({ className = '', ...props }: CardProps) {
  return <section className={`card ${className}`.trim()} {...props} />
}

function Header({ className = '', ...props }: CardProps) {
  return <div className={`card-header ${className}`.trim()} {...props} />
}

function Content({ className = '', ...props }: CardProps) {
  return <div className={`card-content ${className}`.trim()} {...props} />
}

export const Card = {
  Root,
  Header,
  Content,
}
