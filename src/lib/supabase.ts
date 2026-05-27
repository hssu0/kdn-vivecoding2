import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL     as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '.env 파일에 VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를 설정해주세요.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── DB Row 타입 (scripts/schema.sql 과 1:1 대응) ─────────
export interface DbTodo {
  id:           string;
  title:        string;
  description:  string | null;
  completed:    boolean;
  category:     string;
  project_id:   string | null;
  due_date:     string | null;   // DATE → YYYY-MM-DD
  sort_order:   number | null;   // 표시 순서 (NULL = 미설정)
  created_at:   string;
  completed_at: string | null;
}

export interface DbProject {
  id:         string;
  name:       string;
  color:      string;
  created_at: string;
}
