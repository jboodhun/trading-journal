interface PageHeaderProps {
  title: string
  subtitle: string
  children?: React.ReactNode
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <header className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        <p className="page-sub">{subtitle}</p>
      </div>
      {children}
    </header>
  )
}
