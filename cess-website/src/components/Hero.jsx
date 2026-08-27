import React from "react";
import "../App.css";
import logoEN from "../assets/LOGOCESS2025-01.png";

export default function Hero({ text, lang }) {
  return (
    <header className="hero section-shell">
      <div className="hero-copy">
        <span className="section-eyebrow">
          {lang === "ar" ? "مركز الدراسات البيئية والاجتماعية" : "Centre for Environmental & Social Studies"}
        </span>
        <h1 className="hero-title">{text.title}</h1>
        <p className="hero-text">{text.text}</p>
      </div>
      <div className="hero-mark">
        <img src={logoEN} alt="CESS Logo English" className="logo-main" />
      </div>
    </header>
  );
}
