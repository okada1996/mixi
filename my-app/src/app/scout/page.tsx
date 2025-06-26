'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type User = {
  id: number;
  name: string;
  skills: string[];
};

export default function ScoutPage() {
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [scoutLog, setScoutLog] = useState<{ user: User; message: string }[]>([]);

  const users: User[] = [
    { id: 1, name: 'Naoki', skills: ['React', 'インフラ', '教育'] },
    { id: 2, name: 'Yuki', skills: ['Figma', 'UX', 'UI'] },
    { id: 3, name: 'Ken', skills: ['Java', 'Spring Boot'] },
  ];

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleScout = () => {
    if (selectedUser && message.trim() !== '') {
      setScoutLog([...scoutLog, { user: selectedUser, message }]);
      setMessage('');
      alert(`📨 ${selectedUser.name} さんにスカウトを送信しました`);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🏢 スカウト（企業専用）</h1>

      {/* 検索＆候補表示 */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Input
            placeholder="ユーザー名またはスキルで検索（例：React）"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-2">
            {filtered.map((user) => (
              <Button
                key={user.id}
                variant={selectedUser?.id === user.id ? 'default' : 'outline'}
                onClick={() => setSelectedUser(user)}
              >
                {user.name}（{user.skills.join(', ')})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* メッセージ入力 */}
      {selectedUser && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-lg font-semibold">📬 {selectedUser.name} さんへのスカウト</p>
            <Textarea
              placeholder="スカウトメッセージを入力..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={handleScout}>スカウト送信</Button>
          </CardContent>
        </Card>
      )}

      {/* 履歴 */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">📜 スカウト履歴</h2>
          {scoutLog.length === 0 ? (
            <p className="text-gray-500">スカウト履歴はまだありません</p>
          ) : (
            scoutLog.map((entry, i) => (
              <div key={i} className="border p-2 rounded">
                <strong>{entry.user.name}</strong>：{entry.message}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}