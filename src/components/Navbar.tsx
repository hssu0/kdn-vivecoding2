import { useState, useRef, useEffect } from 'react';
import type { MainTab, ViewTab } from '../types/todo';

const MAIN_TABS: { value: MainTab; icon: string; text: string }[] = [
  { value: 'write', icon: 'fa-solid fa-pen-to-square', text: '일지 작성' },
  { value: 'view',  icon: 'fa-solid fa-list-check',    text: '일지 조회' },
];

const VIEW_TABS: { value: ViewTab; icon: string; text: string }[] = [
  { value: 'all',   icon: 'fa-solid fa-list',            text: '전체 목록' },
  { value: 'date',  icon: 'fa-regular fa-calendar-days', text: '날짜별 조회' },
  { value: 'stats', icon: 'fa-solid fa-chart-pie',       text: '통계' },
];

interface Props {
  onSave:     () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  connected:  boolean;
  mainTab:    MainTab;
  onMainTab:  (tab: MainTab) => void;
  viewTab:    ViewTab;
  onViewTab:  (tab: ViewTab) => void;
  userEmail:  string;
  onSignOut:  () => void;
}

export default function Navbar({
  onSave, saveStatus, connected,
  mainTab, onMainTab, viewTab, onViewTab,
  userEmail, onSignOut,
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* 바깥 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* 이메일 앞글자 (아바타) */
  const avatarChar = userEmail ? userEmail[0].toUpperCase() : '?';

  return (
    <header className="site-header">

      {/* ── 단일 상단 바 ── */}
      <div className="navbar">

        {/* 왼쪽: 브랜드 */}
        <div className="nav-brand">
          <i className="fa-solid fa-book-open-reader nav-icon" />
          <div className="nav-titles">
            <span className="nav-title">업무 일지</span>
            <span className="nav-subtitle">KDN 미터링시스템부</span>
          </div>
        </div>

        {/* 구분선 */}
        <span className="nav-divider" />

        {/* 메인 탭 메뉴 (타이틀 옆) */}
        <nav className="nav-tabs" aria-label="메인 메뉴">
          {MAIN_TABS.map(({ value, icon, text }) => (
            <button
              key={value}
              className={`nav-tab${mainTab === value ? ' active' : ''}`}
              onClick={() => onMainTab(value)}
            >
              <i className={icon} /> {text}
            </button>
          ))}
        </nav>

        {/* 가운데 공간 */}
        <div className="nav-spacer" />

        {/* 오른쪽: 액션 + 로그인 */}
        <div className="nav-right">

          {/* Supabase 연결 상태 */}
          <span className={`conn-badge ${connected ? 'online' : 'offline'}`}>
            <i className={connected ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} />
            <span className="conn-text">{connected ? '연결됨' : '연결 오류'}</span>
          </span>

          {/* 동기화 버튼 */}
          <button
            className={`btn-save ${saveStatus !== 'idle' ? saveStatus : ''}`}
            onClick={onSave}
            title="Supabase 최신 데이터 동기화"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <><i className="fa-solid fa-arrows-rotate fa-spin" /><span className="btn-save-text"> 동기화 중…</span></>
            ) : saveStatus === 'saved' ? (
              <><i className="fa-solid fa-check" /><span className="btn-save-text"> 완료</span></>
            ) : (
              <><i className="fa-solid fa-arrows-rotate" /><span className="btn-save-text"> 동기화</span></>
            )}
          </button>

          {/* 유저 메뉴 */}
          <div className="nav-user-wrap" ref={dropdownRef}>
            <button
              className="nav-user-btn"
              onClick={() => setDropdownOpen(o => !o)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span className="nav-user-avatar">{avatarChar}</span>
              <span className="nav-user-name">{userEmail}</span>
              <i className={`fa-solid fa-chevron-${dropdownOpen ? 'up' : 'down'} nav-user-chevron`} />
            </button>

            {dropdownOpen && (
              <div className="nav-user-dropdown">
                <div className="nav-user-info">
                  <i className="fa-regular fa-user nav-user-info-icon" />
                  <span className="nav-user-email">{userEmail}</span>
                </div>
                <button
                  className="nav-signout-btn"
                  onClick={() => { setDropdownOpen(false); void onSignOut(); }}
                >
                  <i className="fa-solid fa-right-from-bracket" /> 로그아웃
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── 서브 탭 (일지 조회 전용) ── */}
      {mainTab === 'view' && (
        <div className="nav-submenu">
          <div className="container">
            {VIEW_TABS.map(({ value, icon, text }) => (
              <button
                key={value}
                className={`nav-sub-tab${viewTab === value ? ' active' : ''}`}
                onClick={() => onViewTab(value)}
              >
                <i className={icon} /> {text}
              </button>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}
