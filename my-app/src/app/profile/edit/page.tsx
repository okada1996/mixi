"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function EditProfilePage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("name, bio, specialty")
        .eq("id", user.id)
        .single();

      if (data) {
        setName(data.name || "");
        setBio(data.bio || "");
        setSpecialty(data.specialty || "");
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPortfolioFile(file);
  };

  const handleSave = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("ログインが必要です");
      return;
    }

    let portfolio_url = null;

    if (portfolioFile) {
      const fileExt = portfolioFile.name.split(".").pop();
      const filePath = `${user.id}/portfolio.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filePath, portfolioFile, { upsert: true });

      if (uploadError) {
        alert("アップロード失敗: " + uploadError.message);
        return;
      }

      const { data: publicURL } = supabase.storage
        .from("portfolio")
        .getPublicUrl(filePath);

      portfolio_url = publicURL.publicUrl;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        bio,
        specialty,
        ...(portfolio_url && { portfolio_url }),
      })
      .eq("id", user.id);

    if (error) {
      alert("保存失敗: " + error.message);
    } else {
      alert("プロフィールを保存しました");
      router.push("/profile");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-2xl mt-10 space-y-6">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="名前"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border p-2 rounded"
        placeholder="自己紹介"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="得意分野"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="block mt-2"
        accept="image/*,application/pdf"
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        保存
      </button>
    </div>
  );
}