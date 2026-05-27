import { useState, useEffect, useCallback } from 'react';
import { supabase, type DbProject } from '../lib/supabase';
import type { Project } from '../types/todo';

function dbToProject(row: DbProject): Project {
  return {
    id:        row.id,
    name:      row.name,
    color:     row.color,
    createdAt: row.created_at,
  };
}

export interface UseProjectsReturn {
  projects:      Project[];
  addProject:    (name: string, color: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  refetch:       () => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) console.error('프로젝트 로드 오류:', error.message);
    else if (data) setProjects((data as DbProject[]).map(dbToProject));
  }, []);

  useEffect(() => { void fetchProjects(); }, [fetchProjects]);

  /* 프로젝트 추가 */
  const addProject = async (name: string, color: string): Promise<Project | null> => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, color }])
      .select()
      .single();
    if (error) { console.error(error.message); return null; }
    const p = dbToProject(data as DbProject);
    setProjects(prev => [...prev, p]);
    return p;
  };

  /* 프로젝트 삭제 (낙관적 업데이트) */
  const deleteProject = async (id: string) => {
    const prev = projects;
    setProjects(cur => cur.filter(p => p.id !== id));
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) { setProjects(prev); console.error(error.message); }
  };

  return { projects, addProject, deleteProject, refetch: fetchProjects };
}
