import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar, SidebarContent } from '@/components/Sidebar'
import { MessageList } from '@/components/MessageList'
import { MessageInput } from '@/components/MessageInput'
import { channels, messages as initialMessages } from '@/data/messages'
import { dmUsers } from '@/data/dms'
import type { Message, SelectedItem } from '@/types'

function getHeaderLabel(selectedItem: SelectedItem): string {
  if (selectedItem.type === 'channel') {
    const channel = channels.find((ch) => ch.id === selectedItem.id)
    return `# ${channel?.name ?? 'unknown'}`
  }
  const user = dmUsers.find((u) => u.id === selectedItem.id)
  return `@ ${user?.name ?? 'unknown'}`
}

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedItem>({
    type: 'channel',
    id: channels[0].id,
  })
  const [messages, setMessages] = useState<readonly Message[]>(initialMessages)

  const filteredMessages = messages.filter(
    (m) => m.type === selectedItem.type && m.parentId === selectedItem.id,
  )

  const handleSelect = (item: SelectedItem) => {
    setSelectedItem(item)
    setIsOpen(false)
  }

  const handleReact = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] ?? 0) + 1 } }
          : m,
      ),
    )
  }

  const handleEdit = (id: string, newBody: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, body: newBody } : m)),
    )
  }

  const handleDelete = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  const handleSend = (body: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      type: selectedItem.type,
      parentId: selectedItem.id,
      userName: '自分',
      body,
      reactions: {},
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar selectedItem={selectedItem} onSelect={handleSelect} />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[260px] bg-[#611f69] text-white p-0">
          <SidebarContent selectedItem={selectedItem} onSelect={handleSelect} />
        </SheetContent>
      </Sheet>

      <main className="flex-1 flex flex-col">
        <header className="px-5 py-3 border-b flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold">{getHeaderLabel(selectedItem)}</h2>
        </header>

        <MessageList messages={filteredMessages} onEdit={handleEdit} onDelete={handleDelete} onReact={handleReact} />
        <MessageInput onSend={handleSend} />
      </main>
    </div>
  )
}

export default App
