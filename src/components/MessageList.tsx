import { useCallback, useEffect, useRef, useState } from 'react'
import { MessageItem } from '@/components/MessageItem'
import type { Message } from '@/types'

type MessageListProps = {
  readonly messages: readonly Message[]
  readonly currentUserId: string | null
  readonly onEditLocal: (id: string, newBody: string) => void
  readonly onDeleteLocal: (id: string) => void
  readonly onReact: (id: string, emoji: string) => void
}

export function MessageList({ messages, currentUserId, onEditLocal, onDeleteLocal, onReact }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editBody, setEditBody] = useState('')

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleEditStart = useCallback((msg: Message) => {
    setEditingId(msg.id)
    setEditBody(msg.body)
  }, [])

  const handleEditSave = useCallback(() => {
    if (editingId && editBody.trim()) {
      onEditLocal(editingId, editBody.trim())
    }
    setEditingId(null)
    setEditBody('')
  }, [editingId, editBody, onEditLocal])

  const handleEditCancel = useCallback(() => {
    setEditingId(null)
    setEditBody('')
  }, [])

  const handleDelete = useCallback(
    (id: string) => {
      if (window.confirm('削除しますか？')) {
        onDeleteLocal(id)
      }
    },
    [onDeleteLocal],
  )

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <p>まだメッセージがありません</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          msg={msg}
          currentUserId={currentUserId}
          isEditing={editingId === msg.id}
          editBody={editingId === msg.id ? editBody : ''}
          onEditBodyChange={setEditBody}
          onEditStart={handleEditStart}
          onEditSave={handleEditSave}
          onEditCancel={handleEditCancel}
          onDelete={handleDelete}
          onReact={onReact}
        />
      ))}
      <div ref={endRef} />
    </div>
  )
}
