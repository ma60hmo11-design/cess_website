import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer.jsx";
import ConflictImage from "../assets/mine4.png";
import Pdficon from "../assets/pdf-svgrepo-com.png";
import en from "../data/en.json";
import ar from "../data/Ar.json";
import { volkswagenReport } from "../data/volkswagenReport.js";
import englishCover from "../assets/volkswagen/english-cover-thumb.jpg";
import arabicCover from "../assets/volkswagen/arabic-cover-thumb.jpg";
import germanCover from "../assets/volkswagen/German Report.png";
import april2023Image from "../assets/volkswagen/april 2023.jpg";
import november2024Image from "../assets/volkswagen/November2024.jpg";
import mogoPressStamps from "../assets/volkswagen/mogo-press-stamps.png";

function VolkswagenReportView({ lang, onBack }) {
  const report = lang === "ar" ? volkswagenReport.ar : volkswagenReport.en;
  const [activeGroup, setActiveGroup] = useState(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [showCompanies, setShowCompanies] = useState(false);
  const [imageModal, setImageModal] = useState(null);
  const [activeSection, setActiveSection] = useState(report.nav[0].id);
  const sectionRefs = useRef({});

  const sliderImages = [april2023Image, november2024Image];
  const groupLabel = (group) => report.nav.find((item) => item.group === group)?.label || group;
  const narrativeCards = useMemo(
    () => [
      {
        id: "satellite",
        group: "satellite",
        title: report.sliderSection.title,
        text: report.sliderSection.body[0],
      },
      {
        id: "routes",
        group: "routes",
        title: report.routesSection.title,
        text: report.routesSection.body[0],
      },
      { id: "corporate", group: "corporate", title: report.corporateSection.title, text: report.corporateSection.body[0] },
    ],
    [report]
  );

  const evidenceCards = [
    {
      id: "slide-a",
      group: "satellite",
      title: report.sliderSection.slides[0].title,
      text: report.sliderSection.slides[0].caption,
      image: april2023Image,
    },
    {
      id: "slide-b",
      group: "satellite",
      title: report.sliderSection.slides[1].title,
      text: report.sliderSection.slides[1].caption,
      image: november2024Image,
    },
    {
      id: "mogo",
      group: "routes",
      title: report.routesSection.mogoCaption,
      text: report.routesSection.sources[0].label,
      image: mogoPressStamps,
      href: report.routesSection.sources[0].href,
    },
    {
      id: "vw-pdf",
      group: "corporate",
      title: report.corporateSection.sources[2].label,
      text: report.corporateSection.sources[2].label,
      image: englishCover,
      href: report.corporateSection.sources[2].href,
    },
    {
      id: "dw",
      group: "corporate",
      title: report.corporateSection.sources[4].label,
      text: report.corporateSection.sources[4].label,
      image: arabicCover,
      href: report.corporateSection.sources[4].href,
    },
  ];

  const nextSlide = () => setSlideIndex((current) => (current + 1) % report.sliderSection.slides.length);
  const prevSlide = () =>
    setSlideIndex((current) => (current - 1 + report.sliderSection.slides.length) % report.sliderSection.slides.length);

  const isRelated = (group) => activeGroup && activeGroup === group;
  const isMuted = (group) => activeGroup && activeGroup !== group;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % report.sliderSection.slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [report.sliderSection.slides.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0.1 }
    );

    const refs = Object.values(sectionRefs.current);
    refs.forEach((node) => node && observer.observe(node));

    return () => observer.disconnect();
  }, []);

  const registerSection = (id) => (node) => {
    sectionRefs.current[id] = node;
  };

  return (
    <section className="section project-detail volkswagen-report-shell">
      <div className="container">
        <button className="see-more-btn volkswagen-inline-back" onClick={onBack}>
          {report.ui.back}
        </button>

        <div className="volkswagen-report-header">
          <div className="volkswagen-report-intro">
            <h2>{report.title}</h2>
            <p className="volkswagen-report-subtitle">{report.subtitle}</p>
            <p>{report.date}</p>
          </div>

          <div className="volkswagen-report-pdfs">
            <a href={report.pdfLinks[0].href} target="_blank" rel="noopener noreferrer" className="volkswagen-pdf-tile">
              <img src={englishCover} alt={report.pdfLinks[0].coverAlt} />
              <div>
                <strong>{report.pdfLinks[0].title}</strong>
              </div>
            </a>
            <a href={report.pdfLinks[1].href} target="_blank" rel="noopener noreferrer" className="volkswagen-pdf-tile">
              <img src={arabicCover} alt={report.pdfLinks[1].coverAlt} />
              <div>
                <strong>{report.pdfLinks[1].title}</strong>
              </div>
            </a>
            <a href={report.pdfLinks[2].href} target="_blank" rel="noopener noreferrer" className="volkswagen-pdf-tile">
              <img src={germanCover} alt={report.pdfLinks[2].coverAlt} />
              <div>
                <strong>{report.pdfLinks[2].title}</strong>
              </div>
            </a>
          </div>
        </div>

        <nav className="volkswagen-section-nav">
          {report.nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`volkswagen-nav-pill ${activeSection === item.id ? "is-active" : ""}`}
              onMouseEnter={() => setActiveGroup(item.group)}
              onMouseLeave={() => setActiveGroup(null)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <section className="volkswagen-executive-card" id="summary" ref={registerSection("summary")}>
          <span className="volkswagen-section-kicker">{report.ui.summary}</span>
          {report.executiveSummary.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        <div className="volkswagen-linked-grid">
          <div className="volkswagen-story-column">
            <div className="volkswagen-column-head">
              <h3>{report.title}</h3>
            </div>
            <div className="volkswagen-card-stack">
              {narrativeCards.map((card) => (
                <article
                  key={card.id}
                  className={`volkswagen-link-card ${isRelated(card.group) ? "is-related" : ""} ${isMuted(card.group) ? "is-muted" : ""}`}
                  onMouseEnter={() => setActiveGroup(card.group)}
                  onMouseLeave={() => setActiveGroup(null)}
                >
                  <div className="volkswagen-link-card-top">
                    <h4>{card.title}</h4>
                    <span>{groupLabel(card.group)}</span>
                  </div>
                  <p>{card.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="volkswagen-evidence-column">
            <div className="volkswagen-column-head">
              <h3>{report.subtitle}</h3>
            </div>
            <div className="volkswagen-evidence-masonry">
              {evidenceCards.map((card) => {
                const content = (
                  <>
                    <img src={card.image} alt={card.title} />
                    <div className="volkswagen-evidence-copy">
                      <h4>{card.title}</h4>
                      <p>{card.text}</p>
                    </div>
                  </>
                );

                return card.href ? (
                  <a
                    key={card.id}
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`volkswagen-evidence-tile ${isRelated(card.group) ? "is-related" : ""} ${isMuted(card.group) ? "is-muted" : ""}`}
                    onMouseEnter={() => setActiveGroup(card.group)}
                    onMouseLeave={() => setActiveGroup(null)}
                    onClick={() =>
                      setImageModal({
                        src: card.image,
                        title: card.title,
                        text: card.text,
                      })
                    }
                  >
                    {content}
                  </a>
                ) : (
                  <article
                    key={card.id}
                    className={`volkswagen-evidence-tile ${isRelated(card.group) ? "is-related" : ""} ${isMuted(card.group) ? "is-muted" : ""}`}
                    onMouseEnter={() => setActiveGroup(card.group)}
                    onMouseLeave={() => setActiveGroup(null)}
                    onClick={() =>
                      setImageModal({
                        src: card.image,
                        title: card.title,
                        text: card.text,
                      })
                    }
                  >
                    {content}
                  </article>
                );
              })}
            </div>
          </div>
        </div>

        <section className="volkswagen-slider-card" id="satellite" ref={registerSection("satellite")}>
          <div className="volkswagen-slider-copy">
            <span className="volkswagen-section-kicker">{report.sliderSection.title}</span>
            {report.sliderSection.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="volkswagen-slider-panel">
            <div className="volkswagen-slider-frame">
              <button
                type="button"
                className="volkswagen-image-open"
                onClick={() =>
                  setImageModal({
                    src: sliderImages[slideIndex],
                    title: report.sliderSection.slides[slideIndex].title,
                    text: report.sliderSection.slides[slideIndex].caption,
                  })
                }
              >
                <img src={sliderImages[slideIndex]} alt={report.sliderSection.slides[slideIndex].title} />
              </button>
            </div>
            <div className="volkswagen-slider-controls">
              <button type="button" onClick={prevSlide}>
                ←
              </button>
              <div className="volkswagen-slider-caption">
                <strong>{report.sliderSection.slides[slideIndex].title}</strong>
                <p>{report.sliderSection.slides[slideIndex].caption}</p>
              </div>
              <button type="button" onClick={nextSlide}>
                →
              </button>
            </div>
          </div>

          <div className="volkswagen-slider-dots">
            {report.sliderSection.slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`volkswagen-dot ${slideIndex === index ? "is-active" : ""}`}
                onClick={() => setSlideIndex(index)}
                aria-label={slide.title}
              />
            ))}
          </div>

          <div className="volkswagen-findings-list volkswagen-scroll-card">
            {report.sliderSection.findings.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="volkswagen-deep-card" id="routes" ref={registerSection("routes")}>
          <span className="volkswagen-section-kicker">{report.routesSection.title}</span>
          {report.routesSection.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <figure className="volkswagen-mogo-card">
            <a href={report.routesSection.sources[0].href} target="_blank" rel="noopener noreferrer">
              <img src={mogoPressStamps} alt={report.routesSection.mogoCaption} />
            </a>
            <figcaption>{report.routesSection.mogoCaption}</figcaption>
          </figure>

            <div className="volkswagen-source-links">
            {report.routesSection.sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            ))}
          </div>
        </section>

        <section className="volkswagen-deep-card" id="corporate" ref={registerSection("corporate")}>
          <span className="volkswagen-section-kicker">{report.corporateSection.title}</span>
          {report.corporateSection.body.map((paragraph, index) => (
            <p key={`${paragraph}-${index}`}>{paragraph}</p>
          ))}

          <button className="volkswagen-popup-trigger" type="button" onClick={() => setShowCompanies(true)}>
            {report.ui.companies}
          </button>

          <div className="volkswagen-source-links">
            {report.corporateSection.sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            ))}
          </div>
        </section>

        <section className="volkswagen-deep-card" id="demands" ref={registerSection("demands")}>
          <span className="volkswagen-section-kicker">{report.demandSection.title}</span>
          {report.demandSection.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ol className="volkswagen-demand-list">
            {report.demandSection.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p>{report.demandSection.closing}</p>
        </section>

        <section className="volkswagen-deep-card" id="conclusion" ref={registerSection("conclusion")}>
          <span className="volkswagen-section-kicker">{report.conclusion.title}</span>
          {report.conclusion.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="volkswagen-source-links">
            {report.conclusion.sources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            ))}
          </div>
        </section>

        {showCompanies && (
          <div className="volkswagen-modal-backdrop" onClick={() => setShowCompanies(false)}>
            <div className="volkswagen-modal" onClick={(event) => event.stopPropagation()}>
              <div className="volkswagen-modal-head">
                <h3>{report.corporateSection.title}</h3>
                <button type="button" onClick={() => setShowCompanies(false)}>
                  ×
                </button>
              </div>
              <div className="volkswagen-company-list">
                {report.corporateSection.companies.map((company) => (
                  <p key={company}>{company}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {imageModal && (
          <div className="volkswagen-modal-backdrop" onClick={() => setImageModal(null)}>
            <div className="volkswagen-modal volkswagen-image-modal" onClick={(event) => event.stopPropagation()}>
              <div className="volkswagen-modal-head">
                <h3>{imageModal.title}</h3>
                <button type="button" onClick={() => setImageModal(null)}>
                  ×
                </button>
              </div>
              <img src={imageModal.src} alt={imageModal.title} className="volkswagen-modal-image" />
              <p>{imageModal.text}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Conflict({ lang }) {
  const t = lang === "en" ? en : ar;
  const project = t.projects.project_4;
  const location = useLocation();
  const navigate = useNavigate();
  const view = new URLSearchParams(location.search).get("view");
  const isVolkswagenView = view === "volkswagen";

  if (!project) return null;

  const openVolkswagen = () => navigate("/conflict?view=volkswagen");
  const closeVolkswagen = () => navigate("/conflict");

  return (
    <div className={`project-page-wrapper ${lang === "ar" ? "rtl" : ""}`}>
      {isVolkswagenView ? (
        <VolkswagenReportView lang={lang} onBack={closeVolkswagen} />
      ) : (
        <section className="section project-detail">
          <div className="container">
            <Link
              to="/"
              className="see-more-btn"
              style={{ marginBottom: "20px", display: "inline-block", textDecoration: "none" }}
            >
              {lang === "en" ? "← Back to Home" : "← العودة للرئيسية"}
            </Link>
            <img
              src={ConflictImage}
              alt={project.header}
              className="project-image"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h2 style={{ marginTop: "20px" }}>{project.header}</h2>
            <p style={{ lineHeight: "1.6", fontSize: "1.1rem", marginTop: "15px" }}>{project.body}</p>
            <div className="conflict-actions">
              <article className="conflict-feature-card">
                <div className="conflict-feature-copy">
                  <span className="volkswagen-section-kicker">{lang === "ar" ? "تقرير" : "Report"}</span>
                  <h3>{lang === "ar" ? volkswagenReport.ar.title : volkswagenReport.en.title}</h3>
                  <button className="see-more-btn conflict-report-link" onClick={openVolkswagen}>
                    {lang === "ar" ? "فتح التقرير" : "Open report"}
                  </button>
                </div>
                <img
                  src={lang === "ar" ? arabicCover : englishCover}
                  alt={lang === "ar" ? volkswagenReport.ar.title : volkswagenReport.en.title}
                  className="conflict-feature-cover"
                />
              </article>
            </div>
          </div>
        </section>
      )}

      <Footer text={t.footer} lang={lang} />
    </div>
  );
}
