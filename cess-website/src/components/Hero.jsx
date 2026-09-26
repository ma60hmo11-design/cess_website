import React from "react";
import "../App.css";
import logoEN from "../assets/LOGOCESS2025-01.png";

export default function Hero({ text }) {
  return (
    <header className="hero section-shell">
      <div className="hero-header">
        <div className="hero-copy">
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
