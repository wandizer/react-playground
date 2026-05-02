export type Direction = 'left' | 'right'
export type TransitionPhase = 'steady' | 'fading-out' | 'fading-in'

export type CarouselItem = {
  id: number
  title: string
  alt?: string
  description: string
  buttonText: string
  thumbnail: string
  cover: string
}

export type FastCarouselState = {
  coverIndex: number
  scrollerIndex: number
  isCoverReady: boolean
  isVideoReady: boolean
  isTransitioning: boolean
}

export type FastCarouselActions = {
  changeIndex: (index: number) => void
  reset: () => void
  setIsCoverReady: (isReady: boolean) => void
}

export type FastCarouselStore = FastCarouselState & FastCarouselActions
