import { useCallback, useState } from 'react'
import { Menu, LogOut, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Sidebar, SidebarContent } from '@/components/Sidebar'
import { MessageList } from '@/components/MessageList'
import { MessageInput } from '@/components/MessageInput'
import { dmUsers } from '@/data/dms'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useChannels } from '@/hooks/useChannels'
import { useChannelMembership } from '@/hooks/useChannelMembership'
import { useMessages } from '@/hooks/useMessages'
import type { Channel, SelectedItem } from '@/types'

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
  const navigate = useNavigate()
  const { session } = useAuth()
  const userId = session?.user.id ?? null
  const [isOpen, setIsOpen] = useState(false)

  const {
    channels,
    selectedItem,
    loading: channelsLoading,
    error: channelsError,
    fetchChannels,
    handleSelect: selectItem,
  } = useChannels()

  const {
    memberChannelIds,
    fetchMembers,
    handleJoin: joinChannel,
    handleLeave: leaveChannel,
  } = useChannelMembership(userId)

  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    fetchChannelMessages,
    handleReact,
    handleEdit,
    handleDelete,
    handleSend,
  } = useMessages(selectedItem, userId)

  const handleSelect = useCallback(
    (item: SelectedItem) => {
      selectItem(item)
      setIsOpen(false)
    },
    [selectItem],
  )

  const selectedChannelId =
    selectedItem?.type === 'channel' ? selectedItem.id : null

  const refreshAfterMembership = useCallback(async () => {
    await fetchMembers()
    await fetchChannels()
    if (selectedChannelId) {
      await fetchChannelMessages(selectedChannelId)
    }
  }, [fetchMembers, fetchChannels, fetchChannelMessages, selectedChannelId])

  const handleJoin = useCallback(
    async (channelId: string) => {
      await joinChannel(channelId)
      await refreshAfterMembership()
    },
    [joinChannel, refreshAfterMembership],
  )

  const handleLeave = useCallback(
    async (channelId: string) => {
      await leaveChannel(channelId)
      await refreshAfterMembership()
    },
    [leaveChannel, refreshAfterMembership],
  )

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    navigate('/login', { replace: true })
  }

  const sidebarProps = {
    channels,
    selectedItem,
    onSelect: handleSelect,
    memberChannelIds,
    canManage: !!userId,
    onJoin: handleJoin,
    onLeave: handleLeave,
    channelsLoading,
    channelsError,
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar {...sidebarProps} />

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[260px] bg-[#611f69] text-white p-0">
          <SidebarContent {...sidebarProps} />
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
          <Button
            variant="destructive"
            size="sm"
            className="ml-auto"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            ログアウト
          </Button>
        </header>

        {messagesError ? (
          <div className="flex-1 flex items-center justify-center p-5">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{messagesError}</AlertDescription>
            </Alert>
          </div>
        ) : messagesLoading ? (
          <div className="flex-1 px-5 py-4 flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MessageList messages={messages} currentUserId={userId} onEdit={handleEdit} onDelete={handleDelete} onReact={handleReact} />
        )}
        <MessageInput onSend={handleSend} />
      </main>
    </div>
  )
}

export default App
