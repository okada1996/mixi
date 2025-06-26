'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('ログインに失敗しました: ' + error.message);
      return;
    }

    router.push('/home'); // ログイン成功後ホームへ
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">ログイン</h1>

        {errorMsg && <p className="text-sm text-red-500 text-center">{errorMsg}</p>}

        <div>
          <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
          <input
            type="email"
            className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">パスワード</label>
          <input
            type="password"
            className="mt-1 w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl transition"
        >
          ログイン
        </button>

        <div className="text-sm text-center">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            パスワードをお忘れですか？
          </a>
        </div>

        <p className="text-sm text-center text-gray-500">
          アカウントをお持ちでない方は{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            新規登録はこちら
          </a>
        </p>
      </div>
    </div>
  );
}