import "./WhyChoose.css";
import {
  FaAward,
  FaTools,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";
import ScrollReveal from "../common/ScrollReveal/ScrollReveal";

const features = [
  {
    icon: <FaAward />,
    title: "Certified Experts",
    desc: "Experienced professionals delivering premium bike care."
  },
  {
    icon: <FaTools />,
    title: "Genuine KTM Parts",
    desc: "Only quality accessories and genuine spare parts."
  },
  {
    icon: <FaClock />,
    title: "Quick Service",
    desc: "Fast turnaround without compromising quality."
  },
  {
    icon: <FaShieldAlt />,
    title: "Trusted by Riders",
    desc: "Hundreds of satisfied customers trust R24 Automotive."
  }
];

function WhyChoose() {
  return (
    <section className="why">

      <ScrollReveal>
        <div className="why-heading">
          <h2>Why Choose R24 Automotive?</h2>
          <p>
            Premium motorcycle service, detailing, modifications,
            accessories and customer satisfaction under one roof.
          </p>
        </div>
      </ScrollReveal>

      <div className="why-grid">

        {features.map((item, index) => (
          <ScrollReveal key={index} delay={index * 0.08}>
            <div className="why-card">

              <div className="why-icon">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.desc}</p>

            </div>
          </ScrollReveal>
        ))}

      </div>

    </section>
  );
}

export default WhyChoose;