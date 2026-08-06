import { useState } from "react";
import "./BikeWrapping.css";
import {
  FaShieldAlt,
  FaSyncAlt,
  FaPalette,
  FaRupeeSign,
} from "react-icons/fa";

const benefits = [
  {
    icon: <FaShieldAlt />,
    title: "Protects Your Paint",
    desc: "Shields the factory paint from stone chips, scratches and sun fade.",
  },
  {
    icon: <FaSyncAlt />,
    title: "Fully Reversible",
    desc: "Peel it off anytime and your original paint is untouched underneath.",
  },
  {
    icon: <FaPalette />,
    title: "Unlimited Designs",
    desc: "Any finish, any colour, any pattern — far more variety than paint.",
  },
  {
    icon: <FaRupeeSign />,
    title: "Cost-Effective",
    desc: "A fresh new look for a fraction of the cost of a full repaint.",
  },
];

const wrapTypes = [
  {
    id: "gloss",
    name: "Gloss Wrap",
    desc: "Vibrant, mirror-like shine that makes colours pop.",
    price: "₹8,999 onwards",
  },
  {
    id: "matte",
    name: "Matte Wrap",
    desc: "Flat, non-reflective finish for a stealthy, modern look.",
    price: "₹9,499 onwards",
  },
  {
    id: "satin",
    name: "Satin Wrap",
    desc: "Soft sheen between gloss and matte — subtle and premium.",
    price: "₹9,999 onwards",
  },
  {
    id: "chrome",
    name: "Chrome Wrap",
    desc: "Mirror-metallic finish for maximum head-turning impact.",
    price: "₹13,999 onwards",
  },
  {
    id: "carbon",
    name: "Carbon Fibre Wrap",
    desc: "Woven carbon-look texture for a race-inspired finish.",
    price: "₹11,499 onwards",
  },
  {
    id: "chameleon",
    name: "Colour-Shift Wrap",
    desc: "Shifts hue with light and viewing angle for a striking effect.",
    price: "₹14,999 onwards",
  },
  {
    id: "camo",
    name: "Camouflage Wrap",
    desc: "Rugged camo pattern, especially popular on Adventure models.",
    price: "₹10,999 onwards",
  },
  {
    id: "racing",
    name: "Racing Stripe Wrap",
    desc: "Bold accent stripes over a solid base for a track-inspired look.",
    price: "₹9,999 onwards",
  },
];

function BikeWrapping() {
  const [selectedWrap, setSelectedWrap] = useState(wrapTypes[0]);

  const whatsappMessage = encodeURIComponent(
    `Hello R24 Automotive 👋 I'm interested in a "${selectedWrap.name}" for my KTM. Please share pricing and design options.`
  );

  return (
    <section className="bike-wrapping" id="bike-wrapping">
      <div className="section-heading">
        <span className="section-tag">Bike Wrapping</span>
        <h2>Wrap Your KTM in a New Look</h2>
        <p>
          Vinyl wrapping lets you completely change your bike's finish
          without touching the factory paint underneath.
        </p>
      </div>

      <div className="wrap-benefits">
        {benefits.map((b, i) => (
          <div className="wrap-benefit-card" key={i}>
            <div className="wrap-benefit-icon">{b.icon}</div>
            <h4>{b.title}</h4>
            <p>{b.desc}</p>
          </div>
        ))}
      </div>

      <div className="wrap-type-list">
        <h4>Types of Wrapping</h4>

        <div className="wrap-type-grid">
          {wrapTypes.map((wrap) => (
            <button
              key={wrap.id}
              className={
                selectedWrap.id === wrap.id
                  ? "wrap-type-card active"
                  : "wrap-type-card"
              }
              onClick={() => setSelectedWrap(wrap)}
            >
              <span className={`wrap-swatch swatch-${wrap.id}`} />
              <span className="wrap-type-info">
                <strong>{wrap.name}</strong>
                <span className="wrap-type-desc">{wrap.desc}</span>
                <span className="wrap-type-price">{wrap.price}</span>
              </span>
            </button>
          ))}
        </div>

        <a
          href={`https://wa.me/918309560622?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="wrap-enquiry-btn"
        >
          Enquire About {selectedWrap.name}
        </a>
      </div>
    </section>
  );
}

export default BikeWrapping;
