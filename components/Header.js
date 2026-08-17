import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/category/tech", label: "Технологии" },
  { href: "/category/business", label: "Бизнес" },
  { href: "/about", label: "О проекте" },
  { href: "/contact", label: "Контакты" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="logo">
          Rus<span>net</span>
        </Link>

        <nav className="nav-desktop">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="burger-btn"
          aria-label="Открыть меню"
          onClick={() => setOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 5h16M2 10h16M2 15h16" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="mobile-drawer" onClick={() => setOpen(false)}>
          <div className="mobile-drawer-panel" onClick={(e) => e.stopPropagation()}>
            <button className="mobile-drawer-close" onClick={() => setOpen(false)}>
              Закрыть ✕
            </button>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
