'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MessagePage() {
  const [selectedUser, setSelectedUser] = useState('alice');
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<string[]>([]);

  const users = ['alice', 'bob', 'charlie']; // 仮のフォロー済みユーザー

  const handleSend = () => {
    if (message.trim() !== '') {
      setChatLog([...chatLog, `自分：${message}`]);
      setMessage('');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {/* 左：ユーザー一覧 */}
      <Card className="col-span-1">
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">📋 フォロー中ユーザー</h2>
          {users.map((user) => (
            <Button
              key={user}
              variant={user === selectedUser ? 'default' : 'outline'}
              onClick={() => {
                setSelectedUser(user);
                setChatLog([]); // 切り替え時チャット初期化（仮）
              }}
              className="w-full"
            >
              @{user}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* 右：チャットエリア */}
      <Card className="col-span-2 flex flex-col">
        <CardContent className="p-4 flex-grow space-y-2 overflow-y-auto">
          <h2 className="text-lg font-semibold">💬 @{selectedUser} とのチャット</h2>
          {chatLog.length === 0 && <p className="text-sm text-gray-500">メッセージはまだありません</p>}
          {chatLog.map((msg, idx) => (
            <div key={idx} className="bg-gray-100 rounded p-2">{msg}</div>
          ))}
        </CardContent>
        <div className="p-4 border-t flex gap-2">
          <Input
            placeholder="メッセージを入力..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSend}>送信</Button>
        </div>
      </Card>
    </div>
  );
}