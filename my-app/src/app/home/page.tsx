'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

type Profile = {
  id: string;
  name: string;
  avatar_url: string;
};

type ProjectWithProfile = {
  id: string;
  title: string;
  detail: string;
  created_at: string;
  genre: string;
  tags: string;
  user_id: string;
  user: Profile;
};

const GENRES = ['すべて', 'デザイン', '開発', '音楽', '映像', 'その他'];
const TAGS = ['すべて', 'チーム募集', '作品制作', '短期', '長期', '初心者歓迎'];

export default function HomePage() {
  const [projects, setProjects] = useState<ProjectWithProfile[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('すべて');
  const [selectedTag, setSelectedTag] = useState('すべて');

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, title, detail, created_at, genre, tags, user_id,
          user:profiles ( id, name, avatar_url )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('取得エラー:', error);
      } else {
        const converted = (data as any[]).map((item) => ({
          ...item,
          user: Array.isArray(item.user) ? item.user[0] : item.user,
        })) as ProjectWithProfile[];
        setProjects(converted);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchGenre = selectedGenre === 'すべて' || project.genre === selectedGenre;
    const matchTag = selectedTag === 'すべて' || project.tags?.includes(selectedTag);
    return matchGenre && matchTag;
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">新着プロジェクト</h1>

      <div className="flex flex-wrap gap-6 mb-6">
        <div>
          <label className="block font-semibold text-sm mb-1">ジャンル</label>
          <select
            className="border rounded p-2"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {GENRES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold text-sm mb-1">タグ</label>
          <select
            className="border rounded p-2"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {TAGS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-500">該当する投稿はありません。</p>
      ) : (
        <div className="space-y-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/post/${project.id}`}
              className="block border rounded-xl p-4 shadow hover:shadow-md transition bg-white"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{project.title}</h2>
                <span className="text-sm text-gray-500">
                  {project.created_at ? project.created_at.slice(0, 10) : ''}
                </span>
              </div>
              <p className="text-gray-600 mt-2 line-clamp-2">{project.detail}</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="mr-4">ジャンル: {project.genre}</span>
                <span>タグ: {project.tags}</span>
              </div>
              {project.user && (
                <div className="mt-4 flex items-center space-x-3">
                  <img
                    src={project.user.avatar_url || '/default-avatar.png'}
                    alt="avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm font-medium">{project.user.name}</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}