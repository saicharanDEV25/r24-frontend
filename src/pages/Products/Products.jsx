import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "./Product.css";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import ProductPopup from "../../components/common/ProductPopup/ProductPopup";
import Seo from "../../components/common/Seo/Seo";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import { BIKE_BRANDS, BRAND_FILTER_OPTIONS } from "../../constants/bikes";

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [brand, setBrand] = useState("All");
  const [model, setModel] = useState("All");

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
  // show the model row even for single-model brands, so it's clear which bike the "All" button is for
  const showModelRow = brandModels.length > 0;

  // strict match — untagged model means fitment isn't confirmed, not that it fits everything
  const productsForModel = productsForBrand.filter(
    (item) => model === "All" || item.model === model
  );

  const filteredProducts = productsForModel.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );

  // dropdown searches the whole catalog, not just the selected brand/category — picking
  // a result opens it directly instead of making the user hunt for it in the grid
  const searchTerm = search.trim().toLowerCase();
  const searchMatches = searchTerm
    ? products
        .filter((item) => (item.name || "").toLowerCase().includes(searchTerm))
        .slice(0, 150)
    : [];
  const showSearchDropdown = searchFocused && searchTerm.length > 0;

  const openSearchResult = (item) => {
    setSelectedProduct(item);
    setSearch("");
    setSearchFocused(false);
  };

  const selectBrand = (label) => {
    setBrand(label);
    const models = label === "All"
      ? []
      : BIKE_BRANDS.find((b) => b.brand === label)?.models || [];
    // always land on one concrete model, never a blended "every model" view
    setModel(models.length > 0 ? models[0] : "All");
  };

  // same strict-match rule as productsForModel, so counts match what clicking reveals
  const modelCounts = { All: productsForBrand.length };
  brandModels.forEach((m) => {
    modelCounts[m] = productsForBrand.filter(
      (item) => item.model === m
    ).length;
  });

  return (

    <>
      <Seo
        title="Genuine Bike Spare Parts & Accessories — KTM, Royal Enfield, Kawasaki Z900"
        description="Shop genuine spare parts and accessories for KTM, Royal Enfield, Yamaha, Bajaj, Benelli and Kawasaki Z900 motorcycles at R24 Automotive, Warangal."
        keywords="KTM spare parts, Royal Enfield spare parts, Kawasaki Z900 parts, bike accessories Warangal, genuine motorcycle parts"
        path="/products"
      />
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
                onClick={() => setModel(label)}
              >
                {label}
                <span className="category-count">{modelCounts[label] || 0}</span>
              </button>

            ))}

          </div>
        )}

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
