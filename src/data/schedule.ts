export type TaskStatus = 'todo' | 'doing' | 'done' | 'late'

export interface Task {
  id: string
  title: string
  owner: string
  due: string         // YYYY-MM-DD
  estimateHours: number
  status: TaskStatus
  milestoneId: string
}

export interface Milestone {
  id: string
  day: number          // 1, 2, 3
  label: string        // "DAY 01"
  title: string        // "프론트엔드 기초"
  date: string         // YYYY-MM-DD
  startHour: string
  endHour: string
}

export const milestones: Milestone[] = [
  {
    id: 'm1',
    day: 1,
    label: 'DAY 01',
    title: '프론트엔드 기초 — 환경 셋업 & 컴포넌트',
    date: '2026-05-26',
    startHour: '09:00',
    endHour: '18:00'
  },
  {
    id: 'm2',
    day: 2,
    label: 'DAY 02',
    title: '백엔드 연동 — API & 데이터 패칭',
    date: '2026-05-27',
    startHour: '09:00',
    endHour: '18:00'
  },
  {
    id: 'm3',
    day: 3,
    label: 'DAY 03',
    title: '배포 — Vercel & 마무리 발표',
    date: '2026-05-28',
    startHour: '09:00',
    endHour: '18:00'
  }
]

export const initialTasks: Task[] = [
  // DAY 01
  { id: 't1',  title: '개발 환경 셋업 (Node/VSCode/Claude Code)', owner: '허수영', due: '2026-05-26', estimateHours: 1, status: 'done',  milestoneId: 'm1' },
  { id: 't2',  title: 'Vite + React + TS 프로젝트 생성',         owner: '허수영', due: '2026-05-26', estimateHours: 1, status: 'done',  milestoneId: 'm1' },
  { id: 't3',  title: '디자인 시스템 토큰 적용',                  owner: '허수영', due: '2026-05-26', estimateHours: 2, status: 'doing', milestoneId: 'm1' },
  { id: 't4',  title: '레이아웃 & 페이지 헤더 구현',              owner: '허수영', due: '2026-05-26', estimateHours: 2, status: 'doing', milestoneId: 'm1' },
  { id: 't5',  title: '메트릭 카드 컴포넌트',                     owner: '허수영', due: '2026-05-26', estimateHours: 1, status: 'todo',  milestoneId: 'm1' },

  // DAY 02
  { id: 't6',  title: 'Supabase 프로젝트 세팅',                   owner: '허수영', due: '2026-05-27', estimateHours: 1, status: 'todo',  milestoneId: 'm2' },
  { id: 't7',  title: '일정 데이터 CRUD API 작성',                owner: '허수영', due: '2026-05-27', estimateHours: 3, status: 'todo',  milestoneId: 'm2' },
  { id: 't8',  title: '진행률 자동 계산 로직',                    owner: '허수영', due: '2026-05-27', estimateHours: 2, status: 'todo',  milestoneId: 'm2' },
  { id: 't9',  title: '필터 / 검색 UX',                            owner: '허수영', due: '2026-05-27', estimateHours: 2, status: 'todo',  milestoneId: 'm2' },

  // DAY 03
  { id: 't10', title: '반응형 점검 & 접근성 보완',                owner: '허수영', due: '2026-05-28', estimateHours: 2, status: 'todo',  milestoneId: 'm3' },
  { id: 't11', title: 'Vercel 배포 & 도메인 연결',                owner: '허수영', due: '2026-05-28', estimateHours: 1, status: 'todo',  milestoneId: 'm3' },
  { id: 't12', title: '데모 발표 자료 정리',                      owner: '허수영', due: '2026-05-28', estimateHours: 1, status: 'todo',  milestoneId: 'm3' },

  // 예시: 지연 작업
  { id: 't0',  title: '사전 학습 (HTML/CSS 복습)',                 owner: '허수영', due: '2026-05-25', estimateHours: 2, status: 'late',  milestoneId: 'm1' }
]
