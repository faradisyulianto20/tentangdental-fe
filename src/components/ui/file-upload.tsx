import * as React from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  acceptedFileTypes?: string
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  (
    { className, label = 'Unggah Gambar', acceptedFileTypes = 'image/*', ...props },
    ref
  ) => {
    const [isDragActive, setIsDragActive] = React.useState(false)
    const [fileName, setFileName] = React.useState<string>('')
    const wrapperRef = React.useRef<HTMLDivElement>(null)

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
        setFileName(file.name)
        
        // Trigger the input change event
        const inputElement = wrapperRef.current?.querySelector('input[type="file"]') as HTMLInputElement
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
        setFileName(e.target.files[0].name)
      }
      props.onChange?.(e)
    }

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
          className
        )}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {/* Dashed upload area */}
          <div className="flex flex-col items-center justify-center gap-2 py-6 px-4 border-2 border-dashed rounded-lg">
            <Upload size={32} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">{label}</p>
          </div>
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
      </div>
    )
  }
)

FileUpload.displayName = 'FileUpload'

export { FileUpload }
