import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { messages as dummyMessages } from '@/data/messages'
import type { Message, SelectedItem } from '@/types'

type DBMessageRow = {
  readonly id: string
  readonly channel_id: string
  readonly user_id: string | null
  readonly user_name: string
  readonly content: string
  readonly image_url: string | null
  readonly created_at: string
}

const mapDbMessage = (m: DBMessageRow): Message => ({
  id: m.id,
  type: 'channel' as const,
  parentId: m.channel_id,
  userName: m.user_name,
  body: m.content,
  reactions: {},
  createdAt: m.created_at,
  imageUrl: m.image_url ?? undefined,
  userId: m.user_id,
})

const MAX_MESSAGE_LENGTH = 4000
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
])

export function useMessages(
  selectedItem: SelectedItem | null,
  sessionUserId: string | null,
) {
  const [messages, setMessages] = useState<readonly Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedChannelId =
    selectedItem?.type === 'channel' ? selectedItem.id : null

  const fetchChannelMessages = useCallback(async (channelId: string) => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('messages')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true })
    if (fetchError) {
      setError('メッセージの読み込みに失敗しました')
      setLoading(false)
      return
    }
    setMessages((data as DBMessageRow[] ?? []).map(mapDbMessage))
    setLoading(false)
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

  useEffect(() => {
    if (!selectedChannelId) return
    const channel = supabase
      .channel(`messages:${selectedChannelId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const row = payload.new as DBMessageRow
          if (row.channel_id !== selectedChannelId) return
          const msg = mapDbMessage(row)
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
          )
        },
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [selectedChannelId])

  const handleReact = useCallback((id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [emoji]: (m.reactions[emoji] ?? 0) + 1,
              },
            }
          : m,
      ),
    )
  }, [])

  const handleEdit = useCallback(
    (id: string, newBody: string) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== id) return m
          if (m.userId !== sessionUserId) return m
          return { ...m, body: newBody }
        }),
      )
    },
    [sessionUserId],
  )

  const handleDelete = useCallback(
    (id: string) => {
      setMessages((prev) => {
        const target = prev.find((m) => m.id === id)
        if (!target || target.userId !== sessionUserId) return prev
        return prev.filter((m) => m.id !== id)
      })
    },
    [sessionUserId],
  )

  const handleSend = useCallback(
    async (body: string, file: File | null) => {
      if (!selectedItem) return

      if (body.length > MAX_MESSAGE_LENGTH) {
        toast.error(`メッセージは${MAX_MESSAGE_LENGTH}文字以内で入力してください`)
        return
      }

      if (file) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error('ファイルサイズは5MB以下にしてください')
          return
        }
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          toast.error('画像ファイル（JPEG, PNG, GIF, WebP）のみアップロードできます')
          return
        }
      }

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
          toast.error('画像のアップロードに失敗しました')
          return
        }
        const { data: urlData } = supabase.storage
          .from('chat-images')
          .getPublicUrl(filePath)
        imageUrl = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from('messages').insert({
        content: body,
        channel_id: selectedItem.id,
        user_name: '自分',
        image_url: imageUrl,
        user_id: sessionUserId,
      })
      if (insertError) {
        toast.error('メッセージの送信に失敗しました')
      }
    },
    [selectedItem, sessionUserId],
  )

  return {
    messages,
    loading,
    error,
    fetchChannelMessages,
    handleReact,
    handleEdit,
    handleDelete,
    handleSend,
  } as const
}
