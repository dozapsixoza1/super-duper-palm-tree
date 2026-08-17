import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Rusnet</h4>
            <p>Новости технологий, IT-бизнеса и рунета — коротко и по делу.</p>
          </div>

          <div className="footer-col">
            <h4>Разделы</h4>
            <Link href="/category/tech">Технологии</Link>
            <Link href="/category/business">Бизнес</Link>
            <Link href="/about">О проекте</Link>
          </div>

          <div className="footer-col">
            <h4>Контакты</h4>
            <a href="https://t.me/rusnetsupport" target="_blank" rel="noopener noreferrer">
              Telegram: @rusnetsupport
            </a>
            <Link href="/contact">Все контакты →</Link>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Rusnet. Материалы — по мотивам открытых источников со ссылкой на оригинал.
        </div>
      </div>
    </footer>
  );
    }
