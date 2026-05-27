import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbTodo } from '../lib/supabase';
import type { TodoItem, Category } from '../types/todo';

// ── DB 행 → 앱 모델 변환 ──────────────────────────────────
function dbToTodo(row: DbTodo): TodoItem {
  return {
    id:          row.id,
    title:       row.title,
    completed:   row.completed,
    category:    row.category as Category,
    createdAt:   row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

// ── 훅 반환 타입 ──────────────────────────────────────────
export interface UseTodosReturn {
  todos:      TodoItem[];
  loading:    boolean;
  error:      string | null;
  addTodo:    (title: string, category: Category) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refetch:    () => Promise<void>;
}

// ── 메인 훅 ──────────────────────────────────────────────
export function useTodos(): UseTodosReturn {
  const [todos,   setTodos]   = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  /* 전체 목록 조회 */
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setTodos((data as DbTodo[]).map(dbToTodo));
    }
    setLoading(false);
  }, []);

  /* 마운트 시 최초 로드 */
  useEffect(() => {
    void fetchTodos();
  }, [fetchTodos]);

  /* 할 일 추가 */
  const addTodo = async (title: string, category: Category) => {
    const { data, error: err } = await supabase
      .from('todos')
      .insert([{ title, category }])
      .select()
      .single();

    if (err) {
      setError(err.message);
      return;
    }
    setTodos(prev => [dbToTodo(data as DbTodo), ...prev]);
  };

  /* 완료 토글 */
  const toggleTodo = async (id: string) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;

    const completed    = !target.completed;
    const completed_at = completed ? new Date().toISOString() : null;

    // 낙관적 업데이트
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed, completedAt: completed_at ?? undefined }
          : t
      )
    );

    const { error: err } = await supabase
      .from('todos')
      .update({ completed, completed_at })
      .eq('id', id);

    if (err) {
      // 롤백
      setTodos(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, completed: target.completed, completedAt: target.completedAt }
            : t
        )
      );
      setError(err.message);
    }
  };

  /* 할 일 삭제 */
  const deleteTodo = async (id: string) => {
    // 낙관적 삭제
    const prev = todos;
    setTodos(cur => cur.filter(t => t.id !== id));

    const { error: err } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (err) {
      setTodos(prev); // 롤백
      setError(err.message);
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
