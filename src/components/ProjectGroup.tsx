import { useState } from 'react';
import type { Project, TodoItem } from '../types/todo';
import TodoItemComp from './TodoItem';

interface Props {
  project:          Project | null;   // null → '프로젝트 없음' 그룹
  todos:            TodoItem[];
  onToggle:         (id: string) => void;
  onDelete:         (id: string) => void;
  onDeleteProject?: (id: string) => void;
}

export default function ProjectGroup({
  project, todos, onToggle, onDelete, onDeleteProject,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  const done      = todos.filter(t => t.completed).length;
  const barColor  = project?.color ?? '#B8C0D6';
  const groupName = project ? project.name : '📂 프로젝트 없음';

  const pct = todos.length > 0 ? Math.round((done / todos.length) * 100) : 0;

  return (
    <div className="project-group">

      {/* ── 헤더 ── */}
      <div
        className="project-group-header"
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(c => !c)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setCollapsed(c => !c)}
      >
        <span className="project-color-bar" style={{ backgroundColor: barColor }} />

        <i
          className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-down'} proj-chevron`}
        />

        <span className="project-name">{groupName}</span>

        {/* 진행률 바 */}
        <div className="project-progress-wrap">
          <div className="project-progress-bar">
            <div
              className="project-progress-fill"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="project-count">{done}/{todos.length}</span>
        </div>

        {/* 프로젝트 삭제 */}
        {project && onDeleteProject && (
          <button
            className="project-del-btn"
            title="프로젝트 삭제"
            onClick={e => {
              e.stopPropagation();
              if (window.confirm(
                `"${project.name}" 프로젝트를 삭제할까요?\n소속 할 일은 '프로젝트 없음'으로 이동됩니다.`
              )) {
                void onDeleteProject(project.id);
              }
            }}
          >
            <i className="fa-solid fa-trash" />
          </button>
        )}
      </div>

      {/* ── 할 일 목록 ── */}
      {!collapsed && (
        <div className="project-todos">
          {todos.length === 0 ? (
            <div className="project-empty">
              <i className="fa-regular fa-folder-open" />
              <span>이 프로젝트에 할 일이 없습니다.</span>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItemComp
                key={todo.id}
                item={todo}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
