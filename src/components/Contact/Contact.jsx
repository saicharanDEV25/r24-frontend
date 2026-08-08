import { useState } from "react";
import "./Contact.css";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaClock,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import api from "../../services/api";
import ScrollReveal from "../common/ScrollReveal/ScrollReveal";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function Contact() {
  const whatsappMessage = encodeURIComponent(
    "Hello R24 Automotive 👋\n\nI visited your website and I'm interested in your services. Please provide me with more details."
  );

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      setError("Please enter a valid 10 digit mobile number.");
      return;
    }

    if (form.subject.trim().length < 2 || form.message.trim().length < 5) {
      setError("Please enter a subject and message.");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      setForm(initialForm);
      setShowConfirmation(true);
    } catch (err) {
      console.error("Error submitting contact message:", err);
      setError("Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="contact">

      <ScrollReveal>
        <div className="contact-heading">
          <h2>Contact Us</h2>
          <p>
            Visit our showroom or send us a message — we usually reply within
            an hour.
          </p>
        </div>
      </ScrollReveal>

      <div className="contact-wrapper">

        <ScrollReveal className="contact-info" y={30}>

          <div className="info-item">
            <FaPhoneAlt className="icon" />
            <div>
              <h3>Call Us</h3>
              <p>
                <a href="tel:+918309560622" className="info-link-btn">
                  +91 83095 60622
                </a>
              </p>
            </div>
          </div>

          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h3>Location</h3>
              <p className="info-address">
                R24 Automotive, Vardhannapeta,<br />
                Warangal, Telangana
              </p>
              <a
                href="https://www.google.com/maps?q=R24+Automotive,+Vardhannapeta,+Warangal,+Telangana"
                target="_blank"
                rel="noreferrer"
                className="info-link-btn"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="info-item">
            <FaClock className="icon" />
            <div>
              <h3>Working Hours</h3>
              <p>Monday - Sunday<br />9:00 AM - 9:00 PM</p>
            </div>
          </div>

          <div className="social-buttons">

            <a
              href={`https://wa.me/918309560622?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              <FaWhatsapp /> WhatsApp
            </a>

            <a
              href="https://www.instagram.com/r24.automotive_/?hl=en"
              target="_blank"
              rel="noreferrer"
              className="instagram-btn"
            >
              <FaInstagram /> Instagram
            </a>

          </div>

        </ScrollReveal>

        <ScrollReveal delay={0.15} y={30}>
        <form className="contact-form" onSubmit={submitForm}>

          <h3>Send Us a Message</h3>

          <div className="contact-form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              maxLength={10}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value.replace(/\D/g, ""),
                })
              }
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={handleChange}
          />

          {error && <p className="contact-form-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
        </ScrollReveal>

        <ScrollReveal className="contact-map" delay={0.25} y={30}>

          <iframe
            title="R24 Automotive"
            src="https://www.google.com/maps?q=R24+Automotive,+Vardhannapeta,+Telangana&output=embed"
            loading="lazy"
          ></iframe>

        </ScrollReveal>

      </div>

      {showConfirmation && (
        <div
          className="contact-confirm-overlay"
          onClick={() => setShowConfirmation(false)}
        >
          <div
            className="contact-confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="contact-confirm-close"
              onClick={() => setShowConfirmation(false)}
            >
              <FaTimes />
            </button>

            <FaCheckCircle className="contact-confirm-icon" />

            <h3>Message Sent!</h3>

            <p>Our team will contact you as soon as possible, within 1 hour.</p>

            <button
              className="contact-confirm-btn"
              onClick={() => setShowConfirmation(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

export default Contact;
