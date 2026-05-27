import { useState } from 'react';
import type { TodoItem, Project, UpdateTodoInput } from '../types/todo';
import TodoItemComp from './TodoItem';

interface Props {
  todos:    TodoItem[];
  projects: Project[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit:   (id: string, changes: UpdateTodoInput) => void;
}

export default function DateView({ todos, projects, onToggle, onDelete, onEdit }: Props) {
  const today   = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [from,          setFrom]          = useState(weekAgo);
  const [to,            setTo]            = useState(today);
  const [projectFilter, setProjectFilter] = useState('__all__');

  const projectMap = new Map(projects.map(p => [p.id, p]));

  const filtered = todos
    .filter(todo => {
      const d = todo.createdAt.split('T')[0];
      if (d < from || d > to) return false;
      if (projectFilter === '__none__') return !todo.projectId;
      if (projectFilter !== '__all__')  return todo.projectId === projectFilter;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="date-view">

      {/* 날짜 범위 + 프로젝트 필터 */}
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

        <div className="date-filter-project">
          <i className="fa-solid fa-folder-tree" />
          <select
            className="view-project-select"
            value={projectFilter}
            onChange={e => setProjectFilter(e.target.value)}
          >
            <option value="__all__">전체 프로젝트</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="__none__">📂 프로젝트 없음</option>
          </select>
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
          {filtered.map(todo => {
            const proj = todo.projectId ? projectMap.get(todo.projectId) : undefined;
            return (
              <TodoItemComp
                key={todo.id}
                item={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                projectName={proj?.name}
                projectColor={proj?.color}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
