'use client';

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = 'https://anyjqmrixwcjyvjftbhk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // 長いので省略OK

export const supabase = createPagesBrowserClient();