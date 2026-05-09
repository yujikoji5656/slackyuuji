import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

export function useChannelMembership(userId: string | null) {
  const [memberChannelIds, setMemberChannelIds] = useState<ReadonlySet<string>>(
    new Set(),
  )

  const fetchMembers = useCallback(async () => {
    if (!userId) {
      setMemberChannelIds(new Set())
      return
    }
    const { data, error } = await supabase
      .from('channel_members')
      .select('channel_id')
      .eq('user_id', userId)
    if (error) {
      toast.error('メンバー情報の取得に失敗しました')
      return
    }
    setMemberChannelIds(
      new Set((data ?? []).map((r) => r.channel_id as string)),
    )
  }, [userId])

  useEffect(() => {
    void fetchMembers()
  }, [fetchMembers])

  const handleJoin = useCallback(
    async (channelId: string) => {
      if (!userId) return
      const { error } = await supabase
        .from('channel_members')
        .insert({ channel_id: channelId, user_id: userId })
        .select()
      if (error) {
        toast.error(error.message)
      }
    },
    [userId],
  )

  const handleLeave = useCallback(
    async (channelId: string) => {
      if (!userId) return
      const { error } = await supabase
        .from('channel_members')
        .delete()
        .eq('channel_id', channelId)
        .eq('user_id', userId)
      if (error) {
        toast.error(error.message)
      }
    },
    [userId],
  )

  return {
    memberChannelIds,
    fetchMembers,
    handleJoin,
    handleLeave,
  } as const
}
