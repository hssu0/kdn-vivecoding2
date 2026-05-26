import { useState } from 'react'
import type { Milestone } from '../data/schedule'

interface AddTaskProps {
  milestones: Milestone[]
  onAdd: (input: { title: string; due: string; milestoneId: string; estimateHours: number }) => void
}

export default function AddTask({ milestones, onAdd }: AddTaskProps) {
  const [title, setTitle] = useState('')
  const [milestoneId, setMilestoneId] = useState(milestones[0]?.id ?? '')
  const [estimate, setEstimate] = useState('1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    const due = milestones.find(m => m.id === milestoneId)?.date ?? ''
    onAdd({
      title: trimmed,
      milestoneId,
      due,
      estimateHours: Math.max(1, Number(estimate) || 1)
    })
    setTitle('')
    setEstimate('1')
  }

  return (
    <form className="add-row" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="새 작업명을 입력하세요"
        aria-label="작업명"
      />
      <select
        value={milestoneId}
        onChange={e => setMilestoneId(e.target.value)}
        aria-label="마일스톤"
      >
        {milestones.map(m => (
          <option key={m.id} value={m.id}>{m.label} — {m.title.split(' — ')[0]}</option>
        ))}
      </select>
      <select
        value={estimate}
        onChange={e => setEstimate(e.target.value)}
        aria-label="예상 시간"
      >
        {[1, 2, 3, 4, 5, 6, 8].map(h => (
          <option key={h} value={h}>{h}시간</option>
        ))}
      </select>
      <button type="submit" className="btn-primary">
        <i className="fa-solid fa-plus"></i>작업 추가
      </button>
    </form>
  )
}
