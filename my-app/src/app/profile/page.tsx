"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
  specialty: string;
  portfolio_url?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("ユーザー取得失敗:", userError?.message || "未ログイン");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, bio, specialty, portfolio_url")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("プロフィール取得エラー:", error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    router.push("/profile/edit");
  };

  if (loading) {
    return <div className="p-6 text-gray-600">プロフィールを読み込み中...</div>;
  }

  if (!profile) {
    return (
      <div className="p-6 text-red-500">
        プロフィールが見つかりません。  
        <button
          onClick={handleEditClick}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          プロフィールを登録
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-2xl mt-10 space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src={profile.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">@{profile.id}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">自己紹介</h2>
        <p className="text-gray-700 mt-1 whitespace-pre-wrap">{profile.bio || "未入力"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">得意分野</h2>
        <p className="text-gray-700 mt-1">{profile.specialty || "未入力"}</p>
      </div>

      {profile.portfolio_url && (
        <div>
          <h2 className="text-lg font-semibold">ポートフォリオ</h2>
          <a
            href={profile.portfolio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            ファイルを表示
          </a>
        </div>
      )}

      <div className="text-right">
        <button
          onClick={handleEditClick}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          プロフィールを編集
        </button>
      </div>
    </div>
  );
}