'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`, // 確認用URL
    });

    if (error) {
      setMessage('エラー: ' + error.message);
    } else {
      setMessage('パスワードリセット用メールを送信しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-xl font-bold text-center">パスワードをリセット</h1>

        <input
          type="email"
          placeholder="メールアドレス"
          className="w-full px-4 py-2 border rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl"
        >
          リセットメールを送信
        </button>

        {message && <p className="text-sm text-center text-gray-600">{message}</p>}
      </div>
    </div>
  );
}