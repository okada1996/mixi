'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="p-10 max-w-md mx-auto">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <Input placeholder="メールアドレス" />
          <Input type="password" placeholder="パスワード" />
          <Button className="w-full">ログイン</Button>
        </CardContent>
      </Card>
    </div>
  );
}