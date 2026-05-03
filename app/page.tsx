"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Channel = {
  id: string;
  name: string;
  created_at: string;
};

type Message = {
  id: string;
  channel_id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("channels").select("*");
      if (error) {
        console.error(error);
        return;
      }
      const list = data ?? [];
      setChannels(list);
      if (list.length > 0) {
        setSelectedChannelId((prev) => prev ?? list[0].id);
      }
    })();
  }, []);

  const fetchMessages = async (channelId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("channel_id", channelId)
      .order("created_at", { ascending: true });
    if (error) {
      console.error(error);
      return;
    }
    setMessages(data ?? []);
  };

  useEffect(() => {
    if (!selectedChannelId) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedChannelId);
  }, [selectedChannelId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !selectedChannelId || sending) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      content: text,
      channel_id: selectedChannelId,
      user_name: "自分",
    });
    if (error) {
      console.error(error);
      setSending(false);
      return;
    }
    setDraft("");
    await fetchMessages(selectedChannelId);
    setSending(false);
  };

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-slate-100 p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Channels
        </h2>
        <ul className="space-y-1">
          {channels.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelectedChannelId(c.id)}
                className={`w-full text-left px-2 py-1 rounded hover:bg-slate-800 ${
                  selectedChannelId === c.id ? "bg-slate-800" : ""
                }`}
              >
                # {c.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="border-b px-6 py-4">
          <h1 className="text-xl font-bold">
            {selectedChannel ? `# ${selectedChannel.name}` : "slackyuuji"}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {!selectedChannelId && (
            <p className="text-slate-500">
              チャンネルを選択してください
            </p>
          )}
          {selectedChannelId && messages.length === 0 && (
            <p className="text-slate-500">メッセージはまだありません</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold">{m.user_name}</span>
                <span className="text-xs text-slate-500">
                  {new Date(m.created_at).toLocaleString()}
                </span>
              </div>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSend}
          className="border-t px-6 py-3 flex gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              selectedChannel
                ? `#${selectedChannel.name} にメッセージを送信`
                : "チャンネルを選択してください"
            }
            className="flex-1 border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400 disabled:bg-slate-100"
            disabled={sending || !selectedChannelId}
          />
          <button
            type="submit"
            disabled={sending || !draft.trim() || !selectedChannelId}
            className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
          >
            送信
          </button>
        </form>
      </main>
    </div>
  );
}
