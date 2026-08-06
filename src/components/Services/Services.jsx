import "./Services.css";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaPaintBrush,
  FaMotorcycle,
  FaSoap,
  FaCog,
} from "react-icons/fa";
import { GiCarWheel } from "react-icons/gi";

const servicePages = {
  "Bike Service": "/bike-service",
  "Custom Painting": "/custom-painting",
  "Bike Wrapping": "/bike-wrapping",
  "Bike Detailing": "/bike-detailing",
  "Tyres & Wheels": "/tyres-wheels",
  Accessories: "/accessories",
};

const servicePageLinkLabels = {
  "Bike Service": "View Services & Pricing →",
  "Custom Painting": "Design Your Bike →",
  "Bike Wrapping": "Explore Wrapping Types →",
  "Bike Detailing": "View Detailing Options →",
  "Tyres & Wheels": "Find Your Tyre →",
  Accessories: "Browse Accessories →",
};

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
  const navigate = useNavigate();

  return (
    <section className="services" id="services">

      <h2>Our Premium Services</h2>

      <div className="service-grid">

        {services.map((service, index) => {
          const targetPage = servicePages[service.title];
          const goToPage = targetPage
            ? () => navigate(targetPage)
            : undefined;

          return (
            <div
              className="service-card"
              key={index}
              onClick={goToPage}
              role={targetPage ? "button" : undefined}
              tabIndex={targetPage ? 0 : undefined}
              onKeyDown={
                targetPage
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        goToPage();
                      }
                    }
                  : undefined
              }
            >

              <div className="service-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.desc}</p>

              {targetPage && (
                <span className="service-card-link">
                  {servicePageLinkLabels[service.title]}
                </span>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Services;