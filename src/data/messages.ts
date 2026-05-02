import type { Channel, Message } from '@/types'

export const channels: readonly Channel[] = [
  { id: 'ch-1', name: 'general', type: 'channel' },
  { id: 'ch-2', name: 'random', type: 'channel' },
  { id: 'ch-3', name: 'project-a', type: 'channel' },
  { id: 'ch-4', name: 'design', type: 'channel' },
  { id: 'ch-5', name: 'announcements', type: 'channel' },
] as const

export const messages: readonly Message[] = [
  // #general
  { id: 'm-1',  type: 'channel', parentId: 'ch-1', userName: 'Alice',   body: 'おはようございます！今日もよろしくお願いします。', reactions: {}, createdAt: '2026-05-02T09:00:00Z' },
  { id: 'm-2',  type: 'channel', parentId: 'ch-1', userName: 'Bob',     body: 'おはようございます！新しいデザイン案を共有しますね。', reactions: {}, createdAt: '2026-05-02T09:05:00Z' },
  { id: 'm-3',  type: 'channel', parentId: 'ch-1', userName: 'Charlie', body: 'デプロイの準備ができました。レビューお願いします。', reactions: {}, createdAt: '2026-05-02T09:10:00Z' },
  { id: 'm-4',  type: 'channel', parentId: 'ch-1', userName: 'Alice',   body: 'ありがとうございます！確認します。', reactions: {}, createdAt: '2026-05-02T09:15:00Z' },
  { id: 'm-5',  type: 'channel', parentId: 'ch-1', userName: 'Diana',   body: 'ミーティングのアジェンダを更新しました。', reactions: {}, createdAt: '2026-05-02T09:20:00Z' },

  // #random
  { id: 'm-6',  type: 'channel', parentId: 'ch-2', userName: 'Bob',     body: '昨日のカレー屋さん最高だった！', reactions: {}, createdAt: '2026-05-02T10:00:00Z' },
  { id: 'm-7',  type: 'channel', parentId: 'ch-2', userName: 'Eve',     body: 'どこのお店ですか？気になります。', reactions: {}, createdAt: '2026-05-02T10:05:00Z' },
  { id: 'm-8',  type: 'channel', parentId: 'ch-2', userName: 'Bob',     body: '駅前のスパイスキッチンです。おすすめ！', reactions: {}, createdAt: '2026-05-02T10:10:00Z' },
  { id: 'm-9',  type: 'channel', parentId: 'ch-2', userName: 'Diana',   body: '今度ランチ行きましょう 🍛', reactions: {}, createdAt: '2026-05-02T10:15:00Z' },

  // #project-a
  { id: 'm-10', type: 'channel', parentId: 'ch-3', userName: 'Charlie', body: 'Sprint 3のタスクを整理しました。', reactions: {}, createdAt: '2026-05-02T11:00:00Z' },
  { id: 'm-11', type: 'channel', parentId: 'ch-3', userName: 'Alice',   body: 'API設計のドキュメントをNotionに上げました。', reactions: {}, createdAt: '2026-05-02T11:10:00Z' },
  { id: 'm-12', type: 'channel', parentId: 'ch-3', userName: 'Diana',   body: 'フロントのコンポーネント設計も進めています。', reactions: {}, createdAt: '2026-05-02T11:20:00Z' },

  // #design
  { id: 'm-13', type: 'channel', parentId: 'ch-4', userName: 'Eve',     body: 'Figmaのプロトタイプを更新しました。', reactions: {}, createdAt: '2026-05-02T12:00:00Z' },
  { id: 'm-14', type: 'channel', parentId: 'ch-4', userName: 'Bob',     body: 'カラーパレットの変更案を追加しました。', reactions: {}, createdAt: '2026-05-02T12:15:00Z' },
  { id: 'm-15', type: 'channel', parentId: 'ch-4', userName: 'Alice',   body: 'いい感じですね！フォントサイズだけ少し調整しましょう。', reactions: {}, createdAt: '2026-05-02T12:20:00Z' },
  { id: 'm-16', type: 'channel', parentId: 'ch-4', userName: 'Eve',     body: '了解です、反映します！', reactions: {}, createdAt: '2026-05-02T12:25:00Z' },

  // #announcements
  { id: 'm-17', type: 'channel', parentId: 'ch-5', userName: 'Alice',   body: '来週月曜に全社ミーティングがあります。', reactions: {}, createdAt: '2026-05-02T13:00:00Z' },
  { id: 'm-18', type: 'channel', parentId: 'ch-5', userName: 'Alice',   body: '新メンバーの田中さんが来週からジョインします！', reactions: {}, createdAt: '2026-05-02T13:10:00Z' },
  { id: 'm-19', type: 'channel', parentId: 'ch-5', userName: 'Charlie', body: 'オフィス移転の日程が決まりました。詳細はメールで。', reactions: {}, createdAt: '2026-05-02T13:20:00Z' },

  // DM: 田中
  { id: 'm-20', type: 'dm', parentId: 'dm-1', userName: '田中',   body: 'お疲れさまです！例の件、進捗どうですか？', reactions: {}, createdAt: '2026-05-02T14:00:00Z' },
  { id: 'm-21', type: 'dm', parentId: 'dm-1', userName: 'あなた', body: '今ちょうど作業中です。夕方には共有できそうです。', reactions: {}, createdAt: '2026-05-02T14:05:00Z' },
  { id: 'm-22', type: 'dm', parentId: 'dm-1', userName: '田中',   body: 'ありがとうございます！楽しみにしてます。', reactions: {}, createdAt: '2026-05-02T14:10:00Z' },

  // DM: 鈴木
  { id: 'm-23', type: 'dm', parentId: 'dm-2', userName: '鈴木',   body: 'ミーティングの議事録送りました。確認お願いします。', reactions: {}, createdAt: '2026-05-02T15:00:00Z' },
  { id: 'm-24', type: 'dm', parentId: 'dm-2', userName: 'あなた', body: '確認しました。3ページ目の見積もりについて質問があります。', reactions: {}, createdAt: '2026-05-02T15:10:00Z' },
  { id: 'm-25', type: 'dm', parentId: 'dm-2', userName: '鈴木',   body: 'どの部分ですか？詳しく教えてください。', reactions: {}, createdAt: '2026-05-02T15:15:00Z' },
  { id: 'm-26', type: 'dm', parentId: 'dm-2', userName: 'あなた', body: 'インフラコストの見積もりが前回と違うようです。', reactions: {}, createdAt: '2026-05-02T15:20:00Z' },

  // DM: 佐藤
  { id: 'm-27', type: 'dm', parentId: 'dm-3', userName: '佐藤',   body: '来週の勉強会の資料できましたか？', reactions: {}, createdAt: '2026-05-02T16:00:00Z' },
  { id: 'm-28', type: 'dm', parentId: 'dm-3', userName: 'あなた', body: 'はい！スライド30枚ほどできました。', reactions: {}, createdAt: '2026-05-02T16:05:00Z' },
  { id: 'm-29', type: 'dm', parentId: 'dm-3', userName: '佐藤',   body: 'すごい！事前に見せてもらえますか？', reactions: {}, createdAt: '2026-05-02T16:10:00Z' },
] as const

export function getMessagesByParent(type: 'channel' | 'dm', parentId: string): readonly Message[] {
  return messages.filter((m) => m.type === type && m.parentId === parentId)
}
