import { useCallback, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@astryxdesign/core/Button'
import { HStack } from '@astryxdesign/core/HStack'
import { Icon } from '@astryxdesign/core/Icon'
import { Text } from '@astryxdesign/core/Text'
import { VStack } from '@astryxdesign/core/VStack'

interface FileDropZoneProps {
  onFile: (file: File) => void
  accept?: string
  disabled?: boolean
}

export default function FileDropZone({ onFile, accept = '.gpx', disabled = false }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragging(false)
    if (!disabled && event.dataTransfer.files[0]) onFile(event.dataTransfer.files[0])
  }, [disabled, onFile])

  return (
    <section
      className={`pit-dropzone ${isDragging ? 'pit-dropzone-active' : ''}`}
      onDragOver={(event) => { event.preventDefault(); if (!disabled) setIsDragging(true) }}
      onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }}
      onDrop={handleDrop}
      aria-label="GPX file drop area"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        tabIndex={-1}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
        disabled={disabled}
        aria-label="Choose a GPX file"
      />
      <VStack gap={6}>
        <VStack gap={2}>
          <Text type="display-3" display="block">Your route starts here.</Text>
          <Text type="body" color="secondary" display="block">
            Drop a GPX file to review your route, pace and sector performance. Your file stays in this browser.
          </Text>
        </VStack>
        <HStack gap={4} vAlign="center" wrap="wrap">
          <Button
            label="Choose GPX file"
            variant="primary"
            icon={<Icon icon="upload" size="sm" />}
            onClick={() => inputRef.current?.click()}
            isDisabled={disabled}
          />
          <Text type="supporting">or drop it anywhere in this panel <Icon icon={ArrowUpRight} size="xsm" /></Text>
        </HStack>
      </VStack>
    </section>
  )
}
