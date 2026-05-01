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
