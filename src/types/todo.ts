// ============================================================
//  KDN 업무 일지 — 공통 타입 정의 v3
// ============================================================

export type Category   = '업무' | '개발' | '미팅' | '교육' | '기타';
export type FilterType = 'all' | 'active' | 'completed';
export type MainTab    = 'write' | 'view';
export type ViewTab    = 'all' | 'date' | 'stats';

// ── 할 일 ────────────────────────────────────────────────
export interface TodoItem {
  id:           string;
  title:        string;
  description?: string;       // 세부 내용 (선택)
  completed:    boolean;
  category:     Category;
  projectId?:   string;       // projects.id FK
  dueDate?:     string;       // YYYY-MM-DD
  sortOrder:    number;       // 표시 순서 (드래그 정렬)
  createdAt:    string;       // ISO datetime
  completedAt?: string;       // ISO datetime
}

// 추가 시 입력 데이터
export interface AddTodoInput {
  title:        string;
  description?: string;
  category:     Category;
  projectId?:   string;
  dueDate?:     string;
}

// 수정 시 입력 데이터
export interface UpdateTodoInput {
  title:        string;
  description?: string;
  category:     Category;
  dueDate?:     string;
}

// ── 프로젝트 ──────────────────────────────────────────────
export interface Project {
  id:        string;
  name:      string;
  color:     string;
  createdAt: string;
}

// ── 상수 ─────────────────────────────────────────────────
export const CATEGORIES: Category[] = ['업무', '개발', '미팅', '교육', '기타'];

export const PROJECT_COLORS: string[] = [
  '#3D6FE0', '#059669', '#D97706', '#7C3AED',
  '#DC2626', '#0891B2', '#DB2777', '#64748B',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  '업무': '#3D6FE0',
  '개발': '#059669',
  '미팅': '#D97706',
  '교육': '#7C3AED',
  '기타': '#4A5A7C',
};

export const CATEGORY_BG: Record<Category, string> = {
  '업무': '#EEF2FF',
  '개발': '#ECFDF5',
  '미팅': '#FFFBEB',
  '교육': '#F5F3FF',
  '기타': '#F0F2F8',
};
