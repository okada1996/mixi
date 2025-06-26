'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const GENRES = ['デザイン', '開発', '音楽', '映像', 'その他'];
const TAGS = ['チーム募集', '作品制作', '短期', '長期', '初心者歓迎'];

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [purpose, setPurpose] = useState('');
  const [detail, setDetail] = useState('');
  const [deadline, setDeadline] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        alert('投稿データの取得に失敗しました');
        return;
      }

      setTitle(data.title);
      setGenre(data.genre);
      setPurpose(data.purpose);
      setDetail(data.detail);
      setDeadline(data.deadline);
      setSelectedTags(data.tags || []);
    };

    if (id) fetchProject();
  }, [id]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleUpdate = async () => {
    setLoading(true);

    const { error } = await supabase
      .from('projects')
      .update({
        title,
        genre,
        purpose,
        detail,
        deadline,
        tags: selectedTags,
      })
      .eq('id', id);

    setLoading(false);

    if (error) {
      alert('更新に失敗しました');
      console.error(error);
    } else {
      alert('更新が完了しました');
      router.push(`/post/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold">✏️ 投稿を編集</h2>

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

            <Button className="w-full" onClick={handleUpdate} disabled={loading}>
              {loading ? '更新中...' : '更新する'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}