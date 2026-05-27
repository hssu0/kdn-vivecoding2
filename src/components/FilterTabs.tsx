import type { FilterType, TodoItem } from '../types/todo';

interface Props {
  filter: FilterType;
  todos: TodoItem[];
  onFilterChange: (filter: FilterType) => void;
}

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all',       label: '전체' },
  { value: 'active',    label: '진행중' },
  { value: 'completed', label: '완료' },
];

export default function FilterTabs({ filter, todos, onFilterChange }: Props) {
  const counts: Record<FilterType, number> = {
    all:       todos.length,
    active:    todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  };

  return (
    <div className="filter-tabs">
      {FILTERS.map(f => (
        <button
          key={f.value}
          className={`filter-tab${filter === f.value ? ' active' : ''}`}
          onClick={() => onFilterChange(f.value)}
        >
          {f.label}
          <span className="filter-count">{counts[f.value]}</span>
        </button>
      ))}
    </div>
  );
}
