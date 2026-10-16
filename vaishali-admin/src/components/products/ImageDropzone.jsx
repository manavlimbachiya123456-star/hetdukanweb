import { useRef, useState } from 'react'

function ImageDropzone({ images, onChange, max = 5 }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    const combined = [...images, ...incoming].slice(0, max)
    onChange(combined)
  }

  const removeAt = (index) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`
          cursor-pointer rounded-xl2 border-2 border-dashed px-4 py-8 sm:py-10 text-center
          transition-colors
          ${dragging ? 'border-sage bg-sage/5' : 'border-black/15 hover:border-sage/60 hover:bg-stone/30'}
        `}
      >
        <p className="text-2xl mb-2">🧵</p>
        <p className="text-sm text-ink">
          <span className="text-sage font-medium">Tap to upload</span> or drag photos here
        </p>
        <p className="text-xs text-muted mt-1">Up to {max} images · JPG or PNG</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {images.map((file, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-stone group">
              <img
                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeAt(i) }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-ink/70 text-ivory text-xs flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-90 transition-opacity"
                aria-label="Remove image"
              >
                ✕
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-sage-dark text-ivory px-1.5 py-0.5 rounded-sm">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageDropzone
