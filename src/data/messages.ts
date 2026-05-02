import type { Channel, User, Message } from '@/types'

export const channels: readonly Channel[] = [
  { id: 'ch-1', name: 'general', type: 'channel' },
  { id: 'ch-2', name: 'random', type: 'channel' },
  { id: 'ch-3', name: 'project-a', type: 'channel' },
  { id: 'ch-4', name: 'design', type: 'channel' },
  { id: 'ch-5', name: 'announcements', type: 'channel' },
] as const

export const users: readonly User[] = [
  { id: 'u-1', name: 'alice', displayName: 'Alice Johnson', avatarUrl: '', isOnline: true },
  { id: 'u-2', name: 'bob', displayName: 'Bob Smith', avatarUrl: '', isOnline: true },
  { id: 'u-3', name: 'charlie', displayName: 'Charlie Brown', avatarUrl: '', isOnline: false },
  { id: 'u-4', name: 'diana', displayName: 'Diana Prince', avatarUrl: '', isOnline: true },
  { id: 'u-5', name: 'eve', displayName: 'Eve Wilson', avatarUrl: '', isOnline: false },
] as const

export const messages: readonly Message[] = [
  { id: 'm-1', channelId: 'ch-1', userId: 'u-1', text: 'おはようございます！今日もよろしくお願いします。', timestamp: '2026-05-02T09:00:00Z' },
  { id: 'm-2', channelId: 'ch-1', userId: 'u-2', text: 'おはようございます！新しいデザイン案を共有しますね。', timestamp: '2026-05-02T09:05:00Z' },
  { id: 'm-3', channelId: 'ch-1', userId: 'u-3', text: 'デプロイの準備ができました。レビューお願いします。', timestamp: '2026-05-02T09:10:00Z' },
  { id: 'm-4', channelId: 'ch-1', userId: 'u-1', text: 'ありがとうございます！確認します。', timestamp: '2026-05-02T09:15:00Z' },
  { id: 'm-5', channelId: 'ch-1', userId: 'u-4', text: 'ミーティングのアジェンダを更新しました。ご確認ください。', timestamp: '2026-05-02T09:20:00Z' },
  { id: 'm-6', channelId: 'ch-1', userId: 'u-5', text: 'バグ修正のPRを出しました。#123 です。', timestamp: '2026-05-02T09:30:00Z' },
  { id: 'm-7', channelId: 'ch-1', userId: 'u-2', text: 'レビューしました！LGTMです 👍', timestamp: '2026-05-02T09:35:00Z' },
  { id: 'm-8', channelId: 'ch-1', userId: 'u-3', text: 'マージしてデプロイ完了しました。', timestamp: '2026-05-02T09:40:00Z' },
  { id: 'm-9', channelId: 'ch-1', userId: 'u-4', text: 'お疲れさまです！ステージング環境で動作確認しますね。', timestamp: '2026-05-02T09:45:00Z' },
  { id: 'm-10', channelId: 'ch-1', userId: 'u-1', text: '問題なさそうです。本番反映もお願いします！', timestamp: '2026-05-02T09:50:00Z' },
] as const

export function getUserById(userId: string): User | undefined {
  return users.find((u) => u.id === userId)
}
