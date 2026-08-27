import React from "react";
import "../App.css";

export default function About({ text, lang }) {
  return (
    <section id="about" className="section about section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "ar" ? "عن المركز" : "About"}</span>
        <h2>{text.heading}</h2>
      </div>
      <div className="section-content">
        <div className="section-panel prose-block">
          <p>{text.body}</p>
        </div>
      </div>
    </section>
  );
}
