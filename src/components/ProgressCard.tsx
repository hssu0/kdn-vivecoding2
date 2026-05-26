import type { Task } from '../data/schedule'

interface ProgressCardProps {
  tasks: Task[]
}

export default function ProgressCard({ tasks }: ProgressCardProps) {
  const total = tasks.length
  const done  = tasks.filter(t => t.status === 'done').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="progress-card">
      <div>
        <div className="eyebrow">Overall Progress</div>
        <h3>전체 진행률 — 3일 21시간 실습</h3>
        <p>
          마일스톤(DAY) 단위로 진행 상황을 측정합니다. 작업의 상태(todo / doing / done / late)를
          토글해 진행률이 즉시 업데이트되는지 확인하세요.
        </p>
      </div>
      <div className="progress-right">
        <div className="progress-stat">
          <span className="progress-percent">{percent}<span className="small">%</span></span>
          <span className="progress-detail">{done} / {total} 완료</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <div className="progress-legend">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}
