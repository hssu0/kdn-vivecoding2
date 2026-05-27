import { useState } from 'react';
import {
  CATEGORIES, CATEGORY_COLORS, CATEGORY_BG,
  type Category, type TodoItem as TodoItemType, type UpdateTodoInput,
} from '../types/todo';

interface Props {
  item:          TodoItemType;
  onToggle:      (id: string) => void;
  onDelete:      (id: string) => void;
  onEdit:        (id: string, changes: UpdateTodoInput) => void;
  projectName?:  string;
  projectColor?: string;
  /* 드래그-앤-드롭 (작성탭 전용, 선택) */
  isDragging?:   boolean;
  isDragOver?:   boolean;
  onDragStart?:  (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?:   (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?:       (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?:    () => void;
}

function fmtDate(isoStr: string, dateOnly = false): string {
  const d = dateOnly ? new Date(isoStr + 'T00:00:00') : new Date(isoStr);
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

export default function TodoItem({
  item, onToggle, onDelete, onEdit,
  projectName, projectColor,
  isDragging, isDragOver,
  onDragStart, onDragOver, onDrop, onDragEnd,
}: Props) {
  const hasDrag = !!onDragStart;

  /* ── 편집 상태 ── */
  const [isEditing,    setIsEditing]    = useState(false);
  const [editTitle,    setEditTitle]    = useState('');
  const [editDesc,     setEditDesc]     = useState('');
  const [editDue,      setEditDue]      = useState('');
  const [editCategory, setEditCategory] = useState<Category>(item.category);

  const today     = new Date().toISOString().split('T')[0];
  const isOverdue = !!item.dueDate && !item.completed && item.dueDate < today;

  /* 편집 시작 */
  const startEdit = () => {
    setEditTitle(item.title);
    setEditDesc(item.description ?? '');
    setEditDue(item.dueDate ?? '');
    setEditCategory(item.category);
    setIsEditing(true);
  };

  /* 저장 */
  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(item.id, {
      title:       editTitle.trim(),
      description: editDesc.trim() || undefined,
      category:    editCategory,
      dueDate:     editDue || undefined,
    });
    setIsEditing(false);
  };

  /* 취소 */
  const handleCancel = () => setIsEditing(false);

  /* 키보드 단축키 */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSave();
  };

  return (
    <div
      className={[
        'todo-item',
        item.completed  ? 'completed'   : '',
        isDragging      ? 'is-dragging' : '',
        isDragOver      ? 'drop-target' : '',
        isEditing       ? 'is-editing'  : '',
      ].filter(Boolean).join(' ')}
      draggable={hasDrag && !isEditing}
      onDragStart={hasDrag ? onDragStart : undefined}
      onDragOver={hasDrag ? onDragOver : undefined}
      onDrop={hasDrag ? onDrop : undefined}
      onDragEnd={hasDrag ? onDragEnd : undefined}
    >

      {/* ── 드래그 핸들 ── */}
      {hasDrag && !isEditing && (
        <span className="drag-handle" title="드래그하여 순서 변경">
          <i className="fa-solid fa-grip-vertical" />
        </span>
      )}

      {/* ── 체크박스 ── */}
      {!isEditing && (
        <label className="todo-checkbox-wrapper" title={item.completed ? '완료 취소' : '완료 처리'}>
          <input
            type="checkbox"
            className="todo-checkbox"
            checked={item.completed}
            onChange={() => onToggle(item.id)}
          />
          <span className="todo-checkmark">
            {item.completed && <i className="fa-solid fa-check" />}
          </span>
        </label>
      )}

      {/* ── 표시 모드 ── */}
      {!isEditing && (
        <div className="todo-content">
          <div className="todo-main">
            <span className="todo-title">{item.title}</span>
            <span
              className="todo-category"
              style={{ color: CATEGORY_COLORS[item.category], backgroundColor: CATEGORY_BG[item.category] }}
            >
              {item.category}
            </span>
            {projectName && (
              <span
                className="todo-project-badge"
                style={{ borderColor: projectColor ?? '#B8C0D6', color: projectColor ?? '#4A5A7C' }}
              >
                <i className="fa-solid fa-folder" /> {projectName}
              </span>
            )}
          </div>
          {item.description && (
            <p className="todo-description">{item.description}</p>
          )}
          <div className="todo-dates">
            <span className="todo-created-date">
              <i className="fa-regular fa-clock" />
              작성 {fmtDate(item.createdAt)}
            </span>
            {item.dueDate && (
              <span className={`todo-due-date${isOverdue ? ' overdue' : ''}`}>
                <i className="fa-regular fa-calendar-xmark" />
                마감 {fmtDate(item.dueDate, true)}
                {isOverdue && <span className="overdue-tag">지연</span>}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── 편집 모드 ── */}
      {isEditing && (
        <div className="todo-edit-body" onKeyDown={handleKeyDown}>

          {/* Row 1: 제목 + 카테고리 */}
          <div className="todo-edit-row">
            <input
              autoFocus
              type="text"
              className="todo-input todo-edit-title"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              maxLength={100}
            />
            <select
              className="category-select"
              value={editCategory}
              onChange={e => setEditCategory(e.target.value as Category)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Row 2: 세부 내용 */}
          <textarea
            className="todo-textarea todo-edit-desc"
            value={editDesc}
            onChange={e => setEditDesc(e.target.value)}
            placeholder="세부 내용 (선택)"
            rows={2}
            maxLength={500}
          />

          {/* Row 3: 마감일 + 저장/취소 */}
          <div className="todo-edit-footer">
            <label className="todo-edit-due">
              <span className="form-field-label">
                <i className="fa-regular fa-calendar-xmark" /> 마감일
              </span>
              <input
                type="date"
                className="form-date-input"
                value={editDue}
                onChange={e => setEditDue(e.target.value)}
              />
            </label>
            <div className="todo-edit-actions">
              <button
                type="button"
                className="btn-edit-save"
                onClick={handleSave}
                disabled={!editTitle.trim()}
              >
                <i className="fa-solid fa-check" /> 저장
              </button>
              <button
                type="button"
                className="btn-edit-cancel"
                onClick={handleCancel}
              >
                취소
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── 우측 버튼 (편집/삭제) ── */}
      {!isEditing && (
        <div className="todo-actions">
          <button
            className="todo-edit-btn"
            onClick={startEdit}
            aria-label="편집"
            title="편집"
          >
            <i className="fa-regular fa-pen-to-square" />
          </button>
          <button
            className="todo-delete"
            onClick={() => onDelete(item.id)}
            aria-label="삭제"
            title="삭제"
          >
            <i className="fa-solid fa-trash-can" />
          </button>
        </div>
      )}
    </div>
  );
}
