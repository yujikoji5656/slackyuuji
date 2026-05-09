import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { dmUsers } from '@/data/dms'
import type { Channel, SelectedItem } from '@/types'

type SidebarContentProps = {
  readonly channels: readonly Channel[]
  readonly selectedItem: SelectedItem | null
  readonly onSelect: (item: SelectedItem) => void
  readonly memberChannelIds: ReadonlySet<string>
  readonly canManage: boolean
  readonly onJoin: (channelId: string) => void | Promise<void>
  readonly onLeave: (channelId: string) => void | Promise<void>
  readonly channelsLoading?: boolean
  readonly channelsError?: string | null
}

export function SidebarContent({
  channels,
  selectedItem,
  onSelect,
  memberChannelIds,
  canManage,
  onJoin,
  onLeave,
  channelsLoading = false,
  channelsError = null,
}: SidebarContentProps) {
  return (
    <>
      <div className="px-4 py-3 font-bold text-lg border-b border-white/20">
        My Workspace
      </div>

      <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        チャンネル
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {channelsLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full bg-white/10" />
          ))
        ) : channelsError ? (
          <p className="px-3 text-xs text-red-300">{channelsError}</p>
        ) : channels.length === 0 ? (
          <p className="px-3 text-xs text-white/50">チャンネルがありません</p>
        ) : null}
        {channels.map((channel) => {
          const isActive = selectedItem?.type === 'channel' && selectedItem.id === channel.id
          const joined = memberChannelIds.has(channel.id)
          return (
            <div
              key={channel.id}
              onClick={() => onSelect({ type: 'channel', id: channel.id })}
              className={`flex items-center h-8 px-3 rounded text-sm cursor-pointer ${
                isActive ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
              }`}
            >
              <span className={`mr-1.5 ${isActive ? 'text-white' : 'text-white/70'}`}>#</span>
              <span className="truncate">{channel.name}</span>
              {canManage && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="ml-auto h-6 px-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    void (joined ? onLeave(channel.id) : onJoin(channel.id))
                  }}
                >
                  {joined ? '退出する' : '参加する'}
                </Button>
              )}
            </div>
          )
        })}
      </nav>

      <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        ダイレクトメッセージ
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {dmUsers.map((user) => {
          const isActive = selectedItem?.type === 'dm' && selectedItem.id === user.id
          return (
            <div
              key={user.id}
              onClick={() => onSelect({ type: 'dm', id: user.id })}
              className={`flex items-center gap-2 h-8 px-3 rounded text-sm cursor-pointer ${
                isActive ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              {user.name}
            </div>
          )
        })}
      </nav>
    </>
  )
}

export function Sidebar(props: SidebarContentProps) {
  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] text-white flex-col">
      <SidebarContent {...props} />
    </aside>
  )
}
