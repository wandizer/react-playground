import { useState, type JSX, type MouseEvent } from 'react'
import ModalVideo from './ModalVideo'
import VideoEmbedded from './VideoEmbedded'

type VideoCardProps = {
  id: string
  videoId: string
  isActive?: boolean
  onClickActivate?: (event: MouseEvent) => void
}

export function VideoCard({
  id,
  videoId,
  isActive = true,
  onClickActivate,
}: VideoCardProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div
      id={id}
      className="w-full aspect-video bg-gray-200 rounded-lg shadow-lg overflow-clip flex items-center justify-center relative"
    >
      {isActive ? (
        <>
          {/* Corner button with gradient to open modal */}
          <div
            className="absolute top-2 right-2 z-10 px-2 py-1 bg-linear-to-r from-blue-500 to-purple-500 text-white rounded cursor-pointer text-sm opacity-90 hover:opacity-100 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            Open in Modal
          </div>
          <div className="absolute top-0 right-0 w-64 h-28 bg-linear-to-bl from-black to-50% to-transparent pointer-events-none" />

          {isModalOpen && (
            <div className="absolute inset-0 z-20 bg-black bg-opacity-50" />
          )}

          <VideoEmbedded isActive={!isModalOpen} videoId={videoId} />
        </>
      ) : (
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded"
          onClick={onClickActivate}
        >
          Activate card {videoId}
        </button>
      )}
      {isModalOpen && (
        <ModalVideo onClose={handleCloseModal} videoId={videoId} />
      )}
    </div>
  )
}
