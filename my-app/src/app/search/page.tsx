'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type SearchItem = {
  id: number;
  type: 'user' | 'project' | 'work';
  title: string;
  tags: string[];
};

export default function SearchPage() {
  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);

  const dummyData: SearchItem[] = [
    { id: 1, type: 'user', title: 'Naoki（インフラ×開発）', tags: ['React', 'TypeScript'] },
    { id: 2, type: 'project', title: 'Web制作チーム募集', tags: ['Next.js', '東京'] },
    { id: 3, type: 'work', title: 'UIデザイン作品集', tags: ['Figma', 'UX'] },
  ];

  const handleSearch = () => {
    const kw = keyword.toLowerCase();
    const f = filter.toLowerCase();
    const filtered = dummyData.filter((item) =>
      item.title.toLowerCase().includes(kw) &&
      (f === '' || item.tags.some((tag) => tag.toLowerCase().includes(f)))
    );
    setResults(filtered);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🔍 検索・フィルター</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="キーワードを入力（例：UI、Naoki）"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Input
          placeholder="タグ・分野（例：React、関東）"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button onClick={handleSearch}>検索</Button>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <p className="text-gray-500">検索結果はありません</p>
        ) : (
          results.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 space-y-1">
                <p className="text-sm text-gray-400">{item.type.toUpperCase()}</p>
                <p className="text-lg font-semibold">{item.title}</p>
                <div className="text-sm text-gray-600">タグ：{item.tags.join(', ')}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}