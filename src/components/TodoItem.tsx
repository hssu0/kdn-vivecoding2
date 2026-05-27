import { CATEGORY_COLORS, CATEGORY_BG, type TodoItem as TodoItemType } from '../types/todo';

interface Props {
  item: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDelete }: Props) {
  const dateStr = new Date(item.createdAt).toLocaleDateString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className={`todo-item${item.completed ? ' completed' : ''}`}>
      {/* 체크박스 */}
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

      {/* 내용 */}
      <div className="todo-content">
        <span className="todo-title">{item.title}</span>
        <span
          className="todo-category"
          style={{
            color: CATEGORY_COLORS[item.category],
            backgroundColor: CATEGORY_BG[item.category],
          }}
        >
          {item.category}
        </span>
      </div>

      {/* 날짜 */}
      <span className="todo-date">{dateStr}</span>

      {/* 삭제 버튼 */}
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
