import { useState } from "react";
import "./TyresWheels.css";

const bikes = [
  "125 Duke",
  "200 Duke",
  "250 Duke",
  "390 Duke",
  "RC 200",
  "RC 390",
  "250 Adventure",
  "390 Adventure",
  "390 Adventure X",
  "390 Enduro R",
  "790 Duke",
  "890 Duke R",
  "1290 Super Duke R",
];

const conditions = [
  { id: "new", label: "Brand New (First Hand)" },
  { id: "second-hand", label: "Second Hand" },
  { id: "track", label: "Track / Racing Tyres" },
];

const tyreTypes = [
  { id: "sport", label: "Sport / Performance" },
  { id: "touring", label: "Touring" },
  { id: "offroad", label: "Off-Road / Dual-Sport" },
  { id: "racing", label: "Racing Slick" },
  { id: "commuter", label: "Commuter" },
];

const positions = [
  { id: "front", label: "Front Tyre" },
  { id: "rear", label: "Rear Tyre" },
  { id: "both", label: "Front & Rear (Both)" },
];

const installationOptions = [
  { id: "with", label: "With Installation" },
  { id: "without", label: "Without Installation" },
];

function OptionGroup({ step, title, options, selected, onSelect }) {
  return (
    <div className="option-group">
      <h4>
        <span className="option-step">{step}</span>
        {title}
      </h4>
      <div className="option-pill-grid">
        {options.map((opt) => (
          <button
            key={opt.id ?? opt}
            className={
              (selected?.id ?? selected) === (opt.id ?? opt)
                ? "option-pill active"
                : "option-pill"
            }
            onClick={() => onSelect(opt)}
          >
            {opt.label ?? opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function TyresWheels() {
  const [bike, setBike] = useState(null);
  const [condition, setCondition] = useState(null);
  const [tyreType, setTyreType] = useState(null);
  const [position, setPosition] = useState(null);
  const [installation, setInstallation] = useState(null);

  const isComplete =
    bike && condition && tyreType && position && installation;

  const whatsappMessage = encodeURIComponent(
    `Hello R24 Automotive 👋 I need tyres for my KTM ${bike}.\n\nCondition: ${condition?.label}\nTyre Type: ${tyreType?.label}\nPosition: ${position?.label}\nInstallation: ${installation?.label}\n\nPlease share pricing and availability.`
  );

  return (
    <section className="tyres-wheels" id="tyres-wheels">
      <div className="section-heading">
        <span className="section-tag">Tyres & Wheels</span>
        <h2>Find the Right Tyre for Your KTM</h2>
        <p>
          Top-quality tyres, alloys and wheel accessories — tell us what you
          need and we'll quote it for you.
        </p>
      </div>

      <div className="tyre-config">
        <OptionGroup
          step="1"
          title="Select Your Bike"
          options={bikes}
          selected={bike}
          onSelect={setBike}
        />

        <OptionGroup
          step="2"
          title="Tyre Condition"
          options={conditions}
          selected={condition}
          onSelect={setCondition}
        />

        <OptionGroup
          step="3"
          title="Type of Tyre"
          options={tyreTypes}
          selected={tyreType}
          onSelect={setTyreType}
        />

        <OptionGroup
          step="4"
          title="Tyre Position"
          options={positions}
          selected={position}
          onSelect={setPosition}
        />

        <OptionGroup
          step="5"
          title="Installation"
          options={installationOptions}
          selected={installation}
          onSelect={setInstallation}
        />

        <div className="tyre-summary">
          {isComplete ? (
            <>
              <h4>Your Selection</h4>
              <ul className="tyre-summary-list">
                <li>
                  <span>Bike</span>
                  <strong>KTM {bike}</strong>
                </li>
                <li>
                  <span>Condition</span>
                  <strong>{condition.label}</strong>
                </li>
                <li>
                  <span>Tyre Type</span>
                  <strong>{tyreType.label}</strong>
                </li>
                <li>
                  <span>Position</span>
                  <strong>{position.label}</strong>
                </li>
                <li>
                  <span>Installation</span>
                  <strong>{installation.label}</strong>
                </li>
              </ul>

              <a
                href={`https://wa.me/918309560622?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="tyre-enquiry-btn"
              >
                Get Pricing on WhatsApp
              </a>
            </>
          ) : (
            <p className="tyre-summary-hint">
              Complete all 5 selections above to get an instant quote.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default TyresWheels;
