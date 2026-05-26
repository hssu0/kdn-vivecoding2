import type { Task } from '../data/schedule'

interface MetricCardsProps {
  tasks: Task[]
}

export default function MetricCards({ tasks }: MetricCardsProps) {
  const total = tasks.length
  const doing = tasks.filter(t => t.status === 'doing').length
  const done  = tasks.filter(t => t.status === 'done').length
  const late  = tasks.filter(t => t.status === 'late').length
  const totalHours = tasks.reduce((sum, t) => sum + t.estimateHours, 0)
  const doneHours  = tasks.filter(t => t.status === 'done').reduce((s, t) => s + t.estimateHours, 0)

  return (
    <div className="metric-grid">
      <div className="metric-card">
        <div className="label">
          <i className="fa-solid fa-list-check"></i>전체 작업
        </div>
        <div className="value">{total}<span className="unit">개</span></div>
        <div className="delta">총 예상 시간 <strong>{totalHours}h</strong></div>
      </div>

      <div className="metric-card is-doing">
        <div className="label">
          <i className="fa-solid fa-spinner"></i>진행중
        </div>
        <div className="value">{doing}<span className="unit">개</span></div>
        <div className="delta">현재 동시 진행</div>
      </div>

      <div className="metric-card is-done">
        <div className="label">
          <i className="fa-solid fa-circle-check"></i>완료
        </div>
        <div className="value">{done}<span className="unit">개</span></div>
        <div className="delta">처리 시간 <strong>{doneHours}h</strong></div>
      </div>

      <div className="metric-card is-late">
        <div className="label">
          <i className="fa-solid fa-triangle-exclamation"></i>지연
        </div>
        <div className="value">{late}<span className="unit">개</span></div>
        <div className="delta">기한 초과 작업</div>
      </div>
    </div>
  )
}
