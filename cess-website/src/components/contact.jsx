import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../App.css";

export default function Contact({ text, lang }) {

  const [form, setForm] = useState({
    email: "",
    message: ""
  });

  const [status, setStatus] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.send(
      "service_8npx0eg",  // your EmailJS service ID
      "template_0wejsvo", // your template ID
      {
        user_email: form.email,
        user_message: form.message
      },
      "NcrgN4rHdKhHLxgOf" // EmailJS public key
    )
    .then(() => {
      setStatus("success");
      setForm({ email: "", message: "" });
    })
    .catch(() => setStatus("error"));
  };

  return (
    <section id="contact" className="section contact section-shell">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "en" ? "Contact" : "تواصل"}</span>
        <h2>{text.heading}</h2>
      </div>

      <div className="section-content">
      <form className={`contact-form ${lang === "ar" ? "rtl" : ""}`} onSubmit={sendEmail}>

        <label>{text.email}</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>{text.message}</label>
        <textarea
          required
          rows="5"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />

        <button type="submit" className="send-btn">
          {text.send}
        </button>

        {status === "success" && <p className="success">{text.success}</p>}
        {status === "error" && <p className="error">{text.error}</p>}
      </form>
      </div>
    </section>
  );
}
