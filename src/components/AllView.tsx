import type { TodoItem } from '../types/todo';
import TodoItemComp from './TodoItem';

interface Props {
  todos: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

export default function AllView({ todos, onToggle, onDelete }: Props) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <i className="fa-solid fa-clipboard-list" />
        <p>일지가 없습니다. 할 일을 추가해보세요!</p>
      </div>
    );
  }

  const sorted = [...todos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const grouped = groupByDate(sorted);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="all-view">
      {dates.map(date => (
        <div key={date} className="date-group">
          <div className="date-group-header">
            <i className="fa-regular fa-calendar" />
            <span>{formatGroupDate(date)}</span>
            <span className="date-count">{grouped[date].length}건</span>
          </div>
          {grouped[date].map(todo => (
            <TodoItemComp
              key={todo.id}
              item={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
