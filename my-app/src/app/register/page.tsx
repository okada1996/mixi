// src/app/register/page.tsx

'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  return (
    <div className="p-10 max-w-md mx-auto">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">アカウント登録</h1>
          <Input placeholder="名前" />
          <Input placeholder="メールアドレス" />
          <Input type="password" placeholder="パスワード" />
          <Button className="w-full">登録</Button>
        </CardContent>
      </Card>
    </div>
  );
}