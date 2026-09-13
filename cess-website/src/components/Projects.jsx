import React, { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";

import MapImage from "../assets/map_project.png";
import PublicationImage from "../assets/mine3.png";
import broadCastImage from "../assets/mine2.png";
import ConflictImage from "../assets/mine4.png";

export default function Projects({ text, lang }) {

  const [selectedProject, setSelectedProject] = useState(null);

  // DIFFERENT LIMIT for EN / AR
  const limit = lang === "ar" ? 200 : 120;

  // preview logic
  const getPreview = (body) => {
    if (body.length <= limit) return body;
    return body.substring(0, limit) + "...";
  };

  const readMore = lang === "ar" ? "اقرأ المزيد" : "Read More";
  const closeLabel = lang === "ar" ? "إغلاق" : "Close";
  const visitLabel = lang === "ar" ? "زيارة" : "Visit";

  const projects = [
    { key: "p1", image: MapImage, data: text.project_1 },
    { key: "p2", image: broadCastImage, data: text.project_2 },
    { key: "p3", image: PublicationImage, data: text.project_3, href: "/blog" },
    { key: "p4", image: ConflictImage, data: text.project_4, href: "/conflict" }
  ];

  useEffect(() => {
    if (!selectedProject) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  const renderProjectCard = (project, setIndex) => {
    const cardContent = (
      <>
        <img src={project.image} alt="" className="project-image" />
        <div className="project-card-body">
          <h3>{project.data.header}</h3>
          <p>{getPreview(project.data.body)}</p>
        </div>
      </>
    );

    return (
      <article className="project-card" key={`${project.key}-${setIndex}`}>
        {project.href ? <Link to={project.href} className="card-link">{cardContent}</Link> : cardContent}
        <button className="see-more-btn" type="button" onClick={() => setSelectedProject(project)}>
          {readMore}
        </button>
      </article>
    );
  };

  return (
    <section id="projects" className="section projects section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "ar" ? "المشاريع" : "Projects"}</span>
        <h2>{text.heading}</h2>
      </div>

      <div className="section-content">
        <div className="project-grid">
          <div className="project-marquee-set" aria-hidden="false">
            {projects.map((project) => renderProjectCard(project, 0))}
          </div>
          <div className="project-marquee-set" aria-hidden="true">
            {projects.map((project) => renderProjectCard(project, 1))}
          </div>
        </div>
      </div>

      {selectedProject && (
        <div
          className="project-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedProject(null);
          }}
        >
          <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
            <button
              className="project-modal-close"
              type="button"
              onClick={() => setSelectedProject(null)}
              aria-label={closeLabel}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <img src={selectedProject.image} alt="" className="project-modal-image" />
            <div className="project-modal-body">
              <h3 id="project-modal-title">{selectedProject.data.header}</h3>
              <p>{selectedProject.data.body}</p>
              <div className="project-modal-actions">
                {selectedProject.href && (
                  <Link to={selectedProject.href} className="see-more-btn modal-action-btn">
                    {visitLabel}
                  </Link>
                )}
                <button className="see-more-btn" type="button" onClick={() => setSelectedProject(null)}>
                  {closeLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
