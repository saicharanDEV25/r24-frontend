import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Hero.css";
import OptimizedImage from "../common/OptimizedImage/OptimizedImage";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <OptimizedImage
        src="/images/hero.jpg"
        webpSrc="/images/hero.webp"
        alt="R24 Automotive"
        className="hero-image"
        wrapperClassName="hero-image"
        eager
      />

      <div className="container hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ride Beyond
          <br />
          <span>Ordinary.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Premium Bike Detailing, KTM Accessories,
          Performance Upgrades, Wrapping & Tyres.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/bike-service" className="primary-btn">
            Book Service
          </Link>

          <Link to="/products" className="secondary-btn">
            Explore Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
