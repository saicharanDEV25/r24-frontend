import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <img
        src="/images/hero.jpg"
        alt="R24 Automotive"
        className="hero-image"
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
          <a
            href="https://wa.me/918309560622?text=Hello%20R24%20Automotive%20👋%20I%20want%20to%20book%20a%20service."
            target="_blank"
            rel="noreferrer"
            className="primary-btn"
          >
            Book Service
          </a>

          <Link to="/products" className="secondary-btn">
            Explore Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;