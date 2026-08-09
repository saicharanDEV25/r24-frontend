import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "./Product.css";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import ProductPopup from "../../components/common/ProductPopup/ProductPopup";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import { BIKE_BRANDS } from "../../constants/bikes";

const BRAND_FILTER_OPTIONS = ["All", "KTM", "Royal Enfield", "Yamaha", "Benelli", "Kawasaki"];

// The DB keeps precise categories (useful for admin's own inventory
// accuracy) — this just groups them into a handful of broad buckets for
// browsing, so customers see ~6 options instead of 20+. A category not
// listed anywhere below falls back to showing under its own name.
const CATEGORY_GROUPS = {
  "Engine & Performance": [
    "Engine Internals", "Chain & Sprockets", "Oil Filters", "Air Filters",
    "Fuel Pumps", "Spark Plugs", "Clutch Plates", "Exhaust Systems",
    "Radiator & Cooling", "Batteries",
  ],
  "Brakes & Suspension": [
    "Brake Pads", "Brake Discs & Rotors", "Suspension & Fork Parts",
  ],
  "Body & Fairings": [
    "Body Panels & Fairings", "Windscreen & Structure",
    "Number Plate & Tail Tidy", "Seat & Comfort",
    "Crash Guards & Frame Sliders",
  ],
  "Electricals & Instruments": [
    "Lighting & Bulbs", "Electricals & Ignition",
    "Instrument Cluster & Meter", "Cables & Wiring",
  ],
  "Cockpit & Controls": [
    "Handlebar Grips & Levers", "Mirrors", "Foot Pegs & Rearsets",
    "Locks & Keys",
  ],
  "Riding Gear": ["Helmets", "Riding Gear"],
};

