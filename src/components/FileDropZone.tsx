import { useCallback, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '#/lib/utils'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
  disabled?: boolean
}

export default function FileDropZone({
  onFile,
  accept = '.gpx',
  disabled = false,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) onFile(file)
    },
    [onFile],
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onFile(file)
    },
    [onFile],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
      }}
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative cursor-pointer rounded-sm border-2 border-dashed p-12 text-center transition-all duration-200',
        isDragging
          ? 'border-[var(--f1-red)] bg-[var(--f1-red)]/5 scale-[1.02]'
          : 'border-border hover:border-[var(--f1-red)]/50 hover:bg-muted/30',
        disabled && 'pointer-events-none opacity-50',
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'flex size-16 items-center justify-center rounded-sm transition-colors',
            isDragging
              ? 'bg-[var(--f1-red)] text-white'
              : 'bg-muted text-muted-foreground',
          )}
        >
          <Upload className="size-7" />
        </div>
        <div>
          <p className="text-lg font-medium text-foreground font-sans">
            {isDragging ? 'Drop your GPX file here' : 'Drop a GPX file here'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground font-mono">
            or click to browse — <code className="text-xs">.gpx</code> files only
          </p>
        </div>
      </div>
    </div>
  )
}
