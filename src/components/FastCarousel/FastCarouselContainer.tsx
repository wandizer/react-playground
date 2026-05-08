import FastCarousel from './FastCarousel.tsx'
import { FastCarouselProvider } from './store/context.tsx'
import type { CarouselItem } from './store/types.ts'

const data: CarouselItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `Item ${i + 1}`,
  alt: `Alt ${i + 1}`,
  description:
    i % 2 === 0
      ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      : `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse`,
  buttonText: i % 2 === 0 ? 'Read more' : 'Watch now',
  thumbnail: `https://picsum.photos/id/${i + 10}/640/480`,
  cover: `https://picsum.photos/id/${i + 10}/1920/1080`,
}))

export function FastCarouselContainer() {
  return (
    <FastCarouselProvider items={data}>
      <FastCarousel />
    </FastCarouselProvider>
  )
}
