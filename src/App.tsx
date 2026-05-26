import { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import PageHeader, { type Filter } from './components/PageHeader'
import MetricCards from './components/MetricCards'
import ProgressCard from './components/ProgressCard'
import MilestoneList from './components/MilestoneList'
import TaskList from './components/TaskList'
import AddTask from './components/AddTask'
import { initialTasks, milestones, type Task, type TaskStatus } from './data/schedule'

const TODAY_ISO = '2026-05-26'

function nextStatus(status: TaskStatus): TaskStatus {
  if (status === 'todo')  return 'doing'
  if (status === 'doing') return 'done'
  if (status === 'done')  return 'todo'
  return 'doing'
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [filter, setFilter] = useState<Filter>('all')

  const handleToggle = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: nextStatus(t.status) } : t))
    )
  }

  const handleAdd = (input: { title: string; due: string; milestoneId: string; estimateHours: number }) => {
    setTasks(prev => [
      ...prev,
      {
        id: `t${Date.now()}`,
        title: input.title,
        owner: '허수영',
        due: input.due,
        estimateHours: input.estimateHours,
        status: 'todo',
        milestoneId: input.milestoneId
      }
    ])
  }

  const visibleTasks = useMemo(() => {
    if (filter === 'all') return tasks
    return tasks.filter(t => t.status === filter)
  }, [tasks, filter])

  return (
    <>
      <Navbar today={TODAY_ISO} />

      <PageHeader filter={filter} onFilterChange={setFilter} />

      <main className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-num">01 / OVERVIEW</span>
            <h2 className="section-title">실습 진행 요약</h2>
            <span className="section-meta">Today · {TODAY_ISO}</span>
          </div>
          <MetricCards tasks={tasks} />
          <ProgressCard tasks={tasks} />
        </div>
      </main>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="section-num">02 / SCHEDULE</span>
            <h2 className="section-title">마일스톤 &amp; 작업 체크</h2>
            <span className="section-meta">DAY 01–03 · 21h</span>
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <div className="panel-title">DAY-by-DAY Milestones</div>
              <MilestoneList milestones={milestones} tasks={tasks} />
            </div>

            <div className="panel">
              <div className="panel-title">
                Task Check · {filter === 'all' ? '전체' : filter.toUpperCase()}
              </div>
              <TaskList tasks={visibleTasks} milestones={milestones} onToggle={handleToggle} />
              <AddTask milestones={milestones} onAdd={handleAdd} />
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <strong>KDN Vibe Dashboard</strong> · 한전KDN 미터링시스템부 · 풀스택 바이브코딩 실습
        </div>
      </footer>
    </>
  )
}
