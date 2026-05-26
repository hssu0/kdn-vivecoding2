import type { Milestone, Task } from '../data/schedule'

interface MilestoneListProps {
  milestones: Milestone[]
  tasks: Task[]
}

export default function MilestoneList({ milestones, tasks }: MilestoneListProps) {
  return (
    <div className="milestone-list">
      {milestones.map(m => {
        const ms = tasks.filter(t => t.milestoneId === m.id)
        const total = ms.length
        const done = ms.filter(t => t.status === 'done').length
        const late = ms.filter(t => t.status === 'late').length
        const percent = total === 0 ? 0 : Math.round((done / total) * 100)
        const fillClass = late > 0 ? 'late' : percent === 100 ? 'done' : ''

        return (
          <div className="milestone" key={m.id}>
            <div className="day">
              <span className="num">{String(m.day).padStart(2, '0')}<span className="slash">/</span></span>
              <span className="label">{m.label}</span>
            </div>
            <div className="body">
              <h4>{m.title}</h4>
              <div className="row">
                <span><i className="fa-regular fa-calendar"></i> {m.date}</span>
                <span className="dot">·</span>
                <span><i className="fa-regular fa-clock"></i> {m.startHour}–{m.endHour}</span>
                <span className="dot">·</span>
                <span>{total}개 작업 · {done}개 완료{late > 0 && ` · ${late}개 지연`}</span>
              </div>
            </div>
            <div className="right">
              <div className="mini-bar">
                <div className={`mini-bar-fill ${fillClass}`} style={{ width: `${percent}%` }} />
              </div>
              <span className="mini-text">{percent}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
