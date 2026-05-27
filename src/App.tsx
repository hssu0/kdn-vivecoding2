import { useState, useMemo } from 'react';
import { useTodos }    from './hooks/useTodos';
import { useProjects } from './hooks/useProjects';
import Navbar        from './components/Navbar';
import TodoForm      from './components/TodoForm';
import FilterTabs    from './components/FilterTabs';
import ProjectGroup  from './components/ProjectGroup';
import AllView       from './components/AllView';
import DateView      from './components/DateView';
import StatsView     from './components/StatsView';
import type { FilterType, MainTab, ViewTab, AddTodoInput, UpdateTodoInput } from './types/todo';

export default function App() {
  const {
    todos, loading, error,
    addTodo, updateTodo, toggleTodo, deleteTodo, reorderTodos,
    refetch: refetchTodos,
  } = useTodos();

  const { projects, addProject, deleteProject } = useProjects();

  const [mainTab,    setMainTab]    = useState<MainTab>('write');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [viewTab,    setViewTab]    = useState<ViewTab>('all');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  /* ── 동기화 ── */
  const handleSave = () => {
    setSaveStatus('saving');
    void refetchTodos().then(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2200);
    });
  };

  /* ── CRUD 래퍼 ── */
  const handleAdd           = (input: AddTodoInput)                      => { void addTodo(input); };
  const handleUpdate        = (id: string, changes: UpdateTodoInput)     => { void updateTodo(id, changes); };
  const handleToggle        = (id: string)                               => { void toggleTodo(id); };
  const handleDelete        = (id: string)                               => { void deleteTodo(id); };
  const handleReorder       = (orderedIds: string[])                     => { void reorderTodos(orderedIds); };
  const handleDeleteProject = (id: string)                               => { void deleteProject(id); };

  const handleCreateProject = async (name: string, color: string): Promise<string | null> => {
    const p = await addProject(name, color);
    return p?.id ?? null;
  };

  /* ── 필터 ── */
  const filteredTodos = useMemo(() => {
    if (filterType === 'active')    return todos.filter(t => !t.completed);
    if (filterType === 'completed') return todos.filter(t => t.completed);
    return todos;
  }, [todos, filterType]);

  const unassignedTodos = filteredTodos.filter(t => !t.projectId);
  const showUnassigned  = unassignedTodos.length > 0 || projects.length === 0;

  const emptyMsg =
    filterType === 'active'    ? '진행중인 할 일이 없습니다.'  :
    filterType === 'completed' ? '완료된 할 일이 없습니다.'    :
    '위에서 할 일을 추가해보세요!';

  return (
    <>
      <Navbar
        onSave={handleSave}
        saveStatus={saveStatus}
        connected={!error}
        mainTab={mainTab}
        onMainTab={setMainTab}
        viewTab={viewTab}
        onViewTab={setViewTab}
      />

      {error && (
        <div className="error-banner">
          <i className="fa-solid fa-circle-exclamation" />
          <span>Supabase 연결 오류: {error}</span>
          <button className="error-retry" onClick={handleSave}>재시도</button>
        </div>
      )}

      <main className="main-content">
        <div className="container">

          {loading && (
            <div className="loading-screen">
              <div className="loading-spinner" />
              <p>Supabase에서 데이터를 불러오는 중…</p>
            </div>
          )}

          {/* ────────── 일지 작성 ────────── */}
          {!loading && mainTab === 'write' && (
            <div className="write-section">

              <div className="section-card">
                <div className="card-header">
                  <h2><i className="fa-solid fa-circle-plus" /> 할 일 추가</h2>
                </div>
                <TodoForm
                  onAdd={handleAdd}
                  projects={projects}
                  onCreateProject={handleCreateProject}
                />
              </div>

              <div className="section-card">
                <div className="card-header">
                  <h2><i className="fa-solid fa-folder-tree" /> 할 일 목록</h2>
                  <span className="total-count">{todos.length}건</span>
                </div>
                <FilterTabs
                  filter={filterType}
                  todos={todos}
                  onFilterChange={setFilterType}
                />
                <div className="project-list-wrapper">
                  {filteredTodos.length === 0 ? (
                    <div className="empty-state">
                      <i className="fa-solid fa-clipboard-list" />
                      <p>{emptyMsg}</p>
                    </div>
                  ) : (
                    <>
                      {projects.map(project => (
                        <ProjectGroup
                          key={project.id}
                          project={project}
                          todos={filteredTodos.filter(t => t.projectId === project.id)}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onEdit={handleUpdate}
                          onDeleteProject={handleDeleteProject}
                          onReorder={handleReorder}
                        />
                      ))}
                      {showUnassigned && (
                        <ProjectGroup
                          project={null}
                          todos={unassignedTodos}
                          onToggle={handleToggle}
                          onDelete={handleDelete}
                          onEdit={handleUpdate}
                          onReorder={handleReorder}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ────────── 일지 조회 ────────── */}
          {!loading && mainTab === 'view' && (
            <div className="view-section">
              <div className="section-card">
                {viewTab === 'all'   && <AllView   todos={todos} projects={projects} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleUpdate} />}
                {viewTab === 'date'  && <DateView  todos={todos} projects={projects} onToggle={handleToggle} onDelete={handleDelete} onEdit={handleUpdate} />}
                {viewTab === 'stats' && <StatsView todos={todos} projects={projects} />}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <i className="fa-solid fa-database" />
          <strong>KDN 업무 일지</strong> · Supabase 연동 · 한전KDN 미터링시스템부
        </div>
      </footer>
    </>
  );
}
