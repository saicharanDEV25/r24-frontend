import { useState } from "react";
import "./TyresWheels.css";
import { REAL_BIKE_BRANDS } from "../../constants/bikes";

const brandNames = REAL_BIKE_BRANDS.map((b) => b.brand);

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
  const [brand, setBrand] = useState(null);
  const [bike, setBike] = useState(null);
  const [condition, setCondition] = useState(null);
  const [tyreType, setTyreType] = useState(null);
  const [position, setPosition] = useState(null);
  const [installation, setInstallation] = useState(null);

  const brandModels = brand
    ? REAL_BIKE_BRANDS.find((b) => b.brand === brand)?.models || []
    : [];
  const bikeStepSlots = 2;

  const isComplete =
    bike && condition && tyreType && position && installation;

  const whatsappMessage = encodeURIComponent(
    `Hello R24 Automotive 👋 I need tyres for my ${brand} ${bike}.\n\nCondition: ${condition?.label}\nTyre Type: ${tyreType?.label}\nPosition: ${position?.label}\nInstallation: ${installation?.label}\n\nPlease share pricing and availability.`
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
          title="Select Your Brand"
          options={brandNames}
          selected={brand}
          onSelect={(b) => {
            setBrand(b);
            setBike(null);
          }}
        />

        {brand && (
          <OptionGroup
            step="2"
            title="Select Your Model"
            options={brandModels}
            selected={bike}
            onSelect={setBike}
          />
        )}

        <OptionGroup
          step={String(bikeStepSlots + 1)}
          title="Tyre Condition"
          options={conditions}
          selected={condition}
          onSelect={setCondition}
        />

        <OptionGroup
          step={String(bikeStepSlots + 2)}
          title="Type of Tyre"
          options={tyreTypes}
          selected={tyreType}
          onSelect={setTyreType}
        />

        <OptionGroup
          step={String(bikeStepSlots + 3)}
          title="Tyre Position"
          options={positions}
          selected={position}
          onSelect={setPosition}
        />

        <OptionGroup
          step={String(bikeStepSlots + 4)}
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
                  <strong>
                    {brand} {bike}
                  </strong>
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
              Complete all the selections above to get an instant quote.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default TyresWheels;
