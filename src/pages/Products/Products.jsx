import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "./Product.css";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import LoginModal from "../../components/Auth/LoginModal";

function Products() {

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

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredProducts = products.filter((item) => {

    const matchesCategory =
      category === "All" ||
      item.category?.name === category;

    const matchesSearch =
      (item.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;

  });

  return (

    <>
          <section className="products-page">

        <div className="products-header">

          <h1>KTM Accessories & Spare Parts</h1>

          <p>
            Explore premium accessories, performance upgrades and genuine
            spare parts available at R24 Automotive.
          </p>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

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

        </div>

      </section>
            {selectedProduct && (

        <div
          className="popup-overlay"
          onClick={() => setSelectedProduct(null)}
        >

          <div
            className="product-popup"
            onClick={(e) => e.stopPropagation()}
          >

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
                href={`https://wa.me/918309560622?text=Hi R24 Automotive 👋 I'm interested in ${selectedProduct.name}. Please share more details.`}
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

    </>

  );

}

export default Products;