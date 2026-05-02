import { channels } from '@/data/messages'

export function SidebarContent() {
  return (
    <>
      <div className="px-4 py-3 font-bold text-lg border-b border-white/20">
        My Workspace
      </div>

      <div className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
        チャンネル
      </div>

      <nav className="flex flex-col gap-0.5 px-2">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center h-8 px-3 rounded text-sm cursor-pointer hover:bg-white/10"
          >
            <span className="mr-1.5 text-white/70">#</span>
            {channel.name}
          </div>
        ))}
      </nav>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-[260px] flex-shrink-0 bg-[#611f69] text-white flex-col">
      <SidebarContent />
    </aside>
  )
}
