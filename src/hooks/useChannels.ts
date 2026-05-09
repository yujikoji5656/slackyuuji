import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Channel, SelectedItem } from '@/types'

export function useChannels() {
  const [channels, setChannels] = useState<readonly Channel[]>([])
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChannels = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from('channels')
      .select('*')
    if (fetchError) {
      setError('チャンネルの読み込みに失敗しました')
      setLoading(false)
      return
    }
    const list: Channel[] = (data ?? []).map((c) => ({
      id: c.id as string,
      name: c.name as string,
      type: 'channel' as const,
    }))
    setChannels(list)
    setSelectedItem((prev) => {
      if (prev) return prev
      return list.length > 0 ? { type: 'channel', id: list[0].id } : null
    })
    setLoading(false)
  }, [])

  useEffect(() => {
    void fetchChannels()
  }, [fetchChannels])

  const handleSelect = useCallback((item: SelectedItem) => {
    setSelectedItem(item)
  }, [])

  return {
    channels,
    selectedItem,
    loading,
    error,
    fetchChannels,
    handleSelect,
  } as const
}
