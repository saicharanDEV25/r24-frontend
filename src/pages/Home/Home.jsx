import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import EngineExperience from "../../components/EngineExperience/EngineExperience";
import Services from "../../components/Services/Services";
import WhyChoose from "../../components/WhyChoose/WhyChoose";

import Gallery from "../../components/Gallery/Gallery";
import Reviews from "../../components/Reviews/Reviews";
import Contact from "../../components/Contact/Contact";
import Footer from "../../components/Layout/Footer/Footer";



function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 150);

    return () => clearTimeout(timer);
  }, [location.hash]);

  return (
<>
  <Navbar />
  <Hero />
  <EngineExperience />

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