import { createFileRoute } from '@tanstack/react-router'
import { FastCarouselContainer } from '../../components/FastCarousel/FastCarouselContainer.tsx'

export const Route = createFileRoute('/features/fast-carousel')({
  component: FastCarouselContainer,
})
