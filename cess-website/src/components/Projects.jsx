import React, { useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

import MapImage from "../assets/map_project.png";
import PublicationImage from "../assets/mine3.png";
import broadCastImage from "../assets/mine2.png";
import ConflictImage from "../assets/mine4.png";

export default function Projects({ text, lang }) {

  // states for expand/collapse
  const [expanded, setExpanded] = useState({
    p1: false,
    p2: false,
    p3: false,
    p4: false
  });

  // DIFFERENT LIMIT for EN / AR
  const limit = lang === "ar" ? 200 : 120;

  // preview logic
  const getPreview = (body, isExpanded) => {
    if (isExpanded) return body;
    if (body.length <= limit) return body;
    return body.substring(0, limit) + "...";
  };

  // button label
  const more = lang === "ar" ? "عرض المزيد" : "See more";
  const less = lang === "ar" ? "عرض أقل" : "See less";

  return (
    <section id="projects" className="section projects section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "ar" ? "المشاريع" : "Projects"}</span>
        <h2>{text.heading}</h2>
      </div>

      <div className="section-content">
        <div className="project-grid">

          {/* PROJECT 1 */}
          <article className="project-card">
            <img src={MapImage} alt="" className="project-image" />
            <div className="project-card-body">
              <h3>{text.project_1.header}</h3>

              <p>{getPreview(text.project_1.body, expanded.p1)}</p>

              {text.project_1.body.length > limit && (
                <button
                  className="see-more-btn"
                  onClick={() => setExpanded({ ...expanded, p1: !expanded.p1 })}
                >
                  {expanded.p1 ? less : more}
                </button>
              )}
            </div>
          </article>

          {/* PROJECT 2 */}
          <article className="project-card">
            <img src={broadCastImage} alt="" className="project-image" />
            <div className="project-card-body">
              <h3>{text.project_2.header}</h3>

              <p>{getPreview(text.project_2.body, expanded.p2)}</p>

              {text.project_2.body.length > limit && (
                <button
                  className="see-more-btn"
                  onClick={() => setExpanded({ ...expanded, p2: !expanded.p2 })}
                >
                  {expanded.p2 ? less : more}
                </button>
              )}
            </div>
          </article>

          {/* PROJECT 3 */}
          <article className="project-card">
            <Link to="/blog" className="card-link">
              <img src={PublicationImage} alt="" className="project-image" />
              <div className="project-card-body">
                <h3>{text.project_3.header}</h3>

                <p>{getPreview(text.project_3.body, expanded.p3)}</p>
              </div>
            </Link>
            {text.project_3.body.length > limit && (
              <button
                className="see-more-btn"
                onClick={() => setExpanded({ ...expanded, p3: !expanded.p3 })}
              >
                {expanded.p3 ? less : more}
              </button>
            )}
          </article>

          {/* PROJECT 4 */}
          <article className="project-card">
            <Link to="/conflict" className="card-link">
              <img src={ConflictImage} alt="" className="project-image" />
              <div className="project-card-body">
                <h3>{text.project_4.header}</h3>

                <p>{getPreview(text.project_4.body, expanded.p4)}</p>
              </div>
            </Link>
            
            {text.project_4.body.length > limit && (
              <button
                className="see-more-btn"
                onClick={() => setExpanded({ ...expanded, p4: !expanded.p4 })}
              >
                {expanded.p4 ? less : more}
              </button>
            )}
          </article>

        </div>
      </div>
    </section>
  );
}
