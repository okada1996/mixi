'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Project = {
  id: string;
  title: string;
  genre: string;
  purpose: string;
  detail: string;
  deadline: string;
  tags: string;
  created_at: string;
  user_id: string;
};

type Profile = {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user_name?: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [project, setProject] = useState<Project | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchProjectAndUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      setUserId(sessionData?.session?.user?.id || null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError || !projectData) {
        console.error('投稿取得エラー:', projectError);
        return;
      }
      setProject(projectData);

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, bio, avatar_url')
        .eq('id', projectData.user_id)
        .single();

      if (profileError) {
        console.error('プロフィール取得エラー:', profileError);
        return;
      }
      setProfile(profileData);
    };

    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id, profiles(name)')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('コメント取得エラー:', error);
      } else {
        const formatted = data.map((c: any) => ({
          id: c.id,
          content: c.content,
          created_at: c.created_at,
          user_id: c.user_id,
          user_name: c.profiles?.name || '名無し',
        }));
        setComments(formatted);
      }
    };

    const fetchLikes = async () => {
      const { count } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

      if (count !== null) {
        setLikeCount(count);
      }

      if (userId) {
        const { data: existing } = await supabase
          .from('likes')
          .select('*')
          .eq('project_id', id)
          .eq('user_id', userId)
          .single();

        if (existing) {
          setLiked(true);
        }
      }
    };

    if (id) {
      fetchProjectAndUser();
      fetchComments();
      fetchLikes();
    }
  }, [id, userId]);

  const handleEdit = () => router.push(`/post/${id}/edit`);

  const handleDelete = async () => {
    if (!confirm('本当にこの投稿を削除しますか？')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      alert('削除に失敗しました');
      console.error(error);
    } else {
      alert('削除しました');
      router.push('/home');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !userId) return;

    const { error } = await supabase.from('comments').insert({
      content: newComment,
      user_id: userId,
      project_id: id,
    });

    if (error) {
      alert('コメント送信に失敗しました');
      console.error(error);
    } else {
      setNewComment('');
      const { data } = await supabase
        .from('comments')
        .select('id, content, created_at, user_id, profiles(name)')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      const formatted = data.map((c: any) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        user_id: c.user_id,
        user_name: c.profiles?.name || '名無し',
      }));
      setComments(formatted);
    }
  };

  const handleLike = async () => {
    if (!userId) return alert('ログインが必要です');

    if (liked) {
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('project_id', id)
        .eq('user_id', userId);

      if (!error) {
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      }
    } else {
      const { error } = await supabase.from('likes').insert({
        project_id: id,
        user_id: userId,
      });

      if (!error) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  };

  if (!project) return <p>読み込み中...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <p className="text-gray-500">ジャンル: {project.genre}</p>
      <p className="text-gray-700">目的: {project.purpose}</p>
      <p className="text-gray-700">募集内容: {project.detail}</p>
      <p className="text-gray-600">締切: {project.deadline}</p>
      <p className="text-sm text-gray-400">タグ: {project.tags}</p>
      <p className="text-sm text-gray-400">投稿日: {new Date(project.created_at).toLocaleString()}</p>

      <div className="flex space-x-4 pt-4">
        <Button onClick={handleEdit}>編集</Button>
        <Button variant="destructive" onClick={handleDelete}>削除</Button>
        <Button variant={liked ? 'default' : 'outline'} onClick={handleLike}>
          ❤️ {liked ? 'いいね済' : 'いいね'}（{likeCount}）
        </Button>
      </div>

      {profile && (
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-bold">投稿者プロフィール</h2>
          <div className="flex items-center mt-2 space-x-4">
            <img
              src={profile.avatar_url || '/default-avatar.png'}
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{profile.name}</p>
              <p className="text-sm text-gray-600">{profile.bio}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">💬 コメント</h2>

        {comments.length === 0 && <p className="text-gray-500">まだコメントはありません。</p>}

        {comments.map((c) => (
          <div key={c.id} className="mb-4 p-3 bg-gray-100 rounded">
            <p className="text-sm text-gray-800">{c.content}</p>
            <p className="text-xs text-gray-500">投稿者: {c.user_name}</p>
            <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</p>
          </div>
        ))}

        <Textarea
          className="mt-4"
          placeholder="コメントを入力"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleCommentSubmit} className="mt-2">コメントを投稿</Button>
      </div>
    </div>
  );
}
