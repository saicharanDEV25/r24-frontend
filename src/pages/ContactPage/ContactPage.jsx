import Navbar from "../../components/Layout/Navbar/Navbar";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Layout/Footer/Footer";
import Seo from "../../components/common/Seo/Seo";

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Us — Vardhannapeta, Warangal"
        description="Get in touch with R24 Automotive in Vardhannapeta, Warangal for bike service, spare parts, detailing, painting and wrapping enquiries."
        keywords="R24 Automotive contact, bike shop Warangal contact, Vardhannapeta bike service"
        path="/contact"
      />
      <Navbar />
      <Contact />
      <Footer />
    </>
  );
}

export default ContactPage;
