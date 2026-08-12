import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../../components/common/Seo/Seo";
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
  <Seo
    title="KTM, Royal Enfield & Kawasaki Bike Service, Detailing & Spare Parts in Warangal"
    description="R24 Automotive, Vardhannapeta, Warangal — genuine spare parts, accessories, bike servicing, ceramic & Teflon coating, custom painting and wrapping for KTM, Royal Enfield, Yamaha, Bajaj, Benelli and Kawasaki motorcycles."
    keywords="R24 Automotive, KTM service Warangal, Royal Enfield service Warangal, Kawasaki Z900 service, bike detailing Warangal, ceramic coating bike, Teflon coating bike, bike wrapping Warangal, genuine bike spare parts, KTM accessories Warangal"
    path="/"
  />
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