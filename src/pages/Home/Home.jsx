import Navbar from "../../components/Layout/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import WhyChoose from "../../components/WhyChoose/WhyChoose";

import Gallery from "../../components/Gallery/Gallery";
import Reviews from "../../components/Reviews/Reviews";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Layout/Footer/Footer";



function Home() {
  return (
<>
  <Navbar />
  <Hero />

  <Services />
  <WhyChoose />

  <Gallery />
  <Reviews />
  <Contact />
  <Footer />
</>
  );
}

export default Home;