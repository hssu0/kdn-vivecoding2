interface Props {
  onSave:     () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  connected:  boolean;
}

export default function Navbar({ onSave, saveStatus, connected }: Props) {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <i className="fa-solid fa-book-open-reader nav-icon" />
        <div className="nav-titles">
          <span className="nav-title">업무 일지</span>
          <span className="nav-subtitle">KDN 미터링시스템부</span>
        </div>
      </div>

      <div className="nav-actions">
        {/* Supabase 연결 상태 */}
        <span className={`conn-badge ${connected ? 'online' : 'offline'}`}>
          <i className={connected ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'} />
          {connected ? 'Supabase 연결됨' : '연결 오류'}
        </span>

        {/* 동기화(새로고침) 버튼 */}
        <button
          className={`btn-save ${saveStatus !== 'idle' ? saveStatus : ''}`}
          onClick={onSave}
          title="Supabase에서 최신 데이터 동기화"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <><i className="fa-solid fa-arrows-rotate fa-spin" /> 동기화 중…</>
          ) : saveStatus === 'saved' ? (
            <><i className="fa-solid fa-check" /> 동기화 완료</>
          ) : (
            <><i className="fa-solid fa-arrows-rotate" /> 동기화</>
          )}
        </button>
      </div>
    </nav>
  );
}
