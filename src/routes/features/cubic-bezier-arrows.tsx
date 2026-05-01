import { createFileRoute } from '@tanstack/react-router'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { Container } from '../../components/Ui/Container.tsx'
import { drawDynamicCurvedArrow } from '../../helpers/cubic-bezier-arrows'

export const Route = createFileRoute('/features/cubic-bezier-arrows')({
  ssr: false,
  component: CubicBezierArrows,
})

const BaseSVG = (
  <svg
    id="arrowSvg"
    className="absolute inset-0 pointer-events-none overflow-visible"
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="white" />
      </marker>
    </defs>
  </svg>
)

function Box({
  id,
  top = 0,
  left = 0,
  label,
}: {
  id: string
  top?: number
  left?: number
  label?: string
}) {
  return (
    <div
      id={id}
      style={{ top, left }}
      className={classNames(
        'w-32 h-32 bg-primary absolute rounded-lg',
        'bg-linear-to-r from-blue-500 to-purple-500',
        'p-2 text-white',
      )}
    >
      <span className="z-10">{label}</span>
    </div>
  )
}

// 12 by 12 grid
const INITIAL_GRID = [
  { x: 6, y: 0, label: 'Top' },
  { x: 1, y: 5, label: 'Left' },
  { x: 10, y: 5, label: 'Right' },
  { x: 4, y: 10, label: 'Bottom' },
]

const BOX_SIZE = 128

const createRandomGrid = () => {
  const grid = []
  for (let i = 0; i < 4; i++) {
    grid.push({
      x: Math.floor(Math.random() * 12),
      y: Math.floor(Math.random() * 12),
      label: `Box${i + 1}`,
    })
  }
  return grid
}

const cleanupSVG = () => {
  // Cleanup paths and text elements
  const svg = document.getElementById('arrowSvg')
  if (!svg) return
  const paths = svg.querySelectorAll('path')
  const texts = svg.querySelectorAll('text')
  paths.forEach((path) => path.remove())
  texts.forEach((text) => text.remove())
  const rects = svg.querySelectorAll('rect')
  rects.forEach((rect) => rect.remove())
}

function CubicBezierArrows() {
  const gridRef = useRef<HTMLDivElement | null>(null)
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [grid, setGrid] = useState(INITIAL_GRID)
  const [{ width, height }, setContainerWidth] = useState({
    width: windowWidth,
    height: windowHeight,
  })

  // Measure container dimensions on mount and window resize
  useEffect(() => {
    if (!gridRef.current) return
    const { width, height } = gridRef.current.getBoundingClientRect()
    setContainerWidth({ width, height })
  }, [windowWidth, windowHeight])

  // Draw arrows after dimensions are set and layout is updated
  useEffect(() => {
    cleanupSVG()
    grid.forEach(({ label }) => {
      drawDynamicCurvedArrow(
        '#box-Center',
        `#box-${label}`,
        undefined,
        'auto',
        label,
      )
    })
    return () => {
      cleanupSVG()
    }
  }, [grid, width, height])

  return (
    <Container className="h-[calc(80vh)]">
      <div ref={gridRef} id="grid" className="h-full w-full relative">
        {/* Absolute button to top right that randomizes the points of grid array */}
        <button
          onClick={() => {
            const newGrid = createRandomGrid()
            setGrid(newGrid)
          }}
          className="absolute top-4 right-4 z-20 px-4 py-2 bg-white text-black rounded-lg shadow-lg"
        >
          Randomize
        </button>

        {/* Centered Box */}
        <Box
          id="box-Center"
          label="Center"
          top={height / 2 - BOX_SIZE / 2}
          left={width / 2 - BOX_SIZE / 2}
        />

        {grid.map(({ x, y, label }) => (
          <Box
            key={`box-${label}`}
            id={`box-${label}`}
            label={label}
            top={(y / 12) * height} // Center the box vertically
            left={(x / 12) * width}
          />
        ))}
        {BaseSVG}
      </div>
    </Container>
  )
}
