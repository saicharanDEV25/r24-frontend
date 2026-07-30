import "./Contact.css";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaWhatsapp,
  FaClock,
} from "react-icons/fa";

function Contact() {
  const whatsappMessage = encodeURIComponent(
    "Hello R24 Automotive 👋\n\nI visited your website and I'm interested in your services. Please provide me with more details."
  );

  return (
    <section className="contact">

      <div className="contact-heading">
        <h2>Contact Us</h2>
        <p>
          Visit our showroom or contact us through WhatsApp or Instagram.
        </p>
      </div>

      <div className="contact-wrapper">

        <div className="contact-info">

          <div className="info-item">
            <FaPhoneAlt className="icon" />
            <div>
              <h3>Call Us</h3>
              <p>+91 83095 60622</p>
            </div>
          </div>

          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <div>
              <h3>Location</h3>
              <p>
                R24 Automotive<br />
                Vardhannapeta,<br />
                Warangal, Telangana
              </p>
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

        </div>

        <div className="contact-map">

          <iframe
            title="R24 Automotive"
            src="https://www.google.com/maps?q=R24+Automotive,+Vardhannapeta,+Telangana&output=embed"
            loading="lazy"
          ></iframe>

        </div>

      </div>

    </section>
  );
}

export default Contact;