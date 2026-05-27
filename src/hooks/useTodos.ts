import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbTodo } from '../lib/supabase';
import type { TodoItem, Category, AddTodoInput } from '../types/todo';

function dbToTodo(row: DbTodo): TodoItem {
  return {
    id:          row.id,
    title:       row.title,
    description: row.description ?? undefined,
    completed:   row.completed,
    category:    row.category as Category,
    projectId:   row.project_id ?? undefined,
    dueDate:     row.due_date ?? undefined,
    createdAt:   row.created_at,
    completedAt: row.completed_at ?? undefined,
  };
}

export interface UseTodosReturn {
  todos:      TodoItem[];
  loading:    boolean;
  error:      string | null;
  addTodo:    (input: AddTodoInput) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  refetch:    () => Promise<void>;
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
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else      setTodos((data as DbTodo[]).map(dbToTodo));
    setLoading(false);
  }, []);

  useEffect(() => { void fetchTodos(); }, [fetchTodos]);

  /* 할 일 추가 */
  const addTodo = async (input: AddTodoInput) => {
    const { data, error: err } = await supabase
      .from('todos')
      .insert([{
        title:       input.title,
        description: input.description || null,
        category:    input.category,
        project_id:  input.projectId  || null,
        due_date:    input.dueDate    || null,
      }])
      .select()
      .single();
    if (err) { setError(err.message); return; }
    setTodos(prev => [dbToTodo(data as DbTodo), ...prev]);
  };

  /* 완료 토글 (낙관적 업데이트) */
  const toggleTodo = async (id: string) => {
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

  /* 삭제 (낙관적 업데이트) */
  const deleteTodo = async (id: string) => {
    const prev = todos;
    setTodos(cur => cur.filter(t => t.id !== id));
    const { error: err } = await supabase.from('todos').delete().eq('id', id);
    if (err) { setTodos(prev); setError(err.message); }
  };

  return { todos, loading, error, addTodo, toggleTodo, deleteTodo, refetch: fetchTodos };
}
