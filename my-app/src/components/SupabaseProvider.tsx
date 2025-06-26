'use client';

import { createContext, useEffect, useState, useContext } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Session } from '@supabase/supabase-js';

type SupabaseContextType = {
  session: Session | null;
};

const SupabaseContext = createContext<SupabaseContextType>({ session: null });

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // 初回のセッション取得
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // セッションが変わったときのリスナー
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ session }}>
      {children}
    </SupabaseContext.Provider>
  );
}

// 外部からセッション情報を取得するためのフック
export function useSupabaseSession() {
  return useContext(SupabaseContext);
}