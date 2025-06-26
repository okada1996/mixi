'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-white to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center text-pink-600">🌸 Welcome to Mixi風アプリ</h1>
        <p className="text-center text-gray-600">
          みんなの近況をシェアしよう！友達の投稿をチェックしたり、自分のポートフォリオを紹介したりできます。
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/login"
            className="bg-pink-500 hover:bg-pink-600 text-white text-center py-2 px-6 rounded-xl font-semibold"
          >
            ログイン
          </Link>
          <Link
            href="/signup"
            className="bg-blue-500 hover:bg-blue-600 text-white text-center py-2 px-6 rounded-xl font-semibold"
          >
            新規登録
          </Link>
        </div>

        <p className="text-center text-gray-400 text-sm">
          © 2025 Mixi Clone by あなたのお名前
        </p>
      </div>
    </div>
  );
}