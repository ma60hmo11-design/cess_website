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

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero text={t.hero} lang={lang} />
              <About text={t.about} lang={lang} />
              <Projects text={t.projects} lang={lang} />
              <Publications text={t.publications} lang={lang} />
              <Footer text={t} lang={lang} menuOpen={menuOpen} setMenuOpen={setMenuOpen} setLang={setLang} scrollToSection={scrollToSection} />
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
