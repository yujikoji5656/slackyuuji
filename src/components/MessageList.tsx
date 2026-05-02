import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { messages, getUserById } from '@/data/messages'

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function MessageList() {
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
      {messages.map((msg) => {
        const user = getUserById(msg.userId)
        if (!user) return null

        return (
          <div key={msg.id} className="flex gap-3">
            <Avatar className="h-9 w-9 mt-0.5 flex-shrink-0">
              <AvatarFallback className="bg-[#611f69] text-white text-xs">
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm">{user.displayName}</span>
                <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
              </div>
              <p className="text-sm mt-0.5">{msg.text}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
