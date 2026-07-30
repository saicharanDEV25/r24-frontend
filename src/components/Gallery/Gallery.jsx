import { useEffect, useState } from "react";
import "./Gallery.css";
import { FaArrowRight } from "react-icons/fa";
import api from "../../services/api";

function Gallery() {
  const [comparisons, setComparisons] = useState([]);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      const res = await api.get("/gallery");
      setComparisons(res.data);
    } catch (error) {
      console.error("Error loading gallery:", error);
    }
  };

  return (
    <section className="before-after">
      <div className="section-heading">
        <span className="section-tag">Transformations</span>
        <h2>Before & After Detailing</h2>
        <p>
          See the real transformation after premium detailing and bike care.
        </p>
      </div>

      <div className="comparison-grid">
        {comparisons.map((item) => (
          <div className="comparison-card" key={item.id}>
            <div className="card-header">
              <h3>{item.title}</h3>
            </div>

            <div className="images-wrapper">
              {/* BEFORE */}
              <div className="image-box before">

                {item.beforeImageUrl ? (
                  <img
                    src={`http://localhost:8080/uploads/${item.beforeImageUrl}`}
                    alt={`${item.title} - Before`}
                  />
                ) : (
                  <div className="placeholder">Before Image</div>
                )}
              </div>

              {/* ARROW */}
              <div className="arrow">
                <FaArrowRight />
              </div>

              {/* AFTER */}
              <div className="image-box after">
               

                {item.afterImageUrl ? (
                  <img
                    src={`http://localhost:8080/uploads/${item.afterImageUrl}`}
                    alt={`${item.title} - After`}
                  />
                ) : (
                  <div className="placeholder">After Image</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;