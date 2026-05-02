export type DmUser = {
  readonly id: string
  readonly name: string
  readonly isOnline: boolean
}

export const dmUsers: readonly DmUser[] = [
  { id: 'dm-1', name: '田中', isOnline: true },
  { id: 'dm-2', name: '鈴木', isOnline: false },
  { id: 'dm-3', name: '佐藤', isOnline: true },
] as const
