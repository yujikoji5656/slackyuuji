import { memo } from 'react'
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

type MessageItemProps = {
  readonly msg: Message
  readonly currentUserId: string | null
  readonly isEditing: boolean
  readonly editBody: string
  readonly onEditBodyChange: (value: string) => void
  readonly onEditStart: (msg: Message) => void
  readonly onEditSave: () => void
  readonly onEditCancel: () => void
  readonly onDelete: (id: string) => void
  readonly onReact: (id: string, emoji: string) => void
}

export const MessageItem = memo(function MessageItem({
  msg,
  currentUserId,
  isEditing,
  editBody,
  onEditBodyChange,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  onReact,
}: MessageItemProps) {
  const reactionEntries = Object.entries(msg.reactions).filter(([, count]) => count > 0)
  const isOwner = currentUserId != null && msg.userId === currentUserId

  return (
    <div className="group relative flex gap-3">
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

        {isEditing ? (
          <div className="mt-1 flex flex-col gap-2">
            <textarea
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
              rows={3}
              value={editBody}
              onChange={(e) => onEditBodyChange(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onEditSave}>保存</Button>
              <Button size="sm" variant="ghost" onClick={onEditCancel}>キャンセル</Button>
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

      {!isEditing && (
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
          {isOwner && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onEditStart(msg)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onDelete(msg.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
})
