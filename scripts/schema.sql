-- ============================================================
--  KDN 업무 일지 관리 — Supabase 데이터베이스 스키마
--  실행: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- UUID 확장 (Supabase 기본 활성화, 혹시 모를 경우 대비)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- 인덱스: 생성일 역순 정렬 최적화
CREATE INDEX IF NOT EXISTS idx_todos_created_at
  ON public.todos (created_at DESC);

-- 인덱스: 카테고리 필터 최적화
CREATE INDEX IF NOT EXISTS idx_todos_category
  ON public.todos (category);

-- ── Row Level Security ────────────────────────────────────
-- 인증 없이 anon 키로 CRUD 허용 (팀 공용 일지 용도)
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 후 재생성 (재실행 안전)
DROP POLICY IF EXISTS "anon_select" ON public.todos;
DROP POLICY IF EXISTS "anon_insert" ON public.todos;
DROP POLICY IF EXISTS "anon_update" ON public.todos;
DROP POLICY IF EXISTS "anon_delete" ON public.todos;

CREATE POLICY "anon_select" ON public.todos
  FOR SELECT USING (true);

CREATE POLICY "anon_insert" ON public.todos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "anon_update" ON public.todos
  FOR UPDATE USING (true);

CREATE POLICY "anon_delete" ON public.todos
  FOR DELETE USING (true);

-- ── 샘플 데이터 (선택) ────────────────────────────────────
-- 아래 INSERT는 테스트용입니다. 필요 없으면 주석 처리하세요.
/*
INSERT INTO public.todos (title, category, completed) VALUES
  ('Supabase 연동 테스트',      '개발',  false),
  ('스키마 적용 확인',          '개발',  true),
  ('팀 미팅 준비',              '미팅',  false),
  ('업무 보고서 작성',          '업무',  false),
  ('바이브코딩 실습 완료',      '교육',  true);
*/
