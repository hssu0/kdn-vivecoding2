import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '.env 파일에 VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를 설정해주세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── DB 행(row) 타입 ───────────────────────────────────────
// scripts/schema.sql 의 todos 테이블과 1:1 대응
export interface DbTodo {
  id:           string;
  title:        string;
  completed:    boolean;
  category:     string;
  created_at:   string;   // TIMESTAMPTZ → ISO string
  completed_at: string | null;
}
