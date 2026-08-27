import React from "react";
import { useParams, Link } from "react-router-dom";
import blogData from "../data/blog.json";
import { getBlogImage } from "../data/blogImages.js";
import Footer from "../components/Footer.jsx";
import en from "../data/en.json";
import ar from "../data/Ar.json";

function renderInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    const isBold = part.startsWith("**") && part.endsWith("**");
    if (isBold) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

function renderRichBody(bodyText) {
  if (!bodyText) return null;

  const lines = bodyText.split("\n");
  const blocks = [];
  let listBuffer = [];

  const flushList = (keyBase) => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={`${keyBase}-ul`} className="blog-ul">
          {listBuffer.map((item, idx) => (
            <li key={`${keyBase}-li-${idx}`}>{renderInlineBold(item)}</li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  lines.forEach((rawLine, idx) => {
    const line = rawLine.trimEnd();

    if (line.trim() === "") {
      flushList(idx);
      blocks.push(<div key={`sp-${idx}`} className="blog-space" />);
      return;
    }

    if (line.trim().startsWith("- ")) {
      listBuffer.push(line.trim().slice(2));
      return;
    }

    flushList(idx);

    if (line.startsWith("### ")) {
      blocks.push(<h4 key={`h4-${idx}`}>{renderInlineBold(line.slice(4))}</h4>);
      return;
    }
    if (line.startsWith("## ")) {
      blocks.push(<h3 key={`h3-${idx}`}>{renderInlineBold(line.slice(3))}</h3>);
      return;
    }
    if (line.startsWith("# ")) {
      blocks.push(<h2 key={`h2-${idx}`}>{renderInlineBold(line.slice(2))}</h2>);
      return;
    }

    blocks.push(<p key={`p-${idx}`}>{renderInlineBold(line)}</p>);
  });

  flushList("end");
  return blocks;
}

export default function BlogPost({ lang }) {
  const { id } = useParams();
  const t = lang === "en" ? en : ar;
  const post = blogData.posts.find((entry) => entry.id === id);

  if (!post) return <h2>Post not found</h2>;

  const body = lang === "en" ? post.body_en : post.body_ar;
  const image = getBlogImage(lang, id);

  return (
    <>
      <section className="blog-post section-shell">
        <div className="article-header">
          <span className="section-eyebrow">{lang === "en" ? "Essay" : "مقال"}</span>
          <h2>{lang === "en" ? post.title_en : post.title_ar}</h2>
          <p className="author">{lang === "en" ? post.author_en : post.author_ar}</p>
        </div>

        <div className="section-content">
          {image && (
            <img
              src={image}
              alt={lang === "en" ? post.title_en : post.title_ar}
              className="article-cover"
            />
          )}
          <article className="blog-body">{renderRichBody(body)}</article>
        </div>

        <Link to="/blog" className="see-more-btn">
          {lang === "en" ? "← Back to Blog" : "← العودة للمدونة"}
        </Link>
      </section>

      <Footer text={t.footer} lang={lang} />
    </>
  );
}
