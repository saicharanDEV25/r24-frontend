import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import api from "../../services/api";
import "./Product.css";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import ProductPopup from "../../components/common/ProductPopup/ProductPopup";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";

const BRAND_FILTER_OPTIONS = ["All", "KTM", "Royal Enfield", "Yamaha", "Benelli"];

function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
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

  const categoryFilterOptions = ["All"];
  productsForBrand.forEach((item) => {
    const name = item.category?.name;
    if (name && !categoryFilterOptions.includes(name)) {
      categoryFilterOptions.push(name);
    }
  });

  const categoryCounts = { All: productsForBrand.length };
  productsForBrand.forEach((item) => {
    const name = item.category?.name;
    if (name) categoryCounts[name] = (categoryCounts[name] || 0) + 1;
  });

  const filteredProducts = productsForBrand.filter((item) => {

    const matchesCategory =
      category === "All" || item.category?.name === category;

    const matchesSearch =
      (item.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesAvailability =
      availability === "All" ||
      (availability === "In Stock" ? item.stock > 0 : item.stock <= 0);

    return matchesCategory && matchesSearch && matchesAvailability;

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
            />

          </div>

        </div>

        <div className="category-buttons">

          {BRAND_FILTER_OPTIONS.map((label) => (

            <button
              key={label}
              className={brand === label ? "active" : ""}
              onClick={() => {
                setBrand(label);
                setCategory("All");
              }}
            >
              {label}
              <span className="category-count">{brandCounts[label] || 0}</span>
            </button>

          ))}

        </div>

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

                <span>{item.brand || "KTM"} · {item.category?.name}</span>

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
