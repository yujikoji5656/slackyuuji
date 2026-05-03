import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2, Smile } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Message } from '@/types'

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '🎉', '😮'] as const

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase()
}

type MessageListProps = {
  readonly messages: readonly Message[]
  readonly onEdit: (id: string, newBody: string) => void
  readonly onDelete: (id: string) => void
  readonly onReact: (id: string, emoji: string) => void
}

export function MessageList({ messages, onEdit, onDelete, onReact }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleEditStart = (msg: Message) => {
    setEditingId(msg.id)
    setEditBody(msg.body)
  }

  const handleEditSave = () => {
    if (editingId && editBody.trim()) {
      onEdit(editingId, editBody.trim())
    }
    setEditingId(null)
    setEditBody('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditBody('')
  }

  const handleDelete = (id: string) => {
    if (window.confirm('削除しますか？')) {
      onDelete(id)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
      {messages.map((msg) => {
        const reactionEntries = Object.entries(msg.reactions).filter(([, count]) => count > 0)

        return (
          <div key={msg.id} className="group relative flex gap-3">
            <Avatar className="h-9 w-9 mt-0.5 flex-shrink-0">
              <AvatarFallback className="bg-[#611f69] text-white text-xs">
                {getInitials(msg.userName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{msg.userName}</span>
                <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
              </div>

              {editingId === msg.id ? (
                <div className="mt-1 flex flex-col gap-2">
                  <textarea
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEditSave}>保存</Button>
                    <Button size="sm" variant="ghost" onClick={handleEditCancel}>キャンセル</Button>
                  </div>
                </div>
              ) : (
                <>
                  {msg.body && (
                    <p className="text-sm mt-0.5 whitespace-pre-wrap">{msg.body}</p>
                  )}
                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt=""
                      className="max-w-xs rounded-lg mt-2"
                    />
                  )}
                </>
              )}

              {reactionEntries.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {reactionEntries.map(([emoji, count]) => (
                    <Badge
                      key={emoji}
                      variant="secondary"
                      className="cursor-pointer select-none px-2 py-0.5 text-xs"
                      onClick={() => onReact(msg.id, emoji)}
                    >
                      {emoji} {count}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {editingId !== msg.id && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-1">
                <Popover>
                  <PopoverTrigger className="inline-flex items-center justify-center rounded-md h-7 w-7 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    <Smile className="h-3.5 w-3.5" />
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex gap-1">
                      {EMOJI_OPTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          className="text-lg hover:bg-accent rounded p-1 cursor-pointer"
                          onClick={() => onReact(msg.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleEditStart(msg)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleDelete(msg.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )
      })}
      <div ref={endRef} />
    </div>
  )
}
