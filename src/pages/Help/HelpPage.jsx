import { useState } from "react";
import { FaChevronDown, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import "./HelpPage.css";

const faqs = [
  {
    q: "How do I book a service or accessory installation?",
    a: "Tap 'Book Service' at the top of the site, or message us directly on WhatsApp with your bike model and what you need. We'll confirm a slot with you.",
  },
  {
    q: "Do you only sell genuine KTM parts?",
    a: "Yes — everything in Accessories and Tyres & Wheels is genuine KTM-compatible. If a part shows 'Out of Stock', message us on WhatsApp and we'll check availability or order it in.",
  },
  {
    q: "How does the OTP login work?",
    a: "Enter your mobile number, we send a one-time code to verify it's really you, and you're logged in — no password to remember. Your account is used for tracking your bookings and saved favorites.",
  },
  {
    q: "Can I cancel or reschedule a booking?",
    a: "Yes, just message us on WhatsApp or call the shop directly with your booking details and we'll sort it out.",
  },
  {
    q: "Do you offer installation with parts I buy?",
    a: "Yes, most accessories and tyres can be installed at our shop. Choose 'With Installation' where relevant, or ask us on WhatsApp.",
  },
  {
    q: "Where is R24 Automotive located?",
    a: "Vardhannapeta, Warangal, Telangana. Use the 'Visit Shop' option in our chat assistant for directions.",
  },
];

function HelpPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const whatsappMessage = encodeURIComponent(
    "Hello R24 Automotive 👋 I need some help — could you assist me?"
  );

  return (
    <>
      <Navbar />
      <section className="help-page">
        <div className="help-heading">
          <span className="section-tag">Help & Support</span>
          <h2>How Can We Help You?</h2>
          <p>Common questions, and quick ways to reach us directly.</p>
        </div>

        <div className="help-contact-row">
          <a
            href={`https://wa.me/918309560622?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="help-contact-card whatsapp"
          >
            <FaWhatsapp />
            <div>
              <h4>Chat on WhatsApp</h4>
              <p>Fastest way to reach us</p>
            </div>
          </a>

          <a href="tel:+918309560622" className="help-contact-card call">
            <FaPhoneAlt />
            <div>
              <h4>Call the Shop</h4>
              <p>+91 83095 60622</p>
            </div>
          </a>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={openIndex === index ? "faq-item open" : "faq-item"}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() =>
                  setOpenIndex(openIndex === index ? -1 : index)
                }
              >
                {faq.q}
                <FaChevronDown className="faq-chevron" />
              </button>

              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default HelpPage;
