import { Suspense } from 'react';
import ResetPasswordPage from './ResetPasswordForm';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-8">読み込み中...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}