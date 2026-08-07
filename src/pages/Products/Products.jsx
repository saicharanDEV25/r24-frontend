import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "./Product.css";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import LoginModal from "../../components/Auth/LoginModal";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";

const CATEGORY_GROUPS = {
  "KTM Accessories": [
    "Air Filters",
    "Oil Filters",
    "Spark Plugs",
    "Chain & Sprockets",
    "Brake Pads",
    "Brake Discs & Rotors",
    "Clutch Plates",
    "Fuel Pumps",
    "Batteries",
    "Handlebar Grips & Levers",
    "Mirrors",
    "Foot Pegs & Rearsets",
    "Suspension & Fork Parts",
    "Radiator & Cooling",
    "Cables & Wiring",
    "Lighting & Bulbs",
    "Seat & Comfort",
    "Crash Guards & Frame Sliders",
    "Number Plate & Tail Tidy",
  ],
};

function getGroupLabel(categoryName) {
  for (const [group, members] of Object.entries(CATEGORY_GROUPS)) {
    if (members.includes(categoryName)) return group;
  }
  return categoryName;
}

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sortBy, setSortBy] = useState("default");

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
      setProducts(response.data.filter((item) => item.active !== false));
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

  const categoryFilterOptions = ["All"];
  categories.forEach((cat) => {
    const label = getGroupLabel(cat.name);
    if (!categoryFilterOptions.includes(label)) {
      categoryFilterOptions.push(label);
    }
  });

  const filteredProducts = products
    .filter((item) => {

      const matchesCategory =
        category === "All" ||
        getGroupLabel(item.category?.name) === category;

      const matchesSearch =
        (item.name || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAvailability =
        availability === "All" ||
        (availability === "In Stock" ? item.stock > 0 : item.stock <= 0);

      return matchesCategory && matchesSearch && matchesAvailability;

    })
    .sort((a, b) => {
      if (sortBy === "priceLowHigh") return a.price - b.price;
      if (sortBy === "priceHighLow") return b.price - a.price;
      if (sortBy === "nameAZ") return (a.name || "").localeCompare(b.name || "");
      return 0;
    });

  return (

    <>
      <Navbar />
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

          {categoryFilterOptions.map((label) => (

            <button
              key={label}
              className={category === label ? "active" : ""}
              onClick={() => setCategory(label)}
            >
              {label}
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

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="priceLowHigh">Price: Low to High</option>
            <option value="priceHighLow">Price: High to Low</option>
            <option value="nameAZ">Name: A-Z</option>
          </select>

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

      <Footer />

    </>

  );

}

export default Products;