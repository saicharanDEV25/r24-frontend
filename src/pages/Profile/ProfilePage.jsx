import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUserCircle, FaHeart, FaTrash, FaMotorcycle } from "react-icons/fa";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import ProductPopup from "../../components/common/ProductPopup/ProductPopup";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { BIKE_BRANDS } from "../../constants/bikes";
import api from "../../services/api";
import "./ProfilePage.css";

const SERVICE_INTERVAL_MONTHS = 2;

function addMonths(dateStr, months) {
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + months);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ProfilePage() {
  const { customer, updateCustomer, favorites, toggleFavorite, isFavorite } =
    useCustomerAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [bookings, setBookings] = useState([]);

  const [bikeModel, setBikeModel] = useState(customer?.bikeModel || "");
  const [purchaseYear, setPurchaseYear] = useState(customer?.purchaseYear || "");
  const [editingBike, setEditingBike] = useState(false);
  const [garageSaving, setGarageSaving] = useState(false);
  const [garageSaveMsg, setGarageSaveMsg] = useState("");

  useEffect(() => {
    if (!customer) return;
    setName(customer.name || "");
    setEmail(customer.email || "");
    setBikeModel(customer.bikeModel || "");
    setPurchaseYear(customer.purchaseYear || "");
  }, [customer]);

  const loadBookings = async () => {
    try {
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  useEffect(() => {
    if (customer && activeTab === "garage") {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, activeTab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/customers/me", { name, email, bikeModel: customer.bikeModel, purchaseYear: customer.purchaseYear });
      updateCustomer(res.data);
      setSaveMsg("Profile updated!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMsg("Couldn't save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveBike = async (e) => {
    e.preventDefault();
    try {
      setGarageSaving(true);
      const res = await api.put("/customers/me", {
        name: customer.name,
        email: customer.email,
        bikeModel,
        purchaseYear: purchaseYear ? Number(purchaseYear) : null,
      });
      updateCustomer(res.data);
      setEditingBike(false);
      setGarageSaveMsg("Garage updated!");
      setTimeout(() => setGarageSaveMsg(""), 3000);
    } catch (error) {
      console.error("Error saving bike:", error);
      setGarageSaveMsg("Couldn't save. Please try again.");
    } finally {
      setGarageSaving(false);
    }
  };

  const completedBookings = bookings
    .filter((b) => b.status === "Completed")
    .sort((a, b) => (a.bookingDate < b.bookingDate ? 1 : -1));

  const lastService = completedBookings[0];

  if (!customer) {
    return (
      <>
        <Navbar />
        <section className="profile-page">
          <div className="profile-guest">
            <FaUserCircle />
            <h2>Setting things up…</h2>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="profile-page">
        <div className="profile-heading">
          <h2>My Account</h2>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setSearchParams({ tab: "info" })}
          >
            <FaUserCircle /> Profile Info
          </button>
          <button
            className={activeTab === "garage" ? "active" : ""}
            onClick={() => setSearchParams({ tab: "garage" })}
          >
            <FaMotorcycle /> My Garage
          </button>
          <button
            className={activeTab === "favorites" ? "active" : ""}
            onClick={() => setSearchParams({ tab: "favorites" })}
          >
            <FaHeart /> Favorites
          </button>
        </div>

        {activeTab === "info" && (
          <form className="profile-info-form" onSubmit={saveProfile}>
            <label>
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
              />
            </label>

            {saveMsg && <p className="profile-save-msg">{saveMsg}</p>}

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "garage" && (
          <div className="profile-garage">
            {!customer.bikeModel || editingBike ? (
              <form className="garage-edit-form" onSubmit={saveBike}>
                <label>
                  Bike Model
                  <select
                    value={bikeModel}
                    onChange={(e) => setBikeModel(e.target.value)}
                    required
                  >
                    <option value="">Select your bike</option>
                    {BIKE_BRANDS.map((group) => (
                      <optgroup key={group.brand} label={group.brand}>
                        {group.models.map((bike) => (
                          <option key={bike} value={bike}>
                            {bike}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </label>

                <label>
                  Purchased Year
                  <input
                    type="number"
                    min="2000"
                    max={new Date().getFullYear()}
                    value={purchaseYear}
                    onChange={(e) => setPurchaseYear(e.target.value)}
                    placeholder="e.g. 2024"
                    required
                  />
                </label>

                {garageSaveMsg && <p className="profile-save-msg">{garageSaveMsg}</p>}

                <div className="garage-edit-actions">
                  <button type="submit" disabled={garageSaving}>
                    {garageSaving ? "Saving..." : "Save Bike"}
                  </button>
                  {customer.bikeModel && (
                    <button
                      type="button"
                      className="garage-cancel-btn"
                      onClick={() => {
                        setBikeModel(customer.bikeModel || "");
                        setPurchaseYear(customer.purchaseYear || "");
                        setEditingBike(false);
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              <div className="garage-card">
                <div className="garage-card-header">
                  <div>
                    <span className="garage-card-tag">My Garage</span>
                    <h3>{customer.bikeModel}</h3>
                  </div>
                  <button
                    className="garage-edit-btn"
                    onClick={() => setEditingBike(true)}
                  >
                    Edit
                  </button>
                </div>

                <div className="garage-stats">
                  <div className="garage-stat">
                    <span className="garage-stat-label">Purchased</span>
                    <span className="garage-stat-value">
                      {customer.purchaseYear || "—"}
                    </span>
                  </div>

                  <div className="garage-stat">
                    <span className="garage-stat-label">Last Service</span>
                    <span className="garage-stat-value">
                      {lastService ? formatDate(lastService.bookingDate) : "No service yet"}
                    </span>
                  </div>

                  <div className="garage-stat">
                    <span className="garage-stat-label">Next Service</span>
                    <span className="garage-stat-value">
                      {lastService
                        ? addMonths(lastService.bookingDate, SERVICE_INTERVAL_MONTHS)
                        : "—"}
                    </span>
                  </div>

                  <button
                    className="garage-stat garage-stat-link"
                    onClick={() => setSearchParams({ tab: "favorites" })}
                  >
                    <span className="garage-stat-label">Favourite Accessories</span>
                    <span className="garage-stat-value">{favorites.length} saved</span>
                  </button>

                  <div className="garage-stat">
                    <span className="garage-stat-label">Service History</span>
                    <span className="garage-stat-value">{bookings.length} bookings</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "favorites" && (
          <div className="profile-favorites">
            {favorites.length === 0 ? (
              <div className="profile-empty">
                <p>No favorites yet.</p>
                <a href="/products">Browse Products</a>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((product) => (
                  <div
                    className="favorite-card"
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="favorite-card-media">
                      <OptimizedImage
                        src={product.imageUrl}
                        width={300}
                        alt={product.name}
                        wrapperClassName="favorite-card-img"
                        fallbackSrc="https://placehold.co/300x300?text=No+Image"
                      />
                      <button
                        className="favorite-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product);
                        }}
                        aria-label="Remove from favorites"
                        title="Remove from favorites"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="favorite-card-info">
                      <h4>{product.name}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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

export default ProfilePage;
