'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PortfolioDetail() {
  const { id } = useParams(); // URLからID取得（例: /portfolio/abc123）

  // 仮データ（あとでSupabaseなどでDBから取得）
  const dummy = {
    title: 'My First Portfolio',
    imageUrl: 'https://via.placeholder.com/600x400?text=作品画像',
    description: 'この作品はReactを使って初めて作ったポートフォリオです。',
    members: ['@naoki', '@sato'],
    stars: 42,
  };

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🎨 ポートフォリオ詳細</h1>

      <Card>
        <CardContent className="p-6 space-y-4">
          <img src={dummy.imageUrl} alt="作品画像" className="rounded w-full" />
          <h2 className="text-xl font-semibold">{dummy.title}</h2>
          <p>{dummy.description}</p>

          <p><strong>👥 メンバー:</strong> {dummy.members.join(', ')}</p>
          <p><strong>⭐ 評価:</strong> {dummy.stars} いいね</p>

          <Button variant="outline">いいねする</Button>
        </CardContent>
      </Card>
    </div>
  );
}