import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { Paperclip, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type MessageInputProps = {
  readonly onSend: (body: string, file: File | null) => void | Promise<void>
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [input, setInput] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = async () => {
    if (sending) return
    if (!input.trim() && !imageFile) return
    setSending(true)
    try {
      await onSend(input.trim(), imageFile)
      setInput('')
      clearImage()
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const clearImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setImageFile(null)
    setPreviewUrl(null)
  }

  return (
    <div className="sticky bottom-0 border-t p-4 bg-background">
      {previewUrl && (
        <div className="relative inline-block mb-2">
          <img
            src={previewUrl}
            alt="プレビュー"
            className="max-h-32 rounded-md border"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 rounded-full bg-background border shadow-sm p-1 hover:bg-accent"
            aria-label="画像を取り消し"
          >
            <X className="size-3" />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          aria-label="画像を添付"
        >
          <Paperclip className="size-4" />
        </Button>
        <textarea
          placeholder="メッセージを入力..."
          className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSend} disabled={sending}>送信</Button>
      </div>
    </div>
  )
}
