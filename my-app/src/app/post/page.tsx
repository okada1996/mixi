'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

const GENRES = ['デザイン', '開発', '音楽', '映像', 'その他'];
const TAGS = ['チーム募集', '作品制作', '短期', '長期', '初心者歓迎'];

export default function ProjectPostPage() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [purpose, setPurpose] = useState('');
  const [detail, setDetail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('projects')
      .insert([
        {
          title,
          genre,
          purpose,
          detail,
          deadline,
          tags: selectedTags,
          // user_id は削除
        },
      ]);

    setLoading(false);

    if (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    } else {
      alert('投稿が完了しました！');
      setTitle('');
      setGenre('');
      setPurpose('');
      setDetail('');
      setDeadline('');
      setSelectedTags([]);
      setImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">📢 プロジェクト投稿</h2>

        <Card>
          <CardContent className="p-6 space-y-4">
            <Input placeholder="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div>
              <label className="block mb-1 font-medium">ジャンル</label>
              <select
                className="w-full border p-2 rounded"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              >
                <option value="">選択してください</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <Textarea placeholder="目的" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            <Textarea placeholder="募集内容" value={detail} onChange={(e) => setDetail(e.target.value)} />
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

            <div>
              <label className="block mb-1 font-medium">タグ（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full border ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />

            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? '投稿中...' : 'プロジェクトを投稿する'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}