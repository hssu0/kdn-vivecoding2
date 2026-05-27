import type { TodoItem, Project } from '../types/todo';
import { CATEGORIES, CATEGORY_COLORS } from '../types/todo';

interface Props {
  todos:    TodoItem[];
  projects: Project[];
}

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });
}

export default function StatsView({ todos, projects }: Props) {

  /* ── 카테고리별 통계 ── */
  const categoryStats = CATEGORIES.map(cat => {
    const ct = todos.filter(t => t.category === cat);
    return { category: cat, total: ct.length, completed: ct.filter(t => t.completed).length };
  });
  const maxCat = Math.max(...categoryStats.map(s => s.total), 1);

  /* ── 주간 추이 ── */
  const last7 = getLast7Days();
  const weeklyStats = last7.map(date => {
    const dt = todos.filter(t => t.createdAt.split('T')[0] === date);
    return { date, total: dt.length, completed: dt.filter(t => t.completed).length };
  });
  const maxWeek = Math.max(...weeklyStats.map(s => s.total), 1);

  /* ── 프로젝트별 통계 ── */
  const projectStats = projects.map(p => {
    const pt = todos.filter(t => t.projectId === p.id);
    return { project: p, total: pt.length, completed: pt.filter(t => t.completed).length };
  });
  const unassigned = todos.filter(t => !t.projectId);
  if (unassigned.length > 0) {
    projectStats.push({
      project:   { id: '__none__', name: '📂 프로젝트 없음', color: '#B8C0D6', createdAt: '' },
      total:     unassigned.length,
      completed: unassigned.filter(t => t.completed).length,
    });
  }
  const maxProj = Math.max(...projectStats.map(s => s.total), 1);

  /* ── 요약 수치 ── */
  const totalCount     = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const activeCount    = totalCount - completedCount;
  const rate           = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="stats-view">

      {/* 요약 카드 */}
      <div className="stats-cards">
        <div className="stats-card">
          <div className="stats-num">{totalCount}</div>
          <div className="stats-label">전체 일지</div>
        </div>
        <div className="stats-card accent">
          <div className="stats-num">{activeCount}</div>
          <div className="stats-label">진행중</div>
        </div>
        <div className="stats-card success">
          <div className="stats-num">{completedCount}</div>
          <div className="stats-label">완료</div>
        </div>
        <div className="stats-card info">
          <div className="stats-num">{rate}%</div>
          <div className="stats-label">완료율</div>
        </div>
      </div>

      <div className="stats-grid">

        {/* 카테고리별 차트 */}
        <div className="chart-card">
          <div className="chart-title">
            <i className="fa-solid fa-chart-bar" /> 카테고리별 건수
          </div>
          <div className="category-chart">
            {categoryStats.map(({ category, total, completed }) => (
              <div key={category} className="chart-row">
                <div className="chart-label">
                  <span className="chart-dot" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
                  {category}
                </div>
                <div className="chart-bar-bg">
                  <div className="chart-bar-total" style={{ width: `${(total / maxCat) * 100}%`, backgroundColor: CATEGORY_COLORS[category] + '38' }} />
                  <div className="chart-bar-done"  style={{ width: `${(completed / maxCat) * 100}%`, backgroundColor: CATEGORY_COLORS[category] }} />
                </div>
                <span className="chart-value">{total}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot total-dot" />전체</span>
            <span className="legend-item"><span className="legend-dot done-dot" />완료</span>
          </div>
        </div>

        {/* 주간 추이 차트 */}
        <div className="chart-card">
          <div className="chart-title">
            <i className="fa-solid fa-chart-line" /> 주간 추이 (최근 7일)
          </div>
          <div className="weekly-chart">
            {weeklyStats.map(({ date, total, completed }) => {
              const d         = new Date(date + 'T00:00:00');
              const dayLabel  = d.toLocaleDateString('ko-KR', { weekday: 'short' });
              const dateLabel = d.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
              const barH      = total > 0 ? Math.max((total / maxWeek) * 100, 8) : 0;
              const doneH     = total > 0 ? (completed / total) * 100 : 0;
              return (
                <div key={date} className="weekly-col">
                  <div className="weekly-top">
                    {total > 0 && <span className="weekly-count">{total}</span>}
                  </div>
                  <div className="weekly-bar-wrapper">
                    <div className="weekly-bar" style={{ height: `${barH}%` }}>
                      <div className="weekly-bar-done" style={{ height: `${doneH}%` }} />
                    </div>
                  </div>
                  <div className="weekly-label">
                    <span className="weekly-day">{dayLabel}</span>
                    <span className="weekly-date">{dateLabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="chart-legend" style={{ marginTop: 12 }}>
            <span className="legend-item"><span className="legend-dot" style={{ background: '#B8C7E8' }} />전체</span>
            <span className="legend-item"><span className="legend-dot done-dot" />완료</span>
          </div>
        </div>
      </div>

      {/* 프로젝트별 진행률 */}
      {projectStats.length > 0 && (
        <div className="chart-card project-stats-card">
          <div className="chart-title">
            <i className="fa-solid fa-folder-tree" /> 프로젝트별 진행률
          </div>
          <div className="project-stats-list">
            {projectStats.map(({ project, total, completed }) => {
              const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={project.id} className="project-stat-row">
                  <div className="project-stat-label">
                    <span className="project-stat-dot" style={{ backgroundColor: project.color }} />
                    <span className="project-stat-name">{project.name}</span>
                    <span className="project-stat-count">{completed}/{total}</span>
                  </div>
                  <div className="project-stat-bar-bg">
                    <div className="project-stat-bar-fill" style={{ width: `${(total / maxProj) * 100}%`, backgroundColor: project.color + '28' }} />
                    <div className="project-stat-bar-done"  style={{ width: `${(completed / maxProj) * 100}%`, backgroundColor: project.color }} />
                  </div>
                  <span className="project-stat-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
