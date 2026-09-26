import React from "react";
import "../App.css";
import logoAR from "../assets/cessLogo.png";
import Contact from "./contact.jsx";

export default function Footer({ text, lang, scrollToSection }) {
  const links = [
    { id: "about", en: "About", ar: "عن المركز" },
    { id: "projects", en: "Projects", ar: "المشاريع" },
    { id: "publications", en: "Publications", ar: "المنشورات" },
    { id: "contact", en: "Contact Us", ar: "تواصل معنا" },
  ];

  return (
    <footer className={`footer${lang === "ar" ? " rtl" : ""}`}>
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-intro">
            <span className="footer-kicker">{lang === "en" ? "Contact" : "\u062a\u0648\u0627\u0635\u0644"}</span>
            {text?.contact?.heading && <h2>{text.contact.heading}</h2>}
          </div>
          <img src={logoAR} alt="CESS Logo" className="logo-footer" />
        </div>

        <nav className="footer-links" aria-label={lang === "en" ? "Quick Links" : "روابط سريعة"}>
          <h3>{lang === "en" ? "Quick Links" : "روابط سريعة"}</h3>
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} onClick={(event) => {
                  event.preventDefault();
                  scrollToSection?.(link.id);
                }}>
                  {lang === "en" ? link.en : link.ar}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {text?.contact && <Contact text={text.contact} lang={lang} />}
      </div>

      <div className="footer-meta">
        <div className="footer-copy">
          <p>© 2025 - Center for Environmental &amp; Social Studies</p>
          <p>Khartoum</p>
        </div>
        <div className="footer-bottom-right">
          <div className="footer-social" aria-label="Social media links">
            <a href="https://www.facebook.com/profile.php?id=61584019486954" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H8v3h2.5v8h3Z" /></svg>
            </a>
            <a href="https://x.com/CessSudan" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" title="X (Twitter)">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.4L2.4 2h6.4l4.4 5.8L18.9 2Zm-1.1 18h1.7L7.8 3.9H6L17.8 20Z" /></svg>
            </a>
            <a href="https://www.instagram.com/cesssudan/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 12 16.5 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 12 14.5 2.5 2.5 0 0 0 12 9.5ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" /></svg>
            </a>
            <a href="https://www.linkedin.com/in/cesssudan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 3A1.5 1.5 0 1 1 4.5 6a1.5 1.5 0 0 1 0-3ZM3 8h3v12H3V8Zm5 0h2.9v1.6h.04A3.2 3.2 0 0 1 14 7.7c3 0 3.6 2 3.6 4.7V20h-3v-6.7c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V20H8V8Z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
