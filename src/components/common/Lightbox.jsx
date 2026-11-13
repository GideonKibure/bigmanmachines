import { useEffect } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export default function Lightbox({ title, images, index, onIndex, onClose }) {
  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onIndex((index + 1) % images.length)
      if (event.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, index, onClose, onIndex])

  const image = images[index]
  if (!image) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <button type="button" onClick={onClose} className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white" aria-label="Funga">
        <X size={18} />
      </button>
      <div className="w-full max-w-4xl">
        <img src={image} alt="" className="max-h-[78vh] w-full rounded-lg object-contain" />
        <div className="mt-3 flex items-center justify-between text-sm text-white">
          <p>{title}</p>
          {images.length > 1 && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => onIndex((index - 1 + images.length) % images.length)} className="rounded-full bg-white/10 p-2" aria-label="Picha iliyotangulia">
                <ChevronLeft size={16} />
              </button>
              <span>{index + 1} / {images.length}</span>
              <button type="button" onClick={() => onIndex((index + 1) % images.length)} className="rounded-full bg-white/10 p-2" aria-label="Picha inayofuata">
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
