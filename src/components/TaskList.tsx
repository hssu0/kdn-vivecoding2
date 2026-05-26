import type { Task, TaskStatus, Milestone } from '../data/schedule'

interface TaskListProps {
  tasks: Task[]
  milestones: Milestone[]
  onToggle: (id: string) => void
}

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'TODO',
  doing: 'DOING',
  done: 'DONE',
  late: 'LATE'
}

export default function TaskList({ tasks, milestones, onToggle }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <i className="fa-regular fa-folder-open"></i>
        조건에 해당하는 작업이 없습니다.
      </div>
    )
  }

  const milestoneLabel = (id: string) => milestones.find(m => m.id === id)?.label ?? ''

  return (
    <div className="task-list">
      {tasks.map(t => (
        <button
          key={t.id}
          className={`task is-${t.status}`}
          onClick={() => onToggle(t.id)}
          aria-pressed={t.status === 'done'}
        >
          <span className="task-check" aria-hidden>
            <i className="fa-solid fa-check"></i>
          </span>
          <span className="task-body">
            <span className="task-title">{t.title}</span>
            <span className="task-meta">
              <span><i className="fa-regular fa-user"></i>{t.owner}</span>
              <span className="sep">·</span>
              <span><i className="fa-regular fa-calendar"></i>{t.due}</span>
              <span className="sep">·</span>
              <span><i className="fa-regular fa-clock"></i>{t.estimateHours}h</span>
              <span className="sep">·</span>
              <span><i className="fa-solid fa-flag"></i>{milestoneLabel(t.milestoneId)}</span>
            </span>
          </span>
          <span className={`task-status status-${t.status}`}>{STATUS_LABEL[t.status]}</span>
        </button>
      ))}
    </div>
  )
}
