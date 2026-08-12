import { FaHeart, FaRegHeart } from "react-icons/fa";
import OptimizedImage from "../OptimizedImage/OptimizedImage";
import "../../../pages/Products/Product.css";

function ProductPopup({ product, isFavorite, onToggleFavorite, onClose }) {
  if (!product) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="product-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>
          ✕
        </button>

        <div className="product-image-wrap">
          <OptimizedImage
            src={product.imageUrl}
            width={700}
            alt={product.name}
            eager
            fallbackSrc="https://placehold.co/500x500?text=No+Image"
          />

          <button
            className="favorite-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            aria-label="Save to favorites"
          >
            {isFavorite(product.id) ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>

        <div className="popup-content">
          <span className="popup-category">{product.category?.name}</span>

          <h2>{product.name}</h2>

          <p>{product.description}</p>

          <ul className="popup-features">
            <li>✔ Premium Quality Product</li>
            <li>✔ Genuine {product.brand ? `${product.brand} Compatible` : "Compatible Part"}</li>
            <li>✔ Professional Installation Available</li>
            <li>✔ Warranty Support Available</li>
          </ul>

          <a
            href={`https://wa.me/918309560622?text=Hi R24 Automotive 👋 I'm interested in ${product.name}. Please share more details.`}
            target="_blank"
            rel="noreferrer"
            className="popup-btn"
          >
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductPopup;
