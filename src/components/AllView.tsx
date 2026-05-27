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

function groupByDate(items: TodoItem[]): Record<string, TodoItem[]> {
  return items.reduce<Record<string, TodoItem[]>>((acc, todo) => {
    const date = todo.createdAt.split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(todo);
    return acc;
  }, {});
}

function formatGroupDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
}

export default function AllView({ todos, projects, onToggle, onDelete, onEdit }: Props) {
  const [projectFilter, setProjectFilter] = useState('__all__');

  const projectMap = new Map(projects.map(p => [p.id, p]));

  const filtered =
    projectFilter === '__all__'  ? todos :
    projectFilter === '__none__' ? todos.filter(t => !t.projectId) :
    todos.filter(t => t.projectId === projectFilter);

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-clipboard-list" />
        <p>일지가 없습니다. 할 일을 추가해보세요!</p>
      </div>
    );
  }

  const sorted  = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const grouped = groupByDate(sorted);
  const dates   = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="all-view">

      {/* 프로젝트 필터 */}
      <div className="view-filter-bar">
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
        <span className="view-filter-count">{filtered.length}건</span>
      </div>

      {/* 날짜별 그룹 */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <i className="fa-solid fa-magnifying-glass" />
          <p>해당 프로젝트에 일지가 없습니다.</p>
        </div>
      ) : (
        dates.map(date => (
          <div key={date} className="date-group">
            <div className="date-group-header">
              <i className="fa-regular fa-calendar" />
              <span>{formatGroupDate(date)}</span>
              <span className="date-count">{grouped[date].length}건</span>
            </div>
            {grouped[date].map(todo => {
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
        ))
      )}
    </div>
  );
}
