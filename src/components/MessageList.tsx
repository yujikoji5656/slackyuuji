import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getMessagesByParent } from '@/data/messages'
import type { SelectedItem } from '@/types'

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name.slice(0, 1).toUpperCase()
}

type MessageListProps = {
  readonly selectedItem: SelectedItem
}

export function MessageList({ selectedItem }: MessageListProps) {
  const filteredMessages = getMessagesByParent(selectedItem.type, selectedItem.id)

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
      {filteredMessages.map((msg) => (
        <div key={msg.id} className="flex gap-3">
          <Avatar className="h-9 w-9 mt-0.5 flex-shrink-0">
            <AvatarFallback className="bg-[#611f69] text-white text-xs">
              {getInitials(msg.userName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm">{msg.userName}</span>
              <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
            </div>
            <p className="text-sm mt-0.5">{msg.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
