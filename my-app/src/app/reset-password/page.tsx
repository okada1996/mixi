'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Supabaseはクエリパラメータでaccess_tokenなどを渡す
    const access_token = searchParams.get('access_token');
    const type = searchParams.get('type');

    if (!access_token || type !== 'recovery') {
      setMessage('無効なリンクです。');
    }
  }, [searchParams]);

  const handleUpdate = async () => {
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage('更新失敗: ' + error.message);
    } else {
      setMessage('パスワードを更新しました。ログインページへ移動します...');
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">新しいパスワードを設定</h1>

        <input
          type="password"
          placeholder="新しいパスワード"
          className="w-full px-4 py-2 border rounded-xl"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl"
        >
          パスワードを更新
        </button>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
}