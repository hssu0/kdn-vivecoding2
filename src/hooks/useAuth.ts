import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UseAuthReturn {
  user:        User | null;
  authLoading: boolean;
  signIn:      (email: string, password: string) => Promise<string | null>;
  signUp:      (email: string, password: string) => Promise<string | null>;
  signOut:     () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user,        setUser]        = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    /* 초기 세션 확인 */
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    /* 인증 상태 변경 구독 */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signUp = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  };

  const signOut = async (): Promise<void> => {
    await supabase.auth.signOut();
  };

  return { user, authLoading, signIn, signUp, signOut };
}
