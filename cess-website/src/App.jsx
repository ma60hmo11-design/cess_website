import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";

import "./App.css";

// i18n
import en from "./data/en.json";
import ar from "./data/Ar.json";

// components
import Hero from "./components/Hero.jsx";
import About from "./components/About.jsx";
import Projects from "./components/Projects.jsx";
import Publications from "./components/Publications.jsx";
import Footer from "./components/Footer.jsx";
import GeometryBar from "./components/GeometryBar.jsx";
import Ticker from "./components/Ticker.jsx";
import Contact from "./components/contact.jsx";
import Conflict from "./components/Conflict.jsx";
import BlogList from "./components/BlogList.jsx";
import BlogPost from "./components/Blogpost.jsx";


function AppContent() {
  const [lang, setLang] = useState("en");
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const t = lang === "en" ? en : ar;

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <div className={`site-wrapper ${lang === "ar" ? "rtl" : ""}`}>
      <div className="always-ltr">
        <GeometryBar />
        <Ticker />
      </div>

      <div className="top-buttons">
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={lang === "en" ? "Toggle navigation menu" : "فتح أو إغلاق القائمة"}
        >
          ☰
        </button>

        <button
          className="lang-switch"
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
        >
          {lang === "en" ? "ع" : "En"}
        </button>
      </div>

      {menuOpen && (
        <nav className={`menu-dropdown ${lang === "ar" ? "rtl" : ""}`} aria-label={lang === "en" ? "Site sections" : "أقسام الموقع"}>
          <button onClick={() => scrollToSection("about")}>
            {lang === "en" ? "About" : "عن المركز"}
          </button>
          <button onClick={() => scrollToSection("projects")}>
            {lang === "en" ? "Projects" : "المشاريع"}
          </button>
          <button onClick={() => scrollToSection("publications")}>
            {lang === "en" ? "Publications" : "المنشورات"}
          </button>
          <button onClick={() => scrollToSection("contact")}>
            {lang === "en" ? "Contact Us" : "تواصل معنا"}
          </button>
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero text={t.hero} lang={lang} />
              <About text={t.about} lang={lang} />
              <Projects text={t.projects} lang={lang} />
              <Publications text={t.publications} lang={lang} />
              <Contact text={t.contact} lang={lang} />
              <Footer text={t.footer} lang={lang} />
            </>
          }
        />

        <Route path="/blog" element={<BlogList lang={lang} />} />
        <Route path="/blog/:id" element={<BlogPost lang={lang} />} />
        <Route path="/conflict" element={<Conflict lang={lang} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
