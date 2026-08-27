import React from "react";
import "../App.css";
import logoAR from "../assets/cessLogo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src={logoAR} alt="CESS Arabic Logo" className="logo-footer" />
      </div>
      <div className="footer-copy">
        <p>© 2025 - Center for Environmental & Social Studies</p>
        <p>Khartoum </p>
      </div>
    </footer>
  );
}
 