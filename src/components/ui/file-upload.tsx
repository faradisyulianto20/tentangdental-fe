import * as React from 'react'
import { Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  acceptedFileTypes?: string
  maxFileSizeBytes?: number
  maxFileSizeMessage?: string
  defaultImageUrl?: string
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    {
      className,
      label = 'Unggah Gambar',
      acceptedFileTypes = 'image/*',
      maxFileSizeBytes,
      maxFileSizeMessage,
      defaultImageUrl,
      ...props
    },
    ref,
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false)
    const [fileName, setFileName] = React.useState<string>('')
    const [previewUrl, setPreviewUrl] = React.useState<string>('')
    const [fileError, setFileError] = React.useState<string>('')
    const wrapperRef = React.useRef<HTMLDivElement>(null)

    const [showDefault, setShowDefault] = React.useState(true)

    const clearSelection = React.useCallback(() => {
      setFileName('')
      setPreviewUrl((currentUrl) => {
        if (currentUrl) URL.revokeObjectURL(currentUrl)
        return ''
      })
      setShowDefault(true)
    }, [])

    const validateFile = React.useCallback(
      (file: File) => {
        if (
          typeof maxFileSizeBytes === 'number' &&
          maxFileSizeBytes > 0 &&
          file.size > maxFileSizeBytes
        ) {
          clearSelection()
          setFileError(
            maxFileSizeMessage ||
              'File terlalu besar, upload file kurang dari 2MB',
          )
          return false
        }

        setFileError('')
        return true
      },
      [clearSelection, maxFileSizeBytes, maxFileSizeMessage],
    )

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragActive(true)
      } else if (e.type === 'dragleave') {
        setIsDragActive(false)
      }
    }

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (!validateFile(file)) return

        setFileName(file.name)
        setPreviewUrl(URL.createObjectURL(file))
        setShowDefault(false)

        const inputElement = wrapperRef.current?.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement
        if (inputElement) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          inputElement.files = dataTransfer.files
          inputElement.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        if (!validateFile(file)) {
          e.target.value = ''
          return
        }

        setFileName(file.name)
        setPreviewUrl(URL.createObjectURL(file))
        setShowDefault(false)
      }
      props.onChange?.(e)
    }

    React.useEffect(() => {
      return () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl)
      }
    }, [previewUrl])

    return (
      <div
        ref={wrapperRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative w-full rounded-xl border-2 border-primary/30 p-8 hover:border-primary/50 transition-colors cursor-pointer',
          isDragActive && 'border-primary/80 bg-primary/5',
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {previewUrl ? (
            <div className="relative w-full">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  clearSelection()
                }}
                className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition-colors"
                aria-label="Hapus file"
              >
                <X size={16} />
              </button>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-64 object-contain rounded-lg"
              />
              <p className="text-xs text-center text-muted-foreground mt-2">
                {fileName}
              </p>
            </div>
          ) : defaultImageUrl && showDefault ? (
            <div className="relative w-full">
              <img
                src={defaultImageUrl}
                alt="Gambar saat ini"
                className="w-full max-h-64 object-contain rounded-lg"
              />
              <p className="text-xs text-center text-muted-foreground mt-2">
                Gambar saat ini
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 border-2 border-dashed rounded-lg w-full">
              <Upload size={32} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                {label}
              </p>
            </div>
          )}
        </div>

        {/* File input */}
        <input
          ref={ref}
          type="file"
          accept={acceptedFileTypes}
          className="absolute inset-0 opacity-0 cursor-pointer"
          {...props}
          onChange={handleFileChange}
        />

        {/* Display selected file name */}
        {fileName && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-600">
              File dipilih: <span className="font-medium">{fileName}</span>
            </p>
          </div>
        )}

        {fileError ? (
          <p className="mt-2 text-xs text-destructive text-center">
            {fileError}
          </p>
        ) : null}
      </div>
    )
  },
)

FileUpload.displayName = 'FileUpload'

export { FileUpload }
