import { CATEGORY_COLORS, CATEGORY_BG, type TodoItem as TodoItemType } from '../types/todo';

interface Props {
  item:          TodoItemType;
  onToggle:      (id: string) => void;
  onDelete:      (id: string) => void;
  projectName?:  string;
  projectColor?: string;
}

function fmtDate(isoStr: string, dateOnly = false): string {
  const d = dateOnly
    ? new Date(isoStr + 'T00:00:00')
    : new Date(isoStr);
  return d.toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' });
}

export default function TodoItem({ item, onToggle, onDelete, projectName, projectColor }: Props) {
  const today     = new Date().toISOString().split('T')[0];
  const isOverdue = !!item.dueDate && !item.completed && item.dueDate < today;

  return (
    <div className={`todo-item${item.completed ? ' completed' : ''}`}>

      {/* ── 체크박스 ── */}
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

      {/* ── 내용 영역 ── */}
      <div className="todo-content">

        {/* 제목 + 카테고리 + 프로젝트 배지 */}
        <div className="todo-main">
          <span className="todo-title">{item.title}</span>
          <span
            className="todo-category"
            style={{
              color:           CATEGORY_COLORS[item.category],
              backgroundColor: CATEGORY_BG[item.category],
            }}
          >
            {item.category}
          </span>
          {projectName && (
            <span
              className="todo-project-badge"
              style={{
                borderColor: projectColor ?? '#B8C0D6',
                color:       projectColor ?? '#4A5A7C',
              }}
            >
              <i className="fa-solid fa-folder" /> {projectName}
            </span>
          )}
        </div>

        {/* 세부 내용 */}
        {item.description && (
          <p className="todo-description">{item.description}</p>
        )}

        {/* 날짜 행 */}
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

      {/* ── 삭제 버튼 ── */}
      <button
        className="todo-delete"
        onClick={() => onDelete(item.id)}
        aria-label="삭제"
        title="삭제"
      >
        <i className="fa-solid fa-trash-can" />
      </button>
    </div>
  );
}
