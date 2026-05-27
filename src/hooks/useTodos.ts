import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbTodo } from '../lib/supabase';
import type { TodoItem, Category, AddTodoInput, UpdateTodoInput } from '../types/todo';

function dbToTodo(row: DbTodo): TodoItem {
  return {
    id:          row.id,
    title:       row.title,
    description: row.description  ?? undefined,
    completed:   row.completed,
    category:    row.category as Category,
    projectId:   row.project_id   ?? undefined,
    dueDate:     row.due_date     ?? undefined,
    sortOrder:   row.sort_order   ?? 999999,
    createdAt:   row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

export interface UseTodosReturn {
  todos:        TodoItem[];
  loading:      boolean;
  error:        string | null;
  addTodo:      (input: AddTodoInput) => Promise<void>;
  updateTodo:   (id: string, changes: UpdateTodoInput) => Promise<void>;
  toggleTodo:   (id: string) => Promise<void>;
  deleteTodo:   (id: string) => Promise<void>;
  reorderTodos: (orderedIds: string[]) => Promise<void>;
  refetch:      () => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos,   setTodos]   = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('todos')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at',  { ascending: true });
    if (err) setError(err.message);
    else     setTodos((data as DbTodo[]).map(dbToTodo));
    setLoading(false);
  }, []);

  useEffect(() => { void fetchTodos(); }, [fetchTodos]);

  /* ── 할 일 추가 ── */
  const addTodo = async (input: AddTodoInput): Promise<void> => {
    const { data, error: err } = await supabase
      .from('todos')
      .insert([{
        title:       input.title,
        description: input.description || null,
        category:    input.category,
        project_id:  input.projectId  || null,
        due_date:    input.dueDate    || null,
        sort_order:  null,
      }])
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setTodos(prev => [...prev, dbToTodo(data as DbTodo)]);
  };

  /* ── 할 일 수정 (낙관적 업데이트) ── */
  const updateTodo = async (id: string, changes: UpdateTodoInput): Promise<void> => {
    const snapshot = todos;
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title:       changes.title,
              description: changes.description,
              category:    changes.category,
              dueDate:     changes.dueDate,
            }
          : t
      )
    );
    const { error: err } = await supabase
      .from('todos')
      .update({
        title:       changes.title,
        description: changes.description ?? null,
        category:    changes.category,
        due_date:    changes.dueDate     ?? null,
      })
      .eq('id', id);
    if (err) {
      setTodos(snapshot);
      setError(err.message);
    }
  };

  /* ── 완료 토글 (낙관적 업데이트) ── */
  const toggleTodo = async (id: string): Promise<void> => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const completed    = !target.completed;
    const completed_at = completed ? new Date().toISOString() : null;

    setTodos(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed, completedAt: completed_at ?? undefined } : t
      )
    );
    const { error: err } = await supabase
      .from('todos').update({ completed, completed_at }).eq('id', id);
    if (err) {
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

  /* ── 삭제 (낙관적 업데이트) ── */
  const deleteTodo = async (id: string): Promise<void> => {
    const snapshot = todos;
    setTodos(cur => cur.filter(t => t.id !== id));
    const { error: err } = await supabase.from('todos').delete().eq('id', id);
    if (err) { setTodos(snapshot); setError(err.message); }
  };

  /* ── 순서 변경 (낙관적 업데이트 + 일괄 저장) ── */
  const reorderTodos = async (orderedIds: string[]): Promise<void> => {
    const orderedSet = new Set(orderedIds);
    const indexMap   = new Map(orderedIds.map((id, i) => [id, i]));

    setTodos(prev => {
      // 재정렬 대상의 현재 위치 파악
      const positions: number[] = [];
      prev.forEach((t, i) => { if (orderedSet.has(t.id)) positions.push(i); });

      // 새 순서로 정렬
      const sorted = [...prev]
        .filter(t => orderedSet.has(t.id))
        .sort((a, b) => (indexMap.get(a.id) ?? 0) - (indexMap.get(b.id) ?? 0))
        .map((t, i) => ({ ...t, sortOrder: i }));

      // 기존 배열의 해당 위치에 교체
      const result = [...prev];
      positions.forEach((pos, i) => { result[pos] = sorted[i]; });
      return result;
    });

    // Supabase 일괄 업데이트
    await Promise.all(
      orderedIds.map((id, sort_order) =>
        supabase.from('todos').update({ sort_order }).eq('id', id)
      )
    );
  };

  return {
    todos, loading, error,
    addTodo, updateTodo, toggleTodo, deleteTodo, reorderTodos,
    refetch: fetchTodos,
  };
}
