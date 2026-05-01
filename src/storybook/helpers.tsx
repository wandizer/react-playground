import type { JSX, ReactNode } from 'react'

export const LabeledComponent = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}): JSX.Element => (
  <div className="flex flex-col gap-2">
    {children}
    <label className="w-full text-center text-gray-500">{label}</label>
  </div>
)
