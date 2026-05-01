import classNames from 'classnames'
import type { JSX } from 'react'

export function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}): JSX.Element {
  return (
    <div className={classNames('max-w-7xl mx-auto px-4', className)}>
      {children}
    </div>
  )
}
