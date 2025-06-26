'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function Header() {
  const [supabase] = useState(() => createPagesBrowserClient());
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session);
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">
          <Link href="/">🌿 My App</Link>
        </h1>
        {(
          <nav className="space-x-4">
            <Link href="/home">ホーム</Link>
            <Link href="/post">投稿</Link>
            <Link href="/profile">プロフィール</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline">
              ログアウト
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}