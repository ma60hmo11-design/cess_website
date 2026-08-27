import React from "react";
import { Link } from "react-router-dom";
import blogData from "../data/blog.json";
import { getBlogImage } from "../data/blogImages.js";
import Footer from "../components/Footer.jsx";
import en from "../data/en.json";
import ar from "../data/Ar.json";

export default function BlogList({ lang }) {
  const posts = blogData.posts;
  const t = lang === "en" ? en : ar;

  return (
    <section id="blog" className="blog-list section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "en" ? "Journal" : "المدونة"}</span>
        <h2>{lang === "en" ? "Blog and Readings" : "المدونة والقراءات"}</h2>
      </div>

      <div className="section-content">
        <div className="blog-grid">
          {posts.map((post) => {
            const image = getBlogImage(lang, post.id);

            return (
              <article className="blog-card" key={post.id}>
                {image && (
                  <img
                    src={image}
                    alt={lang === "en" ? post.title_en : post.title_ar}
                    className="blog-card-image"
                  />
                )}

                <div className="blog-card-meta">
                  <p className="author">{lang === "en" ? post.author_en : post.author_ar}</p>
                </div>

                <h3>{lang === "en" ? post.title_en : post.title_ar}</h3>
                <p className="blog-preview">{lang === "en" ? post.preview_en : post.preview_ar}</p>

                <Link to={`/blog/${post.id}`} className="see-more-btn">
                  {lang === "en" ? "Read more" : "اقرأ المزيد"}
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <Footer text={t.footer} lang={lang} />
    </section>
  );
}
