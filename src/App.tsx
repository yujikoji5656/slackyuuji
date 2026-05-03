import { useCallback, useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar, SidebarContent } from '@/components/Sidebar'
import { MessageList } from '@/components/MessageList'
import { MessageInput } from '@/components/MessageInput'
import { messages as dummyMessages } from '@/data/messages'
import { dmUsers } from '@/data/dms'
import { supabase } from '@/lib/supabase'
import type { Channel, Message, SelectedItem } from '@/types'

function getHeaderLabel(
  selectedItem: SelectedItem,
  channels: readonly Channel[],
): string {
  if (selectedItem.type === 'channel') {
    const channel = channels.find((ch) => ch.id === selectedItem.id)
    return `# ${channel?.name ?? 'unknown'}`
  }
  const user = dmUsers.find((u) => u.id === selectedItem.id)
  return `@ ${user?.name ?? 'unknown'}`
}

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [channels, setChannels] = useState<readonly Channel[]>([])
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [messages, setMessages] = useState<readonly Message[]>([])

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase.from('channels').select('*')
      if (error) {
        console.error(error)
        return
      }
      const list: Channel[] = (data ?? []).map((c) => ({
        id: c.id as string,
        name: c.name as string,
        type: 'channel' as const,
      }))
      setChannels(list)
      if (list.length > 0) {
        setSelectedItem((prev) => prev ?? { type: 'channel', id: list[0].id })
      }
    })()
  }, [])

  const selectedChannelId =
    selectedItem?.type === 'channel' ? selectedItem.id : null

  const fetchChannelMessages = useCallback(async (channelId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
    if (error) {
      console.error(error)
      return
    }
    const list: Message[] = (data ?? []).map((m) => ({
      id: m.id as string,
      type: 'channel' as const,
      parentId: m.channel_id as string,
      userName: m.user_name as string,
      body: m.content as string,
      reactions: {},
      createdAt: m.created_at as string,
      imageUrl: (m.image_url as string | null) ?? undefined,
    }))
    setMessages(list)
  }, [])

  useEffect(() => {
    if (!selectedItem) return
    if (selectedItem.type !== 'channel') {
      setMessages(
        dummyMessages.filter(
          (m) => m.type === 'dm' && m.parentId === selectedItem.id,
        ),
      )
      return
    }
    if (!selectedChannelId) return
    void fetchChannelMessages(selectedChannelId)
  }, [selectedItem, selectedChannelId, fetchChannelMessages])

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

  const handleSend = async (body: string, file: File | null) => {
    if (!selectedItem) return
    if (selectedItem.type !== 'channel') {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        type: 'dm',
        parentId: selectedItem.id,
        userName: '自分',
        body,
        reactions: {},
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, newMessage])
      return
    }

    let imageUrl: string | null = null
    if (file) {
      const ext = file.name.split('.').pop()
      const filePath = `${Date.now()}_${crypto.randomUUID()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file, { contentType: file.type })
      if (uploadError) {
        console.error(uploadError)
        return
      }
      const { data: urlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(filePath)
      imageUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('messages').insert({
      content: body,
      channel_id: selectedItem.id,
      user_name: '自分',
      image_url: imageUrl,
    })
    if (error) {
      console.error(error)
      return
    }
    await fetchChannelMessages(selectedItem.id)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        channels={channels}
        selectedItem={selectedItem}
        onSelect={handleSelect}
      />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[260px] bg-[#611f69] text-white p-0">
          <SidebarContent
            channels={channels}
            selectedItem={selectedItem}
            onSelect={handleSelect}
          />
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
          <h2 className="text-xl font-bold">
            {selectedItem ? getHeaderLabel(selectedItem, channels) : ''}
          </h2>
        </header>

        <MessageList messages={messages} onEdit={handleEdit} onDelete={handleDelete} onReact={handleReact} />
        <MessageInput onSend={handleSend} />
      </main>
    </div>
  )
}

export default App
