type Filter = 'all' | 'doing' | 'done' | 'late'

interface PageHeaderProps {
  filter: Filter
  onFilterChange: (f: Filter) => void
}

const filters: { key: Filter; label: string }[] = [
  { key: 'all',   label: '전체' },
  { key: 'doing', label: '진행중' },
  { key: 'done',  label: '완료' },
  { key: 'late',  label: '지연' }
]

export default function PageHeader({ filter, onFilterChange }: PageHeaderProps) {
  return (
    <section className="page-header-ed">
      <div className="container">
        <div className="eyebrow"><span>KDN VIBE / DASHBOARD</span></div>
        <div className="header-row">
          <div>
            <h1>
              개발 일정을 <span className="accent">한눈에</span><br />
              체크하는 대시보드
            </h1>
            <p>
              KDN 풀스택 바이브코딩 3일 21시간 실습 일정을 마일스톤·작업 단위로
              확인하고, 진행률·지연 여부를 실시간으로 추적합니다.
            </p>
          </div>
          <div className="header-side">
            <div className="filter-bar" role="tablist" aria-label="상태 필터">
              {filters.map(f => (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={filter === f.key}
                  className={filter === f.key ? 'active' : ''}
                  onClick={() => onFilterChange(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export type { Filter }
