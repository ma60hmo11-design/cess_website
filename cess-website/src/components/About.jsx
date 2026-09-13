import React, { useState } from "react";
import "../App.css";

export default function About({ text, lang }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="about" className="section about section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "ar" ? "عن المركز" : "About"}</span>
        <h2>{text.heading}</h2>
      </div>
      <div className="section-content">
        <div className={`section-panel prose-block about-panel ${isExpanded ? "is-expanded" : ""}`}>
          <div className="about-copy">
            <p>{text.body}</p>
          </div>
          <button
            className="about-toggle"
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            aria-expanded={isExpanded}
          >
            {lang === "ar"
              ? isExpanded ? "عرض أقل" : "اقرأ المزيد"
              : isExpanded ? "Show Less" : "Read More"}
          </button>
        </div>
      </div>
    </section>
  );
}
