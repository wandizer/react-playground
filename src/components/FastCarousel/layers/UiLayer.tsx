import classNames from 'classnames'
import type { JSX } from 'react'
import { useFastCarouselContext } from '../store/useFastCarouselContext.ts'

export function UiLayer(): JSX.Element {
  const title = useFastCarouselContext((state) => {
    return state.items[state.indexDisplay].title
  })
  const description = useFastCarouselContext(
    (state) => state.items[state.indexDisplay].description,
  )
  const buttonText = useFastCarouselContext(
    (state) => state.items[state.indexDisplay].buttonText,
  )

  return (
    <div
      className={classNames(
        'w-full h-[calc(100vw/16*9*0.7)] z-20 flex flex-col items-start justify-end p-12 gap-4',
        'transition-opacity ease-linear duration-500',
      )}
    >
      <h1 className="text-white text-5xl">{title}</h1>
      <p className="text-white text-lg max-w-2xl">{description}</p>
      <button className="bg-white/80 hover:bg-white text-black font-bold py-2 px-4 rounded">
        {buttonText}
      </button>
    </div>
  )
}
