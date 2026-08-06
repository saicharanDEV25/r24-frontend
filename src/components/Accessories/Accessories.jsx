import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "../../pages/Products/Product.css";
import "./Accessories.css";
import OptimizedImage from "../common/OptimizedImage/OptimizedImage";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import LoginModal from "../Auth/LoginModal";

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

function Accessories() {
  const [selectedBike, setSelectedBike] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  const { customer, isFavorite, toggleFavorite } = useCustomerAuth();

  const handleFavoriteClick = (e, item) => {
    e.stopPropagation();
    if (!customer) {
      setShowLogin(true);
      return;
    }
    toggleFavorite(item);
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!selectedBike) return;
    loadProducts();
    loadCategories();
  }, [selectedBike]);

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      category === "All" || item.category?.name === category;

    const matchesSearch = (item.name || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const enquiryMessage = (product) =>
    encodeURIComponent(
      `Hi R24 Automotive 👋 I'm interested in ${product.name} for my KTM ${selectedBike}. Please share more details.`
    );

  return (
    <section className="accessories-page" id="accessories">
      <div className="section-heading">
        <span className="section-tag">Accessories</span>
        <h2>Genuine KTM Spare Parts & Accessories</h2>
        <p>
          Select your bike to browse only genuine KTM parts and accessories
          available for it.
        </p>
      </div>

      <div className="bike-select-grid">
        {bikes.map((bike) => (
          <button
            key={bike}
            className={
              selectedBike === bike
                ? "bike-select-card active"
                : "bike-select-card"
            }
            onClick={() => setSelectedBike(bike)}
          >
            {bike}
          </button>
        ))}
      </div>

      {selectedBike && (
        <div className="accessories-catalog">
          <p className="catalog-note">
            Showing genuine KTM parts & accessories for your{" "}
            <strong>KTM {selectedBike}</strong>.
          </p>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search Accessories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-buttons">
            <button
              className={category === "All" ? "active" : ""}
              onClick={() => setCategory("All")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={category === cat.name ? "active" : ""}
                onClick={() => setCategory(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map((item) => (
              <div
                className="product-card"
                key={item.id}
                onClick={() => setSelectedProduct(item)}
              >
                <div className="product-image-wrap">
                  <OptimizedImage
                    src={item.imageUrl}
                    width={400}
                    alt={item.name}
                    fallbackSrc="https://placehold.co/400x400?text=No+Image"
                  />

                  <span
                    className={
                      item.stock > 0
                        ? "stock-badge in-stock"
                        : "stock-badge out-of-stock"
                    }
                  >
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                  <button
                    className="favorite-btn"
                    onClick={(e) => handleFavoriteClick(e, item)}
                    aria-label="Save to favorites"
                  >
                    {isFavorite(item.id) ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <div className="product-content">
                  <span>{item.category?.name}</span>
                  <h3>{item.name}</h3>
                  <h4>₹ {item.price}</h4>

                  <button
                    className="details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(item);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <p className="no-products-msg">
                No accessories found for this search.
              </p>
            )}
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="popup-overlay"
          onClick={() => setSelectedProduct(null)}
        >
          <div className="product-popup" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-popup"
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <div className="product-image-wrap">
              <OptimizedImage
                src={selectedProduct.imageUrl}
                width={700}
                alt={selectedProduct.name}
                eager
                fallbackSrc="https://placehold.co/500x500?text=No+Image"
              />

              <button
                className="favorite-btn"
                onClick={(e) => handleFavoriteClick(e, selectedProduct)}
                aria-label="Save to favorites"
              >
                {isFavorite(selectedProduct.id) ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            <div className="popup-content">
              <span className="popup-category">
                {selectedProduct.category?.name}
              </span>

              <span
                className={
                  selectedProduct.stock > 0
                    ? "stock-badge in-stock popup-stock-badge"
                    : "stock-badge out-of-stock popup-stock-badge"
                }
              >
                {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>

              <h2>{selectedProduct.name}</h2>
              <h3>₹ {selectedProduct.price}</h3>
              <p>{selectedProduct.description}</p>

              <ul className="popup-features">
                <li>✔ Premium Quality Product</li>
                <li>✔ Genuine KTM Compatible</li>
                <li>✔ Professional Installation Available</li>
                <li>✔ Warranty Support Available</li>
              </ul>

              <a
                href={`https://wa.me/918309560622?text=${enquiryMessage(
                  selectedProduct
                )}`}
                target="_blank"
                rel="noreferrer"
                className="popup-btn"
              >
                Enquire on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </section>
  );
}

export default Accessories;
