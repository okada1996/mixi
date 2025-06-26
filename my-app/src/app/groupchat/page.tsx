'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import dynamic from 'next/dynamic';

// カレンダーはSSR無効で読み込み（エラー回避）
const Calendar = dynamic(() => import('@/components/ui/calendar'), { ssr: false });

export default function GroupChatPage() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const teamName = 'React開発チーム';
  const members = ['@naoki', '@sato', '@miki'];

  const handleSend = () => {
    if (message.trim() !== '') {
      setChatLog([...chatLog, `自分：${message}`]);
      setMessage('');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">💬 グループチャット：{teamName}</h1>

      {/* チーム情報 */}
      <Card>
        <CardContent className="p-4">
          <p><strong>👥 参加者：</strong>{members.join(', ')}</p>
        </CardContent>
      </Card>

      {/* チャットエリア */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="font-semibold">📨 チャット</h2>
          <div className="space-y-1">
            {chatLog.length === 0 && <p className="text-sm text-gray-500">メッセージはまだありません</p>}
            {chatLog.map((msg, i) => (
              <div key={i} className="bg-gray-100 rounded p-2">{msg}</div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="メッセージを入力..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleSend}>送信</Button>
          </div>
        </CardContent>
      </Card>

      {/* ファイル共有 */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold">📎 ファイル共有</h2>
          <Input type="file" />
        </CardContent>
      </Card>

      {/* カレンダー（SSR無効化で表示） */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold">🗓 カレンダー</h2>
          <Calendar />
        </CardContent>
      </Card>
    </div>
  );
}