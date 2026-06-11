import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon } from 'components/icons'

type BreadcrumbItem = {
  label: string
  href?: string
  active?: boolean
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const navigate = useNavigate()

  return (
    <div className="breadcrumb">
      {items.map((item, index) => (
        <Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <span>/</span> : null}
          {item.href ? (
            <button className="breadcrumb-link" onClick={() => item.href && navigate(item.href)} type="button">
              {index === 0 ? <ChevronLeftIcon /> : null}
              {item.label}
            </button>
          ) : (
            <span className={item.active ? 'breadcrumb-current' : ''}>{item.label}</span>
          )}
        </Fragment>
      ))}
    </div>
  )
}
