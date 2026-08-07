import { useState } from "react";
import "./BikeService.css";
import {
  FaTools,
  FaCogs,
  FaCompactDisc,
  FaLink,
  FaOilCan,
  FaClipboardCheck,
} from "react-icons/fa";
import BookingModal from "../Booking/BookingModal";

const services = [
  {
    icon: <FaTools />,
    title: "Regular Maintenance",
    desc: "Complete multi-point inspection, tightening & lubrication to keep your KTM running like new.",
  },
  {
    icon: <FaCogs />,
    title: "Engine Repair",
    desc: "Expert diagnosis and repair for engine performance issues, noises and power loss.",
  },
  {
    icon: <FaCompactDisc />,
    title: "Brake Service",
    desc: "Brake pad inspection, replacement and fluid top-up for safe, confident stopping power.",
  },
  {
    icon: <FaLink />,
    title: "Chain Service",
    desc: "Chain cleaning, lubrication and adjustment for smooth, silent power delivery.",
  },
  {
    icon: <FaOilCan />,
    title: "Oil Change",
    desc: "Genuine engine oil replacement with oil filter check for optimal engine health.",
  },
  {
    icon: <FaClipboardCheck />,
    title: "General Checkup",
    desc: "Full bike health checkup covering engine, brakes, tyres and electricals.",
  },
];

function BikeService() {
  const [bookingService, setBookingService] = useState(null);

  return (
    <section className="bike-service" id="bike-service">
      <div className="section-heading">
        <span className="section-tag">Book a Service</span>
        <h2>Bike Service</h2>
        <p>
          Transparent pricing, genuine parts and certified technicians for
          every KTM service need.
        </p>
      </div>

      <div className="bike-service-grid">
        {services.map((service, index) => (
          <div className="bike-service-card" key={index}>
            <div className="bike-service-icon">{service.icon}</div>

            <h3>{service.title}</h3>
            <p>{service.desc}</p>

            <div className="bike-service-footer">
              <button
                className="bike-service-btn"
                onClick={() => setBookingService(service)}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookingService && (
        <BookingModal
          serviceType={bookingService.title}
          onClose={() => setBookingService(null)}
        />
      )}
    </section>
  );
}

export default BikeService;
