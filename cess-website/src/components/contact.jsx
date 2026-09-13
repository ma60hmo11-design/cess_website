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
    <div id="contact" className="footer-contact">
      <div className="section-heading">
        <span className="section-eyebrow">{lang === "en" ? "Contact" : "تواصل"}</span>
        <h2>{text.heading}</h2>
      </div>

      <div className="section-content">
        <form className={`contact-form d-flex flex-column flex-md-row gap-2 align-items-md-end ${lang === "ar" ? "rtl" : ""}`} onSubmit={sendEmail}>

        <div className="contact-field form-floating">
          <input
            id="contact-email"
            className="form-control"
            type="email"
            placeholder=" "
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label htmlFor="contact-email">{text.email}</label>
        </div>

        <div className="contact-field contact-field-message form-floating">
          <textarea
            id="contact-message"
            className="form-control"
            placeholder=" "
            required
            rows="2"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <label htmlFor="contact-message">{text.message}</label>
        </div>

        <button type="submit" className="send-btn btn btn-light fw-bold px-4 height-auto">
          {text.send}
        </button>

        {status === "success" && <p className="success contact-status">{text.success}</p>}
        {status === "error" && <p className="error contact-status">{text.error}</p>}
        </form>
      </div>
    </div>
  );
}
