import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "../../pages/Products/Product.css";
import "./Accessories.css";
import OptimizedImage from "../common/OptimizedImage/OptimizedImage";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { BIKE_BRANDS, KTM_FAMILIES } from "../../constants/bikes";

function Accessories() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isFavorite, toggleFavorite } = useCustomerAuth();

  const isKtm = selectedBrand === "KTM";
  const brandModels = selectedBrand
    ? BIKE_BRANDS.find((b) => b.brand === selectedBrand)?.models || []
    : [];

  const resetBikeSelection = () => {
    setSelectedBrand(null);
    setSelectedFamily(null);
    setSelectedBike(null);
  };

  const handleFavoriteClick = (e, item) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.filter((item) => item.active !== false));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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

    const matchesAvailability =
      availability === "All" ||
      (availability === "In Stock" ? item.stock > 0 : item.stock <= 0);

    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const enquiryMessage = (product) =>
    encodeURIComponent(
      `Hi R24 Automotive 👋 I'm interested in ${product.name} for my ${selectedBrand} ${selectedBike}. Please share more details.`
    );

  return (
    <section className="accessories-page" id="accessories">
      <div className="section-heading">
        <span className="section-tag">Accessories</span>
        <h2>Genuine Spare Parts & Accessories</h2>
        <p>
          Select your bike to browse genuine parts and accessories available
          for it.
        </p>
      </div>

      {!selectedBrand ? (
        <div className="bike-select-grid">
          {BIKE_BRANDS.map((b) => (
            <button
              key={b.brand}
              className="bike-select-card"
              onClick={() => setSelectedBrand(b.brand)}
            >
              {b.brand}
            </button>
          ))}
        </div>
      ) : isKtm && !selectedFamily ? (
        <div className="bike-select-grid">
          <button
            className="bike-select-back"
            onClick={() => setSelectedBrand(null)}
          >
            ← Back to brands
          </button>
          {KTM_FAMILIES.map((f) => (
            <button
              key={f.family}
              className="bike-select-card"
              onClick={() => setSelectedFamily(f)}
            >
              {f.family}
            </button>
          ))}
        </div>
      ) : isKtm && !selectedBike ? (
        <div className="bike-select-grid">
          <button
            className="bike-select-back"
            onClick={() => setSelectedFamily(null)}
          >
            ← Back to models
          </button>
          {selectedFamily.variants.map((v) => (
            <button
              key={v.model}
              className="bike-select-card"
              onClick={() => setSelectedBike(v.model)}
            >
              {v.cc} cc
            </button>
          ))}
        </div>
      ) : !isKtm && !selectedBike ? (
        <div className="bike-select-grid">
          <button
            className="bike-select-back"
            onClick={() => setSelectedBrand(null)}
          >
            ← Back to brands
          </button>
          {brandModels.map((m) => (
            <button
              key={m}
              className="bike-select-card"
              onClick={() => setSelectedBike(m)}
            >
              {m}
            </button>
          ))}
        </div>
      ) : (
        <div className="accessories-catalog">
          <p className="catalog-note">
            Showing genuine parts & accessories for your{" "}
            <strong>
              {selectedBrand} {selectedBike}
            </strong>
            .{" "}
            <button className="bike-select-back" onClick={resetBikeSelection}>
              Change Bike
            </button>
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

          <div className="filter-toolbar">
            <div className="availability-buttons">
              {["All", "In Stock", "Out of Stock"].map((label) => (
                <button
                  key={label}
                  className={availability === label ? "active" : ""}
                  onClick={() => setAvailability(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="products-grid">
            {loading && products.length === 0
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div className="product-card skeleton-card" key={i}>
                    <div className="skeleton-image" />
                    <div className="product-content">
                      <span className="skeleton-line skeleton-line-sm" />
                      <span className="skeleton-line skeleton-line-lg" />
                      <span className="skeleton-line skeleton-line-btn" />
                    </div>
                  </div>
                ))
              : filteredProducts.map((item) => (
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

            {!loading && filteredProducts.length === 0 && (
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

    </section>
  );
}

export default Accessories;
