import { dmUsers } from '@/data/dms'
import type { Channel, SelectedItem } from '@/types'

type SidebarContentProps = {
  readonly channels: readonly Channel[]
  readonly selectedItem: SelectedItem | null
  readonly onSelect: (item: SelectedItem) => void
}

export function SidebarContent({ channels, selectedItem, onSelect }: SidebarContentProps) {
  return (
    <>
      <div className="px-4 py-3 font-bold text-lg border-b border-white/20">
        My Workspace
      </div>

      <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        チャンネル
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {channels.map((channel) => {
          const isActive = selectedItem?.type === 'channel' && selectedItem.id === channel.id
          return (
            <div
              key={channel.id}
              onClick={() => onSelect({ type: 'channel', id: channel.id })}
              className={`flex items-center h-8 px-3 rounded text-sm cursor-pointer ${
                isActive ? 'bg-[#1264A3] text-white' : 'hover:bg-white/10'
              }`}
            >
              <span className={`mr-1.5 ${isActive ? 'text-white' : 'text-white/70'}`}>#</span>
              {channel.name}
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

export function Sidebar({ channels, selectedItem, onSelect }: SidebarContentProps) {
  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] text-white flex-col">
      <SidebarContent channels={channels} selectedItem={selectedItem} onSelect={onSelect} />
    </aside>
  )
}
