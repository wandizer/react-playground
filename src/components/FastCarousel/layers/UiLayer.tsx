import classNames from 'classnames'
import type { JSX } from 'react'
import { TRANSITION_DURATION } from '../store/useFastCarousel'

type UiLayerProps = {
  title: string
  description: string
  buttonText: string
}

const style = { transitionDuration: `${TRANSITION_DURATION}ms` }

export function UiLayer({
  title,
  description,
  buttonText,
}: UiLayerProps): JSX.Element {
  return (
    <div
      className={classNames(
        'w-full h-[calc(100vw/16*9*0.7)] z-20 flex flex-col items-start justify-end p-12 gap-4',
        'transition-opacity ease-linear',
      )}
      style={style}
    >
      <h1 className="text-white text-5xl">{title}</h1>
      <p className="text-white text-lg max-w-2xl">{description}</p>
      <button className="bg-white/80 hover:bg-white text-black font-bold py-2 px-4 rounded">
        {buttonText}
      </button>
    </div>
  )
}
