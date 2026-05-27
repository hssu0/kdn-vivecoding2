import { useState } from 'react';
import type { TodoItem } from '../types/todo';
import TodoItemComp from './TodoItem';

interface Props {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DateView({ todos, onToggle, onDelete }: Props) {
  const today    = new Date().toISOString().split('T')[0];
  const weekAgo  = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [from, setFrom] = useState(weekAgo);
  const [to,   setTo]   = useState(today);

  const filtered = todos
    .filter(todo => {
      const d = todo.createdAt.split('T')[0];
      return d >= from && d <= to;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="date-view">
      {/* 날짜 범위 필터 */}
      <div className="date-filter-box">
        <div className="date-filter-row">
          <label className="date-label">
            <span><i className="fa-regular fa-calendar-minus" /> 시작일</span>
            <input
              type="date"
              className="date-input"
              value={from}
              max={to}
              onChange={e => setFrom(e.target.value)}
            />
          </label>

          <span className="date-separator">~</span>

          <label className="date-label">
            <span><i className="fa-regular fa-calendar-plus" /> 종료일</span>
            <input
              type="date"
              className="date-input"
              value={to}
              min={from}
              onChange={e => setTo(e.target.value)}
            />
          </label>
        </div>

        <div className="date-filter-result">
          <i className="fa-solid fa-filter" />
          <strong>{filtered.length}</strong>건 검색됨
        </div>
      </div>

      {/* 결과 목록 */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-magnifying-glass" />
          <p>선택한 기간에 일지가 없습니다.</p>
        </div>
      ) : (
        <div className="todo-list">
          {filtered.map(todo => (
            <TodoItemComp
              key={todo.id}
              item={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
