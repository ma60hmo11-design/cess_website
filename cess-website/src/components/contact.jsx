import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "../App.css";

export default function Contact({ text, lang }) {
  const [form, setForm] = useState({ email: "", message: "" });
  const [status, setStatus] = useState("");

  const sendEmail = (event) => {
    event.preventDefault();
    emailjs.send(
      "service_8npx0eg",
      "template_0wejsvo",
      { user_email: form.email, user_message: form.message },
      "NcrgN4rHdKhHLxgOf"
    )
      .then(() => {
        setStatus("success");
        setForm({ email: "", message: "" });
      })
      .catch(() => setStatus("error"));
  };

  return (
    <section id="contact" className="footer-contact">
      <h3>{lang === "en" ? "Send Message" : text.send}</h3>
      <form className={`contact-form ${lang === "ar" ? "rtl" : ""}`} onSubmit={sendEmail}>
        <div className="contact-field form-floating">
          <input id="contact-email" className="form-control" type="email" placeholder=" " required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <label htmlFor="contact-email">{text.email}</label>
        </div>
        <div className="contact-field contact-field-message form-floating">
          <textarea id="contact-message" className="form-control" placeholder=" " required rows="2" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
          <label htmlFor="contact-message">{text.message}</label>
        </div>
        <button type="submit" className="send-btn btn btn-light fw-bold px-4 height-auto">{text.send}</button>
        {status === "success" && <p className="success contact-status">{text.success}</p>}
        {status === "error" && <p className="error contact-status">{text.error}</p>}
      </form>
    </section>
  );
}
