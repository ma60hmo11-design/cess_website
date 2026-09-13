import React from "react";
import "../App.css";
import Pdficon from "../assets/pdf-svgrepo-com.png";
import fuelCoverEn from "../assets/Fuel of War and Resource Depletion.png";
import fuelCoverAr from "../assets/Fuel of War and Resource Depletion - ar.png";
import surfaceCoverEn from "../assets/ENGLISH Under the Surface.jpg";
import surfaceCoverAr from "../assets/ARABIC Under the Surface.jpg";
import blueNileCover from "../assets/Blue Nile en.png";

export default function Publications({ text, lang }) {
  if (!text) return null;

  const pubKeys = Object.keys(text)
    .filter((key) => /^publication_\d+$/.test(key))
    .sort((a, b) => {
      const na = parseInt(a.split("_")[1], 10);
      const nb = parseInt(b.split("_")[1], 10);
      return na - nb;
    });

  const covers = lang === "ar"
    ? [fuelCoverAr, surfaceCoverAr, blueNileCover]
    : [fuelCoverEn, surfaceCoverEn, blueNileCover];

  return (
    <section id="publications" className="section publications section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "ar" ? "المنشورات" : "Publications"}</span>
        <h2>{lang === "ar" ? "المنشورات" : "Publications"}</h2>
      </div>

      <div className="section-content">
        <div className="pub-list">
          {pubKeys.map((key) => {
            const pub = text[key];
            if (!pub) return null;

            const hasContent =
              (pub.header && pub.header.trim()) ||
              (pub.description && pub.description.trim()) ||
              (pub.year && String(pub.year).trim()) ||
              (pub.link && pub.link.trim());

            if (!hasContent) return null;

            const cover = covers[Number(key.split("_")[1]) - 1] || covers[0];
            const hasPdfLink = pub.link && (pub.link.startsWith("/") || pub.link.startsWith("http"));

            return (
              <article className="pub-item" key={key}>
                <div className="pub-cover-wrapper">
                  <img className="book-cover" src={cover} alt={`${pub.header} cover`} />
                </div>
                <div className="pub-copy">
                  <h4>{pub.header}</h4>
                  <span className="pub-meta">
                    {pub.description} - {pub.year}
                  </span>
                </div>
                {hasPdfLink ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link publication-cta"
                  >
                    <span>{lang === "ar" ? "عرض الوثيقة" : "View document"}</span>
                    <img className="pdf-icon" src={Pdficon} alt="PDF icon" />
                  </a>
                ) : (
                  <span className="publication-available">{pub.link || (lang === "ar" ? "قريبًا" : "Coming soon")}</span>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
