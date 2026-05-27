-- ============================================================
--  KDN 업무 일지 관리 — Supabase 데이터베이스 스키마 v2
--  실행: Supabase Dashboard → SQL Editor → New query → Run
--  ※ 재실행 안전 (IF NOT EXISTS / IF NOT EXISTS 사용)
-- ============================================================

-- UUID 확장 (Supabase 기본 활성화, 혹시 모를 경우 대비)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── projects 테이블 (NEW v2) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  color      TEXT        NOT NULL DEFAULT '#3D6FE0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스: 생성일 오름차순 (목록 표시 순서)
CREATE INDEX IF NOT EXISTS idx_projects_created_at
  ON public.projects (created_at ASC);

-- ── projects RLS (v4: 로그인 사용자만 접근) ──────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "proj_anon_select" ON public.projects;
DROP POLICY IF EXISTS "proj_anon_insert" ON public.projects;
DROP POLICY IF EXISTS "proj_anon_update" ON public.projects;
DROP POLICY IF EXISTS "proj_anon_delete" ON public.projects;
DROP POLICY IF EXISTS "proj_auth_select" ON public.projects;
DROP POLICY IF EXISTS "proj_auth_insert" ON public.projects;
DROP POLICY IF EXISTS "proj_auth_update" ON public.projects;
DROP POLICY IF EXISTS "proj_auth_delete" ON public.projects;

CREATE POLICY "proj_auth_select" ON public.projects
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "proj_auth_insert" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "proj_auth_update" ON public.projects
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "proj_auth_delete" ON public.projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- ── todos 테이블 ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.todos (
  id           UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT        NOT NULL,
  completed    BOOLEAN     NOT NULL DEFAULT FALSE,
  category     TEXT        NOT NULL DEFAULT '업무'
               CHECK (category IN ('업무', '개발', '미팅', '교육', '기타')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- v2 컬럼 추가 (기존 DB에 이미 테이블이 있을 경우에도 안전하게 추가)
ALTER TABLE public.todos
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS project_id  UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS due_date    DATE;

-- v3 컬럼 추가: 드래그-앤-드롭 순서 저장
ALTER TABLE public.todos
  ADD COLUMN IF NOT EXISTS sort_order  INTEGER DEFAULT NULL;

-- 인덱스: 생성일 역순 정렬 최적화
CREATE INDEX IF NOT EXISTS idx_todos_created_at
  ON public.todos (created_at DESC);

-- 인덱스: 카테고리 필터 최적화
CREATE INDEX IF NOT EXISTS idx_todos_category
  ON public.todos (category);

-- 인덱스: 프로젝트별 조회 최적화 (NEW v2)
CREATE INDEX IF NOT EXISTS idx_todos_project_id
  ON public.todos (project_id);

-- 인덱스: 표시 순서 정렬 최적화 (NEW v3)
CREATE INDEX IF NOT EXISTS idx_todos_sort_order
  ON public.todos (sort_order ASC NULLS LAST);

-- ── todos RLS (v4: 로그인 사용자만 접근) ─────────────────
-- ※ Supabase Dashboard → Authentication → Providers → Email 활성화 필요
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 후 재생성 (재실행 안전)
DROP POLICY IF EXISTS "anon_select"  ON public.todos;
DROP POLICY IF EXISTS "anon_insert"  ON public.todos;
DROP POLICY IF EXISTS "anon_update"  ON public.todos;
DROP POLICY IF EXISTS "anon_delete"  ON public.todos;
DROP POLICY IF EXISTS "auth_select"  ON public.todos;
DROP POLICY IF EXISTS "auth_insert"  ON public.todos;
DROP POLICY IF EXISTS "auth_update"  ON public.todos;
DROP POLICY IF EXISTS "auth_delete"  ON public.todos;

-- 로그인한 사용자만 접근 허용
CREATE POLICY "auth_select" ON public.todos
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_insert" ON public.todos
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "auth_update" ON public.todos
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete" ON public.todos
  FOR DELETE USING (auth.role() = 'authenticated');

-- ── 샘플 데이터 (선택) ────────────────────────────────────
-- 아래 INSERT는 테스트용입니다. 필요 없으면 주석 처리하세요.
/*
INSERT INTO public.projects (name, color) VALUES
  ('KDN 바이브코딩', '#3D6FE0'),
  ('미터링 시스템',  '#059669');

INSERT INTO public.todos (title, category, completed) VALUES
  ('Supabase 연동 테스트',      '개발',  false),
  ('스키마 적용 확인',          '개발',  true),
  ('팀 미팅 준비',              '미팅',  false),
  ('업무 보고서 작성',          '업무',  false),
  ('바이브코딩 실습 완료',      '교육',  true);
*/
