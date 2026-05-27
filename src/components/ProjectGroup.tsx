import { useState } from 'react';
import type { Project, TodoItem, UpdateTodoInput } from '../types/todo';
import TodoItemComp from './TodoItem';

interface Props {
  project:          Project | null;   // null → '프로젝트 없음' 그룹
  todos:            TodoItem[];
  onToggle:         (id: string) => void;
  onDelete:         (id: string) => void;
  onEdit:           (id: string, changes: UpdateTodoInput) => void;
  onDeleteProject?: (id: string) => void;
  onReorder?:       (orderedIds: string[]) => void;
}

export default function ProjectGroup({
  project, todos, onToggle, onDelete, onEdit, onDeleteProject, onReorder,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);

  /* ── 드래그-앤-드롭 상태 ── */
  const [draggingId,   setDraggingId]   = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (id !== draggingId) setDropTargetId(id);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    const ids     = todos.map(t => t.id);
    const fromIdx = ids.indexOf(draggingId);
    const toIdx   = ids.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;

    const newIds = [...ids];
    newIds.splice(fromIdx, 1);
    newIds.splice(toIdx, 0, draggingId);

    onReorder?.(newIds);
    setDraggingId(null);
    setDropTargetId(null);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDropTargetId(null);
  };

  /* ── 표시 계산 ── */
  const done      = todos.filter(t => t.completed).length;
  const barColor  = project?.color ?? '#B8C0D6';
  const groupName = project ? project.name : '📂 프로젝트 없음';
  const pct       = todos.length > 0 ? Math.round((done / todos.length) * 100) : 0;

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
        <i className={`fa-solid ${collapsed ? 'fa-chevron-right' : 'fa-chevron-down'} proj-chevron`} />
        <span className="project-name">{groupName}</span>

        <div className="project-progress-wrap">
          <div className="project-progress-bar">
            <div
              className="project-progress-fill"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>
          <span className="project-count">{done}/{todos.length}</span>
        </div>

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
                onEdit={onEdit}
                isDragging={draggingId   === todo.id}
                isDragOver={dropTargetId === todo.id}
                onDragStart={e => handleDragStart(e, todo.id)}
                onDragOver={e  => handleDragOver(e, todo.id)}
                onDrop={e      => handleDrop(e, todo.id)}
                onDragEnd={handleDragEnd}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
