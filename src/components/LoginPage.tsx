import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();

  const [mode,     setMode]     = useState<'signin' | 'signup'>('signin');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    if (mode === 'signin') {
      const err = await signIn(email.trim(), password);
      if (err) setErrorMsg(err);
    } else {
      const err = await signUp(email.trim(), password);
      if (err) {
        setErrorMsg(err);
      } else {
        setSuccess(true);
        setMode('signin');
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* ── 헤더 ── */}
        <div className="login-header">
          <div className="login-logo">
            <i className="fa-solid fa-book-open-reader" />
          </div>
          <h1 className="login-title">KDN 업무 일지</h1>
          <p className="login-subtitle">한전KDN 미터링시스템부</p>
        </div>

        {/* ── 모드 탭 ── */}
        <div className="login-mode-tabs">
          <button
            type="button"
            className={`login-mode-tab${mode === 'signin' ? ' active' : ''}`}
            onClick={() => { setMode('signin'); setErrorMsg(''); setSuccess(false); }}
          >
            <i className="fa-solid fa-right-to-bracket" /> 로그인
          </button>
          <button
            type="button"
            className={`login-mode-tab${mode === 'signup' ? ' active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccess(false); }}
          >
            <i className="fa-solid fa-user-plus" /> 계정 만들기
          </button>
        </div>

        {/* ── 폼 ── */}
        <form className="login-form" onSubmit={e => void handleSubmit(e)}>

          <div className="login-field">
            <label className="login-label">
              <i className="fa-regular fa-envelope" /> 이메일
            </label>
            <input
              type="email"
              className="login-input"
              placeholder="example@kdn.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">
              <i className="fa-solid fa-lock" /> 비밀번호
            </label>
            <input
              type="password"
              className="login-input"
              placeholder={mode === 'signup' ? '8자 이상 입력하세요' : '비밀번호를 입력하세요'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              minLength={mode === 'signup' ? 8 : undefined}
              required
            />
          </div>

          {/* 오류 메시지 */}
          {errorMsg && (
            <p className="login-error">
              <i className="fa-solid fa-circle-exclamation" />
              {errorMsg}
            </p>
          )}

          {/* 성공 메시지 */}
          {success && (
            <p className="login-success">
              <i className="fa-solid fa-circle-check" />
              계정이 생성되었습니다. 이메일을 확인한 후 로그인하세요.
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={loading || !email.trim() || !password.trim()}
          >
            {loading ? (
              <><i className="fa-solid fa-arrows-rotate fa-spin" /> 처리 중…</>
            ) : mode === 'signin' ? (
              <><i className="fa-solid fa-right-to-bracket" /> 로그인</>
            ) : (
              <><i className="fa-solid fa-user-plus" /> 계정 만들기</>
            )}
          </button>
        </form>

        {/* ── 안내 ── */}
        <p className="login-note">
          <i className="fa-regular fa-circle-question" />
          계정 문의: 시스템 관리자에게 연락하세요
        </p>

      </div>
    </div>
  );
}
