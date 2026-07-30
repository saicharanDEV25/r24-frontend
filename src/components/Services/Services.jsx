import "./Services.css";
import {
  FaTools,
  FaPaintBrush,
  FaMotorcycle,
  FaSoap,
  FaCog,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";

const services = [
  {
    icon: <FaTools />,
    title: "Bike Service",
    desc: "Complete servicing, engine checkup and maintenance."
  },
  {
    icon: <FaPaintBrush />,
    title: "Custom Painting",
    desc: "Premium paint jobs with long-lasting finish."
  },
  {
    icon: <FaMotorcycle />,
    title: "Bike Wrapping",
    desc: "Stylish vinyl wrapping for every KTM model."
  },
  {
    icon: <FaSoap />,
    title: "Bike Detailing",
    desc: "Ceramic coating, polishing and premium detailing."
  },
  {
    icon: <GiCarWheel />,
    title: "Tyres & Wheels",
    desc: "Top-quality tyres, alloys and wheel accessories."
  },
  {
    icon: <FaCog />,
    title: "Accessories",
    desc: "Original KTM accessories and spare parts."
  }
];

function Services() {
  return (
    <section className="services">

      <h2>Our Premium Services</h2>

      <div className="service-grid">

        {services.map((service, index) => (

          <div className="service-card" key={index}>

            <div className="service-icon">
              {service.icon}
            </div>

            <h3>{service.title}</h3>

            <p>{service.desc}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Services;