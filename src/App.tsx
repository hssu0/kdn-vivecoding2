import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Navbar    from './components/Navbar';
import TodoForm  from './components/TodoForm';
import FilterTabs from './components/FilterTabs';
import TodoItem  from './components/TodoItem';
import AllView   from './components/AllView';
import DateView  from './components/DateView';
import StatsView from './components/StatsView';
import type {
  TodoItem as TodoItemType,
  FilterType,
  MainTab,
  ViewTab,
  Category,
} from './types/todo';

const VIEW_TABS: { value: ViewTab; icon: string; text: string }[] = [
  { value: 'all',   icon: 'fa-solid fa-list',              text: '전체 목록' },
  { value: 'date',  icon: 'fa-regular fa-calendar-days',   text: '날짜별 조회' },
  { value: 'stats', icon: 'fa-solid fa-chart-pie',         text: '통계' },
];

export default function App() {
  const [todos, setTodos] = useLocalStorage<TodoItemType[]>('kdn-journal-todos', []);
  const [mainTab,    setMainTab]    = useState<MainTab>('write');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewTab,    setViewTab]    = useState<ViewTab>('all');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  /* ── CRUD ── */
  const addTodo = (title: string, category: Category) => {
    const item: TodoItemType = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      completed: false,
      category,
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [item, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined }
          : t
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  /* ── 저장 버튼 ── */
  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'),  300);
    setTimeout(() => setSaveStatus('idle'),  2200);
  };

  /* ── 필터 ── */
  const filteredTodos = useMemo(() => {
    if (filterType === 'active')    return todos.filter(t => !t.completed);
    if (filterType === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filterType]);

  const emptyMsg =
    filterType === 'active'    ? '진행중인 할 일이 없습니다.' :
    filterType === 'completed' ? '완료된 할 일이 없습니다.'   :
    '할 일을 위에서 추가해보세요!';

  return (
    <>
      <Navbar onSave={handleSave} saveStatus={saveStatus} />

      {/* ── 메인 탭 ── */}
      <div className="main-tabs">
        <div className="container">
          <button
            className={`main-tab${mainTab === 'write' ? ' active' : ''}`}
            onClick={() => setMainTab('write')}
          >
            <i className="fa-solid fa-pen-to-square" /> 일지 작성
          </button>
          <button
            className={`main-tab${mainTab === 'view' ? ' active' : ''}`}
            onClick={() => setMainTab('view')}
          >
            <i className="fa-solid fa-list-check" /> 일지 조회
          </button>
        </div>
      </div>

      <main className="main-content">
        <div className="container">

          {/* ────────────── 일지 작성 ────────────── */}
          {mainTab === 'write' && (
            <div className="write-section">

              {/* 할 일 추가 */}
              <div className="section-card">
                <div className="card-header">
                  <h2><i className="fa-solid fa-circle-plus" /> 할 일 추가</h2>
                </div>
                <TodoForm onAdd={addTodo} />
              </div>

              {/* 할 일 목록 */}
              <div className="section-card">
                <div className="card-header">
                  <h2><i className="fa-solid fa-list-ul" /> 할 일 목록</h2>
                  <span className="total-count">{todos.length}건</span>
                </div>

                <FilterTabs
                  filter={filterType}
                  todos={todos}
                  onFilterChange={setFilterType}
                />

                <div className="todo-list">
                  {filteredTodos.length === 0 ? (
                    <div className="empty-state">
                      <i className="fa-solid fa-clipboard-list" />
                      <p>{emptyMsg}</p>
                    </div>
                  ) : (
                    filteredTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        item={todo}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ────────────── 일지 조회 ────────────── */}
          {mainTab === 'view' && (
            <div className="view-section">

              <div className="view-tabs-bar">
                {VIEW_TABS.map(({ value, icon, text }) => (
                  <button
                    key={value}
                    className={`view-tab${viewTab === value ? ' active' : ''}`}
                    onClick={() => setViewTab(value)}
                  >
                    <i className={icon} /> {text}
                  </button>
                ))}
              </div>

              <div className="section-card">
                {viewTab === 'all'   && <AllView   todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />}
                {viewTab === 'date'  && <DateView  todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />}
                {viewTab === 'stats' && <StatsView todos={todos} />}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <i className="fa-solid fa-leaf" />
          <strong>KDN 업무 일지</strong> · 한전KDN 미터링시스템부 · 풀스택 바이브코딩 실습
        </div>
      </footer>
    </>
  );
}
