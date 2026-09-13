import React from "react";
import "../App.css";
import logoAR from "../assets/cessLogo.png";
import Contact from "./contact.jsx";

export default function Footer({ text, lang, menuOpen, setMenuOpen, setLang, scrollToSection }) {
  const hasNavigationControls = Boolean(setMenuOpen && setLang && scrollToSection);

  return (
    <footer className="footer">
      {text?.contact && <Contact text={text.contact} lang={lang} />}
      {hasNavigationControls && (
        <div className="top-buttons footer-controls">
          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label={lang === "en" ? "Toggle navigation menu" : "فتح أو إغلاق القائمة"}
          >
            ☰
          </button>
          <button className="lang-switch" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "ع" : "En"}
          </button>
          {menuOpen && (
            <nav className={`menu-dropdown footer-menu-dropdown ${lang === "ar" ? "rtl" : ""}`} aria-label={lang === "en" ? "Site sections" : "أقسام الموقع"}>
              <button onClick={() => scrollToSection("about")}>{lang === "en" ? "About" : "عن المركز"}</button>
              <button onClick={() => scrollToSection("projects")}>{lang === "en" ? "Projects" : "المشاريع"}</button>
              <button onClick={() => scrollToSection("publications")}>{lang === "en" ? "Publications" : "المنشورات"}</button>
              <button onClick={() => scrollToSection("contact")}>{lang === "en" ? "Contact Us" : "تواصل معنا"}</button>
            </nav>
          )}
        </div>
      )}
      <div className="footer-meta">
        <div className="footer-brand-group">
          <div className="footer-brand">
            <img src={logoAR} alt="CESS Arabic Logo" className="logo-footer" />
          </div>
          <div className="footer-social" aria-label="Social media links">
        <div className="footer-copy">
          <p>© 2025 - Center for Environmental & Social Studies</p>
          <p>Khartoum </p>
        </div>
        <a
          href="https://www.instagram.com/cesssudan/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/cesssudan/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 3A1.5 1.5 0 1 1 4.5 6a1.5 1.5 0 0 1 0-3ZM3 8h3v12H3V8Zm5 0h2.9v1.6h.04A3.2 3.2 0 0 1 14 7.7c3 0 3.6 2 3.6 4.7V20h-3v-6.7c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V20H8V8Z" />
          </svg>
        </a>
        <a
          href="https://x.com/CessSudan"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X (Twitter)"
          title="X (Twitter)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.4 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.8 3.9H6L17.8 20Z" />
          </svg>
        </a>
        <a
          href="https://www.facebook.com/profile.php?id=61584019486954"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H8v3h2.5v8h3Z" />
          </svg>
        </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
 