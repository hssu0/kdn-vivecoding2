interface NavbarProps {
  today: string
}

export default function Navbar({ today }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <div className="brand-mark">KDN</div>
          <div>
            <div className="brand-sub">Vibe Coding</div>
            <div>Dev Schedule Dashboard</div>
          </div>
        </div>
        <div className="nav-meta">
          <span className="pill"><i className="fa-regular fa-calendar"></i>{today}</span>
          <span className="pill"><i className="fa-solid fa-user"></i>허수영 · 미터링시스템부</span>
        </div>
      </div>
    </header>
  )
}
