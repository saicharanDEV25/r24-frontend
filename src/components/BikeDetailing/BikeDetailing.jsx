import "./BikeDetailing.css";
import {
  FaGem,
  FaMagic,
  FaCogs,
  FaSun,
  FaTint,
  FaLightbulb,
  FaCrown,
} from "react-icons/fa";

const detailingServices = [
  {
    icon: <FaGem />,
    title: "Ceramic Coating",
    desc: "9H hydrophobic ceramic layer for long-lasting gloss and paint protection.",
    price: "₹4,999 onwards",
  },
  {
    icon: <FaMagic />,
    title: "Paint Correction & Polishing",
    desc: "Removes swirl marks and light scratches to restore a factory-fresh shine.",
    price: "₹1,999 onwards",
  },
  {
    icon: <FaCogs />,
    title: "Engine Detailing",
    desc: "Deep degreasing and detailing of the engine bay, frame and swingarm.",
    price: "₹999 onwards",
  },
  {
    icon: <FaSun />,
    title: "Chrome & Metal Polishing",
    desc: "Restores shine to exhaust, rims, forks and other metal components.",
    price: "₹799 onwards",
  },
  {
    icon: <FaTint />,
    title: "Teflon Coating",
    desc: "Affordable water-repellent coating for everyday shine and protection.",
    price: "₹1,499 onwards",
  },
  {
    icon: <FaLightbulb />,
    title: "Headlight Restoration",
    desc: "Removes yellowing and fogging for clear, bright headlights at night.",
    price: "₹599 onwards",
  },
  {
    icon: <FaCrown />,
    title: "Full Detailing Package",
    desc: "Complete top-to-bottom detailing combining coating, polish and cleaning.",
    price: "₹7,999 onwards",
  },
];

function BikeDetailing() {
  return (
    <section className="bike-detailing" id="bike-detailing">
      <div className="section-heading">
        <span className="section-tag">Bike Detailing</span>
        <h2>Bike Detailing</h2>
        <p>
          Ceramic coating, polishing and premium detailing to keep your KTM
          looking showroom-fresh.
        </p>
      </div>

      <div className="detailing-grid">
        {detailingServices.map((service, index) => {
          const message = encodeURIComponent(
            `Hello R24 Automotive 👋 I want to book "${service.title}" (${service.price}). Please share available slots.`
          );

          return (
            <div className="detailing-card" key={index}>
              <div className="detailing-icon">{service.icon}</div>

              <h3>{service.title}</h3>
              <p>{service.desc}</p>

              <div className="detailing-footer">
                <span className="detailing-price">{service.price}</span>

                <a
                  href={`https://wa.me/918309560622?text=${message}`}
                  target="_blank"
                  rel="noreferrer"
                  className="detailing-btn"
                >
                  Book Now
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default BikeDetailing;
