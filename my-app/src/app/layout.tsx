import './globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: 'My App',
  description: 'MIXI風SNSアプリ',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}