import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import AIBikeAdvisor from "../../components/AIBikeAdvisor/AIBikeAdvisor";
import Seo from "../../components/common/Seo/Seo";
import "./HelpPage.css";

function HelpPage() {
  const whatsappMessage = encodeURIComponent(
    "Hello R24 Automotive 👋 I need some help — could you assist me?"
  );

  return (
    <>
      <Seo
        title="Help & FAQs"
        description="Frequently asked questions about R24 Automotive's bike servicing, spare parts, detailing and customization in Warangal, plus quick WhatsApp and call support."
        keywords="R24 Automotive help, bike service FAQ Warangal, contact bike shop Warangal"
        path="/help"
      />
      <Navbar />
      <section className="help-page">
        <div className="help-heading">
          <span className="section-tag">Help & Support</span>
          <h2>How Can We Help You?</h2>
          <p>Tell us what your bike is doing, or reach us directly.</p>
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

        <AIBikeAdvisor />
      </section>
      <Footer />
    </>
  );
}

export default HelpPage;
