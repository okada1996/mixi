// app/login/layout.tsx

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    // 共通レイアウトを無効化するため、childrenだけをそのまま返す
    return <>{children}</>;
  }