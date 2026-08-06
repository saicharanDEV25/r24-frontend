import { useState } from "react";
import {
  FaGasPump, FaBolt, FaCompactDisc, FaLink, FaTachometerAlt,
  FaSearch, FaTools, FaRupeeSign, FaCalendarCheck, FaArrowLeft,
} from "react-icons/fa";
import BookingModal from "../Booking/BookingModal";
import "./AIBikeAdvisor.css";

const symptoms = [
  {
    icon: <FaTachometerAlt />,
    title: "My bike vibrates",
    reasons: [
      "Loose engine mounting bolts",
      "Wheel or tyre imbalance",
      "Chain needs adjustment & lubrication",
      "Worn engine mounts / bearings",
    ],
    service: "General Checkup",
    cost: "₹249 onwards (diagnosis, parts extra if needed)",
  },
  {
    icon: <FaBolt />,
    title: "Engine making unusual noise",
    reasons: [
      "Low or old engine oil",
      "Valve clearance out of adjustment",
      "Loose drive chain",
      "Internal engine wear",
    ],
    service: "Engine Repair",
    cost: "₹1,499 onwards",
  },
  {
    icon: <FaGasPump />,
    title: "Bike is not starting",
    reasons: [
      "Weak or dead battery",
      "Fuel supply issue",
      "Faulty spark plug",
      "Starter motor issue",
    ],
    service: "General Checkup",
    cost: "₹249 onwards",
  },
  {
    icon: <FaCompactDisc />,
    title: "Brakes feel weak or spongy",
    reasons: [
      "Worn brake pads",
      "Low brake fluid",
      "Air in brake lines",
      "Warped brake disc",
    ],
    service: "Brake Service",
    cost: "₹399",
  },
  {
    icon: <FaSearch />,
    title: "Mileage has dropped",
    reasons: [
      "Dirty air filter",
      "Old engine oil",
      "Chain too tight or too loose",
      "Low tyre pressure",
    ],
    service: "Regular Maintenance",
    cost: "₹499",
  },
  {
    icon: <FaLink />,
    title: "Chain feels loose or noisy",
    reasons: [
      "Chain needs lubrication",
      "Chain slack out of adjustment",
      "Worn sprockets",
    ],
    service: "Chain Service",
    cost: "₹299",
  },
];

function AIBikeAdvisor() {
  const [selected, setSelected] = useState(null);
  const [booking, setBooking] = useState(false);

  return (
    <div className="advisor">
      <div className="advisor-heading">
        <span className="advisor-tag">AI Bike Advisor</span>
        <h3>What's going on with your bike?</h3>
        <p>Pick what you're noticing — we'll tell you why it happens and what it takes to fix.</p>
      </div>

      {!selected ? (
        <div className="advisor-symptom-grid">
          {symptoms.map((s) => (
            <button
              key={s.title}
              className="advisor-symptom-card"
              onClick={() => setSelected(s)}
            >
              <span className="advisor-symptom-icon">{s.icon}</span>
              {s.title}
            </button>
          ))}
        </div>
      ) : (
        <div className="advisor-result">
          <button className="advisor-back" onClick={() => setSelected(null)}>
            <FaArrowLeft /> Choose a different symptom
          </button>

          <h4>{selected.title}</h4>

          <div className="advisor-flow">
            <div className="advisor-step">
              <span className="advisor-step-label">Possible Reasons</span>
              <ul>
                {selected.reasons.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="advisor-step-arrow">↓</div>

            <div className="advisor-step">
              <span className="advisor-step-label">
                <FaTools /> Suggested Service
              </span>
              <p>{selected.service}</p>
            </div>

            <div className="advisor-step-arrow">↓</div>

            <div className="advisor-step">
              <span className="advisor-step-label">
                <FaRupeeSign /> Estimated Cost
              </span>
              <p>{selected.cost}</p>
            </div>

            <div className="advisor-step-arrow">↓</div>

            <button className="advisor-book-btn" onClick={() => setBooking(true)}>
              <FaCalendarCheck /> Book Appointment
            </button>
          </div>
        </div>
      )}

      {booking && (
        <BookingModal
          serviceType={selected.service}
          price={selected.cost}
          onClose={() => setBooking(false)}
        />
      )}
    </div>
  );
}

export default AIBikeAdvisor;
