// ============================================
//  KDN 업무 일지 — 공통 타입 정의
// ============================================

export type Category = '업무' | '개발' | '미팅' | '교육' | '기타';
export type FilterType = 'all' | 'active' | 'completed';
export type MainTab = 'write' | 'view';
export type ViewTab = 'all' | 'date' | 'stats';

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  category: Category;
  createdAt: string;   // ISO string
  completedAt?: string; // ISO string (설정 시)
}

export const CATEGORIES: Category[] = ['업무', '개발', '미팅', '교육', '기타'];

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
