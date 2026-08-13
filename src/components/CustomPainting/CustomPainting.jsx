import { useState } from "react";
import "../../pages/Products/Product.css";
import "./CustomPainting.css";
import { REAL_BIKE_BRANDS } from "../../constants/bikes";

const presetColors = [
  { name: "KTM Orange", hex: "#FF6600" },
  { name: "Racing Red", hex: "#C8102E" },
  { name: "Matte Black", hex: "#1A1A1A" },
  { name: "Pearl White", hex: "#F2F2F2" },
  { name: "Electric Blue", hex: "#0057B8" },
  { name: "Titanium Grey", hex: "#6E6E6E" },
  { name: "Neon Yellow", hex: "#D4FF00" },
  { name: "Metallic Green", hex: "#1B5E20" },
  { name: "Purple Haze", hex: "#6A1B9A" },
  { name: "Hot Pink", hex: "#E6007E" },
  { name: "Chrome Silver", hex: "#B8BCC0" },
  { name: "Deep Teal", hex: "#00695C" },
];

function CustomPainting() {
  // default to a real bike (same rule as Products) so the color picker always has something to enquire about
  const [selectedBrand, setSelectedBrand] = useState(REAL_BIKE_BRANDS[0].brand);
  const [selectedBike, setSelectedBike] = useState(REAL_BIKE_BRANDS[0].models[0]);
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);

  const brandModels =
    REAL_BIKE_BRANDS.find((b) => b.brand === selectedBrand)?.models || [];

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    const models = REAL_BIKE_BRANDS.find((b) => b.brand === brand)?.models || [];
    setSelectedBike(models[0]);
  };

  const handleCustomColor = (hex) => {
    setSelectedColor({ name: "Custom Colour", hex });
  };

  const whatsappMessage = encodeURIComponent(
    `Hello R24 Automotive 👋 I'm interested in Custom Painting for my ${selectedBrand} ${selectedBike} in "${selectedColor.name}" (${selectedColor.hex}). Please share pricing and timelines.`
  );

  return (
    <section className="custom-painting" id="custom-painting">
      <div className="section-heading">
        <span className="section-tag">Custom Painting</span>
        <h2>Design Your Bike</h2>
        <p>
          Pick your bike model and colour, then enquire — our painters take
          it from there.
        </p>
      </div>

      <div className="category-buttons">
        {REAL_BIKE_BRANDS.map((b) => (
          <button
            key={b.brand}
            className={selectedBrand === b.brand ? "active" : ""}
            onClick={() => selectBrand(b.brand)}
          >
            {b.brand}
          </button>
        ))}
      </div>

      {brandModels.length > 0 && (
        <div className="category-buttons">
          {brandModels.map((m) => (
            <button
              key={m}
              className={selectedBike === m ? "active" : ""}
              onClick={() => setSelectedBike(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      <div className="color-picker">
        <h4>Popular Colours</h4>

        <div className="color-swatch-grid">
          {presetColors.map((color) => (
            <button
              key={color.name}
              className={
                selectedColor.name === color.name
                  ? "color-swatch active"
                  : "color-swatch"
              }
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color)}
              aria-label={color.name}
              title={color.name}
            />
          ))}
        </div>

        <h4 className="custom-color-heading">Or Pick Any Colour</h4>

        <label className="custom-color-picker">
          <input
            type="color"
            value={selectedColor.hex}
            onChange={(e) => handleCustomColor(e.target.value)}
          />
          <span>Open Colour Picker</span>
        </label>

        <p className="selected-color-label">
          {selectedBrand} {selectedBike} — Selected:{" "}
          <strong>{selectedColor.name}</strong>{" "}
          <span className="selected-color-hex">({selectedColor.hex})</span>
        </p>

        <a
          href={`https://wa.me/918309560622?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="paint-enquiry-btn"
        >
          Enquire About This Colour
        </a>
      </div>
    </section>
  );
}


export default CustomPainting;
