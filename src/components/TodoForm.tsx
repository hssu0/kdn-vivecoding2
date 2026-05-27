import { useState } from 'react';
import {
  CATEGORIES, PROJECT_COLORS,
  type Category, type AddTodoInput, type Project,
} from '../types/todo';

interface Props {
  onAdd:           (input: AddTodoInput) => void;
  projects:        Project[];
  onCreateProject: (name: string, color: string) => Promise<string | null>;
}

export default function TodoForm({ onAdd, projects, onCreateProject }: Props) {
  const [title,        setTitle]       = useState('');
  const [description,  setDesc]        = useState('');
  const [category,     setCategory]    = useState<Category>('업무');
  const [projectId,    setProjectId]   = useState('');
  const [dueDate,      setDueDate]     = useState('');

  /* 새 프로젝트 인라인 생성 상태 */
  const [creatingProj,  setCreatingProj] = useState(false);
  const [newProjName,   setNewProjName]  = useState('');
  const [newProjColor,  setNewProjColor] = useState(PROJECT_COLORS[0]);
  const [projSaving,    setProjSaving]   = useState(false);

  const today = new Date().toISOString().split('T')[0];

  /* 프로젝트 셀렉트 변경 */
  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '__new__') {
      setCreatingProj(true);
    } else {
      setProjectId(e.target.value);
    }
  };

  /* 새 프로젝트 저장 */
  const handleSaveNewProject = async () => {
    if (!newProjName.trim() || projSaving) return;
    setProjSaving(true);
    const newId = await onCreateProject(newProjName.trim(), newProjColor);
    if (newId) {
      setProjectId(newId);
      setCreatingProj(false);
      setNewProjName('');
      setNewProjColor(PROJECT_COLORS[0]);
    }
    setProjSaving(false);
  };

  const cancelNewProject = () => {
    setCreatingProj(false);
    setNewProjName('');
    setNewProjColor(PROJECT_COLORS[0]);
    setProjectId('');
  };

  /* 폼 제출 */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title:       title.trim(),
      description: description.trim() || undefined,
      category,
      projectId:   projectId || undefined,
      dueDate:     dueDate   || undefined,
    });
    setTitle('');
    setDesc('');
    setDueDate('');
    /* 카테고리·프로젝트는 유지 (연속 입력 편의) */
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>

      {/* ── Row 1: 제목 + 카테고리 ── */}
      <div className="form-row">
        <input
          type="text"
          className="todo-input"
          placeholder="제목을 입력하세요 *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={100}
        />
        <select
          className="category-select"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Row 2: 세부 내용 ── */}
      <textarea
        className="todo-textarea"
        placeholder="세부 내용을 입력하세요 (선택)"
        value={description}
        onChange={e => setDesc(e.target.value)}
        rows={2}
        maxLength={500}
      />

      {/* ── Row 3: 마감일 + 프로젝트 ── */}
      <div className="form-row form-row-extra">
        <label className="form-field-group">
          <span className="form-field-label">
            <i className="fa-regular fa-calendar-xmark" /> 마감일
          </span>
          <input
            type="date"
            className="date-input form-date-input"
            value={dueDate}
            min={today}
            onChange={e => setDueDate(e.target.value)}
          />
        </label>

        <label className="form-field-group">
          <span className="form-field-label">
            <i className="fa-solid fa-folder-open" /> 프로젝트
          </span>
          <select
            className="project-select"
            value={creatingProj ? '__new__' : projectId}
            onChange={handleProjectChange}
          >
            <option value="">없음</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
            <option value="__new__">＋ 새 프로젝트 만들기</option>
          </select>
        </label>
      </div>

      {/* ── 새 프로젝트 인라인 폼 ── */}
      {creatingProj && (
        <div className="new-project-row">
          <input
            autoFocus
            type="text"
            className="todo-input proj-name-input"
            placeholder="프로젝트 이름"
            value={newProjName}
            onChange={e => setNewProjName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); void handleSaveNewProject(); }
              if (e.key === 'Escape') cancelNewProject();
            }}
          />
          <div className="color-picker">
            {PROJECT_COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`color-dot${newProjColor === c ? ' selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setNewProjColor(c)}
                title={c}
              />
            ))}
          </div>
          <button
            type="button"
            className="btn-proj-save"
            onClick={() => void handleSaveNewProject()}
            disabled={!newProjName.trim() || projSaving}
          >
            {projSaving ? '저장 중…' : '만들기'}
          </button>
          <button
            type="button"
            className="btn-proj-cancel"
            onClick={cancelNewProject}
          >
            취소
          </button>
        </div>
      )}

      {/* ── 추가 버튼 ── */}
      <button type="submit" className="btn-add-full">
        <i className="fa-solid fa-plus" /> 할 일 추가
      </button>
    </form>
  );
}