function getCategoryGroup(categoryName) {
  for (const [group, members] of Object.entries(CATEGORY_GROUPS)) {
    if (members.includes(categoryName)) return group;
  }
  return categoryName;
}

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [brand, setBrand] = useState("All");
  const [model, setModel] = useState("All");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const { isFavorite, toggleFavorite } = useCustomerAuth();

  const handleFavoriteClick = (e, item) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.filter((item) => item.active !== false));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const brandCounts = { All: products.length };
  products.forEach((item) => {
    const b = item.brand || "KTM";
    brandCounts[b] = (brandCounts[b] || 0) + 1;
  });

  const productsForBrand = products.filter(
    (item) => brand === "All" || (item.brand || "KTM") === brand
  );

  const brandModels =
    brand === "All"
      ? []
      : BIKE_BRANDS.find((b) => b.brand === brand)?.models || [];
  // Even single-model brands (Royal Enfield, Kawasaki) show their one
  // model as a button — otherwise the row disappears and the category
  // row's "All" button ends up looking like the first thing under the
  // brand row, with no indication of which bike it's for.
  const showModelRow = brandModels.length > 0;

  // A product with no model set isn't "unknown" — it fits every model of
  // that brand (most of the current KTM catalog is generic like this), so
  // it should still show up no matter which specific model is selected.
  const productsForModel = productsForBrand.filter(
    (item) => model === "All" || !item.model || item.model === model
  );

  const categoryFilterOptions = ["All"];
  productsForModel.forEach((item) => {
    const label = getCategoryGroup(item.category?.name);
    if (label && !categoryFilterOptions.includes(label)) {
      categoryFilterOptions.push(label);
    }
  });

  const categoryCounts = { All: productsForModel.length };
  productsForModel.forEach((item) => {
    const label = getCategoryGroup(item.category?.name);
    if (label) categoryCounts[label] = (categoryCounts[label] || 0) + 1;
  });

  const filteredProducts = productsForModel.filter((item) => {

    const matchesCategory =
      category === "All" || getCategoryGroup(item.category?.name) === category;

    const matchesSearch =
      (item.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesAvailability =
      availability === "All" ||
      (availability === "In Stock" ? item.stock > 0 : item.stock <= 0);

    return matchesCategory && matchesSearch && matchesAvailability;

  });

  // Live dropdown searches the whole catalog (not just the currently
  // selected brand/category), same as the reference site — picking a
  // result opens it directly instead of making the user hunt for it in
  // the grid below.
  const searchTerm = search.trim().toLowerCase();
  const searchMatches = searchTerm
    ? products
        .filter((item) => (item.name || "").toLowerCase().includes(searchTerm))
        .slice(0, 8)
    : [];
  const showSearchDropdown = searchFocused && searchTerm.length > 0;

  const openSearchResult = (item) => {
    setSelectedProduct(item);
    setSearch("");
    setSearchFocused(false);
  };

  const selectBrand = (label) => {
    setBrand(label);
    setCategory("All");
    const models = label === "All"
      ? []
      : BIKE_BRANDS.find((b) => b.brand === label)?.models || [];
    // Always land on one concrete model (never a blended "every model of
    // this brand" view) — single-model brands have only one choice anyway,
    // multi-model brands default to the first one and the model row lets
    // the customer switch between the rest.
    setModel(models.length > 0 ? models[0] : "All");
  };

  // Same "no model = fits every model" rule as productsForModel above, so
  // the count shown on each model button matches what clicking it reveals.
  const modelCounts = { All: productsForBrand.length };
  brandModels.forEach((m) => {
    modelCounts[m] = productsForBrand.filter(
      (item) => !item.model || item.model === m
    ).length;
  });

  return (

    <>
      <Navbar />
          <section className="products-page">

        <div className="products-header">

          <h1>Bike Accessories & Spare Parts</h1>

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
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />

            {showSearchDropdown && (
              <div className="search-dropdown">
                {searchMatches.length === 0 ? (
                  <div className="search-dropdown-empty">
                    No products match "{search.trim()}"
                  </div>
                ) : (
                  searchMatches.map((item) => (
                    <button
                      key={item.id}
                      className="search-dropdown-item"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        openSearchResult(item);
                      }}
                    >
                      <OptimizedImage
                        src={item.imageUrl}
                        width={80}
                        alt={item.name}
                        wrapperClassName="search-dropdown-thumb"
                        fallbackSrc="https://placehold.co/80x80?text=No+Image"
                      />
                      <span className="search-dropdown-info">
                        <strong>{item.name}</strong>
                        <span>
                          {item.brand || "KTM"}{item.model ? ` ${item.model}` : ""} · {item.category?.name}
                        </span>
                      </span>
                      <span
                        className={
                          item.stock > 0
                            ? "search-dropdown-stock in-stock"
                            : "search-dropdown-stock out-of-stock"
                        }
                      >
                        {item.stock > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

        <div className="category-buttons">

          {BRAND_FILTER_OPTIONS.map((label) => (

            <button
              key={label}
              className={brand === label ? "active" : ""}
              onClick={() => selectBrand(label)}
            >
              {label}
              <span className="category-count">{brandCounts[label] || 0}</span>
            </button>

          ))}

        </div>

        {showModelRow && (
          <div className="category-buttons">

            {brandModels.map((label) => (

              <button
                key={label}
                className={model === label ? "active" : ""}
                onClick={() => {
                  setModel(label);
                  setCategory("All");
                }}
              >
                {label}
                <span className="category-count">{modelCounts[label] || 0}</span>
              </button>

            ))}

          </div>
        )}

        <div className="filter-toolbar">

          <div className="category-buttons">

            {categoryFilterOptions.map((label) => (

              <button
                key={label}
                className={category === label ? "active" : ""}
                onClick={() => setCategory(label)}
              >
                {label}
                <span className="category-count">{categoryCounts[label] || 0}</span>
              </button>

            ))}

          </div>

          <div className="availability-buttons">
            {["In Stock", "Out of Stock"].map((label) => (
              <button
                key={label}
                className={availability === label ? "active" : ""}
                // Clicking the already-active one turns the filter back
                // off (shows everything) instead of needing a separate
                // "All" button.
                onClick={() =>
                  setAvailability(availability === label ? "All" : label)
                }
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

                <span>
                  {item.brand || "KTM"}{item.model ? ` ${item.model}` : ""} · {item.category?.name}
                </span>

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

        </div>

      </section>

      <ProductPopup
        product={selectedProduct}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onClose={() => setSelectedProduct(null)}
      />

      <Footer />

    </>

  );

}

export default Products;
