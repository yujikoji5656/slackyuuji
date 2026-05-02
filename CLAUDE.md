# Slackクローン（ダミーデータ版）

## 目的

Slackの全画面をダミーデータで構築し、2カラムレイアウト + レスポンシブの基礎を習得する。

## 技術スタック

- Vite + React + TypeScript
- Tailwind CSS v4 + shadcn/ui
- react-router-dom

## 画面構成

- サイドバー: 幅260px / 背景 #611f69 / チャンネル5つ（general, random, project-a, design, announcements）
- ヘッダー: チャンネル名を表示
- メッセージ一覧: ダミーメッセージ10件（Avatar + ユーザー名 + 時刻 + 本文）
- 入力欄: 下部固定（Input + 送信ボタン）

## データ

全てダミーデータ（`src/data/messages.ts`）。DB接続・認証はまだ行わない（Stage 14以降）。

## レスポンシブ

375px幅でサイドバーをハンバーガーメニュー + Sheet に切り替える。
