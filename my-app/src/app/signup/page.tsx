'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const supabase = createClient();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [category, setCategory] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { name, category },
      },
    });

    if (error) {
      setMessage(`エラー: ${error.message}`);
      return;
    }

    // ファイルアップロード（avatar）
    if (avatar) {
      const { error: uploadErr } = await supabase.storage
        .from('avatars')
        .upload(`public/${email}-avatar.png`, avatar, { upsert: true });

      if (uploadErr) {
        setMessage(`画像アップロードエラー: ${uploadErr.message}`);
        return;
      }
    }

    // ファイルアップロード（id card）
    if (idCard) {
      const { error: idErr } = await supabase.storage
        .from('idcards')
        .upload(`public/${email}-idcard.png`, idCard, { upsert: true });

      if (idErr) {
        setMessage(`身分証アップロードエラー: ${idErr.message}`);
        return;
      }
    }

    setMessage('確認メールを送信しました。メールのリンクからログインしてください。');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold">アカウント登録</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block font-semibold">名前</label>
          <input type="text" required className="w-full border rounded p-2" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">メール</label>
          <input type="email" required className="w-full border rounded p-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">パスワード</label>
          <input type="password" required className="w-full border rounded p-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="block font-semibold">登録分野</label>
          <select required className="w-full border rounded p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">選択してください</option>
            <option value="デザイン">デザイン</option>
            <option value="開発">開発</option>
            <option value="音楽">音楽</option>
            <option value="映像">映像</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">顔写真</label>
          <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
        </div>
        <div>
          <label className="block font-semibold">身分証</label>
          <input type="file" accept="image/*" onChange={(e) => setIdCard(e.target.files?.[0] || null)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          登録する
        </button>
        {message && <p className="text-sm text-center text-green-600">{message}</p>}
      </form>
    </div>
  );
}