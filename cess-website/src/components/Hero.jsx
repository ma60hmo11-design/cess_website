import React from "react";
import "../App.css";
import logoEN from "../assets/LOGOCESS2025-01.png";

export default function Hero({ text, lang }) {
  return (
    <header className="hero section-shell">
      <div className="hero-header">
        <div className="hero-copy">
          <span
            className={`section-eyebrow section-eyebrow--${lang === "ar" ? "ar" : "en"}`}
            dir={lang === "ar" ? "rtl" : "ltr"}
          >
            {lang === "ar" ? "مركز الدراسات البيئية والاجتماعية" : "Centre for Environmental & Social Studies"}
          </span>
          <h1 className="hero-title">{text.title}</h1>
        </div>
        <div className="hero-divider" aria-hidden="true" />
        <div className="hero-mark">
          <img src={logoEN} alt="CESS Logo English" className="logo-main" />
        </div>
      </div>
      <p className="hero-text">{text.text}</p>
    </header>
  );
}
