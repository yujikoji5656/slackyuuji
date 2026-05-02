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
  readonly channelId: string
  readonly userId: string
  readonly text: string
  readonly timestamp: string
}
