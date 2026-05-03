export type Channel = {
  readonly id: string
  readonly name: string
  readonly type: 'channel' | 'dm'
}

export type User = {
  readonly id: string
  readonly name: string
  readonly displayName: string
  readonly avatarUrl: string
  readonly isOnline: boolean
}

export type Message = {
  readonly id: string
  readonly type: 'channel' | 'dm'
  readonly parentId: string
  readonly userName: string
  readonly body: string
  readonly createdAt: string
  readonly reactions: { readonly [emoji: string]: number }
  readonly imageUrl?: string
  readonly userId?: string | null
}

export type SelectedItem = {
  readonly type: 'channel' | 'dm'
  readonly id: string
}
