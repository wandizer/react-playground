import classNames from 'classnames'
import { forwardRef, memo } from 'react'

export const HorizontalList = forwardRef<
  HTMLDivElement,
  {
    activeIndex: number
    items: { id: string; src: string }[]
  }
>(({ activeIndex, items }, ref) => {
  return (
    <div
      ref={ref}
      className="w-screen h-[calc(100vw/16*9*0.2)] overflow-x-auto z-20 px-12 py-1 no-scrollbar"
    >
      <ul className="flex flex-row flex-nowrap h-full w-fit gap-12">
        {items.map((item, index) => (
          <HorizontalListItem
            key={item.id}
            index={index}
            isActive={activeIndex === index}
            src={item.src}
          />
        ))}
      </ul>
    </div>
  )
})

export const HorizontalListItem = memo(function HorizontalListItem({
  index,
  isActive,
  src,
}: {
  index: number
  isActive: boolean
  src: string
}) {
  return (
    <li
      key={index}
      className={classNames('h-full aspect-video cursor-pointer rounded-md', {
        'ring-4 ring-white': isActive,
      })}
    >
      <img
        src={src}
        alt={`Thumbnail ${index + 1}`}
        className="w-full h-full object-cover rounded-md"
      />
    </li>
  )
})

HorizontalListItem.displayName = 'HorizontalListItem'
