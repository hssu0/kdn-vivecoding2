import { useState } from 'react';
import { CATEGORIES, type Category } from '../types/todo';

interface Props {
  onAdd: (title: string, category: Category) => void;
}

export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('업무');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), category);
    setTitle('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <input
          type="text"
          className="todo-input"
          placeholder="할 일을 입력하세요…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
        />
        <select
          className="category-select"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" className="btn-add">
          <i className="fa-solid fa-plus" /> 추가
        </button>
      </div>
    </form>
  );
}
