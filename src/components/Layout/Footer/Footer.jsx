import {
  FaInstagram,
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>R24 Automotive</h2>

          <p>
            Premium Bike Accessories, Detailing, Wrapping,
            Painting, Tyres & Performance Modifications.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#products">Accessories</a></li>
            <li><a href="#gallery">Gallery</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact</h3>

          <p>
            <FaPhoneAlt /> &nbsp;+91 83095 60622
          </p>

          <p>
            <FaMapMarkerAlt /> &nbsp;R24 Automotive,
            Vardhannapeta, Warangal, Telangana
          </p>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>

          <div className="footer-social-icons">
            <a
              href="https://www.instagram.com/r24.automotive_/?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href={`https://wa.me/918309560622?text=${encodeURIComponent(
                "Hello R24 Automotive 👋\n\nI visited your website and I'm interested in your services. Please provide me with more details."
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} R24 Automotive. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;