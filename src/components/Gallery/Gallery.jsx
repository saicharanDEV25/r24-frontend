import { useEffect, useState } from "react";
import "./Gallery.css";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import OptimizedImage from "../common/OptimizedImage/OptimizedImage";

const DEFAULT_DESCRIPTION =
  "This KTM underwent professional detailing at R24 Automotive — deep cleaning, surface correction and a premium protective finish for a showroom-fresh look.";

const truncate = (text, max) =>
  text.length > max ? `${text.slice(0, max).trim()}…` : text;

function Gallery() {
  const [comparisons, setComparisons] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await api.get("/gallery");
      setComparisons(res.data.filter((item) => item.active !== false));
    } catch (error) {
      console.error("Error loading gallery:", error);
    }
  };

  const enquiryMessage = (item) =>
    encodeURIComponent(
      `Hello R24 Automotive 👋 I saw the "${item.title}" transformation on your website and I'm interested in something similar for my bike.`
    );

  return (
    <section className="before-after" id="gallery">
      <div className="section-heading">
        <span className="section-tag">Transformations</span>
        <h2>Before & After Detailing</h2>
        <p>
          See the real transformation after premium detailing and bike care.
        </p>
      </div>

      {comparisons.length > 0 && (
        <div className="before-after-marquee">
          <div className="before-after-track">
            {[...comparisons, ...comparisons].map((item, index) => (
              <div
                className="comparison-card"
                key={`${item.id}-${index}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="card-header">
                  <h3>{item.title}</h3>
                </div>

                <div className="images-wrapper">
                  <div className="image-box before">
                    {item.beforeImageUrl ? (
                      <OptimizedImage
                        src={item.beforeImageUrl}
                        width={400}
                        alt={`${item.title} - Before`}
                      />
                    ) : (
                      <div className="placeholder">Before Image</div>
                    )}
                  </div>

                  <div className="arrow">
                    <FaArrowRight />
                  </div>

                  <div className="image-box after">
                    {item.afterImageUrl ? (
                      <OptimizedImage
                        src={item.afterImageUrl}
                        width={400}
                        alt={`${item.title} - After`}
                      />
                    ) : (
                      <div className="placeholder">After Image</div>
                    )}
                  </div>
                </div>

                <p className="card-caption">
                  {truncate(item.description || DEFAULT_DESCRIPTION, 70)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedItem && (
        <div
          className="gallery-popup-overlay"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="gallery-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="gallery-popup-close"
              onClick={() => setSelectedItem(null)}
            >
              <FaTimes />
            </button>

            <div className="gallery-popup-images">
              <div className="gallery-popup-image-box">
                {selectedItem.beforeImageUrl ? (
                  <OptimizedImage
                    src={selectedItem.beforeImageUrl}
                    width={700}
                    alt={`${selectedItem.title} - Before`}
                    eager
                  />
                ) : (
                  <div className="placeholder">Before Image</div>
                )}
                <span className="gallery-popup-label before">Before</span>
              </div>

              <div className="gallery-popup-image-box">
                {selectedItem.afterImageUrl ? (
                  <OptimizedImage
                    src={selectedItem.afterImageUrl}
                    width={700}
                    alt={`${selectedItem.title} - After`}
                    eager
                  />
                ) : (
                  <div className="placeholder">After Image</div>
                )}
                <span className="gallery-popup-label after">After</span>
              </div>
            </div>

            <div className="gallery-popup-content">
              <h2>{selectedItem.title}</h2>

              <p>{selectedItem.description || DEFAULT_DESCRIPTION}</p>

              <a
                href={`https://wa.me/918309560622?text=${enquiryMessage(
                  selectedItem
                )}`}
                target="_blank"
                rel="noreferrer"
                className="gallery-popup-btn"
              >
                Enquire About This Look
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Gallery;