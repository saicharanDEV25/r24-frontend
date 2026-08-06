import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaUserCircle, FaClipboardList, FaHeart, FaTrash } from "react-icons/fa";
import Navbar from "../../components/Layout/Navbar/Navbar";
import Footer from "../../components/Layout/Footer/Footer";
import LoginModal from "../../components/Auth/LoginModal";
import OptimizedImage from "../../components/common/OptimizedImage/OptimizedImage";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import api from "../../services/api";
import "./ProfilePage.css";

function ProfilePage() {
  const { customer, updateCustomer, favorites, toggleFavorite } =
    useCustomerAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";

  const [showLogin, setShowLogin] = useState(false);

  const [name, setName] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  const loadBookings = async () => {
    try {
      setBookingsLoading(true);
      const res = await api.get("/bookings/my");
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (customer && activeTab === "bookings") {
      loadBookings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, activeTab]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/customers/me", { name, email });
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

  if (!customer) {
    return (
      <>
        <Navbar />
        <section className="profile-page">
          <div className="profile-guest">
            <FaUserCircle />
            <h2>You're not logged in</h2>
            <p>Login to view your profile, bookings and favorites.</p>
            <button onClick={() => setShowLogin(true)}>Login</button>
          </div>
        </section>
        <Footer />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="profile-page">
        <div className="profile-heading">
          <h2>My Account</h2>
          <p>+91 {customer.phoneNumber}</p>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setSearchParams({ tab: "info" })}
          >
            <FaUserCircle /> Profile Info
          </button>
          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setSearchParams({ tab: "bookings" })}
          >
            <FaClipboardList /> My Bookings
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

            <label>
              Mobile Number
              <input type="text" value={customer.phoneNumber} disabled />
            </label>

            {saveMsg && <p className="profile-save-msg">{saveMsg}</p>}

            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

        {activeTab === "bookings" && (
          <div className="profile-bookings">
            {bookingsLoading ? (
              <p className="profile-empty">Loading...</p>
            ) : bookings.length === 0 ? (
              <div className="profile-empty">
                <p>No bookings yet.</p>
                <a
                  href="https://wa.me/918309560622?text=Hello%20R24%20Automotive%20%F0%9F%91%8B%20I%20want%20to%20book%20a%20service."
                  target="_blank"
                  rel="noreferrer"
                >
                  Book a Service on WhatsApp
                </a>
              </div>
            ) : (
              bookings.map((b) => (
                <div className="booking-card" key={b.id}>
                  <div>
                    <h4>{b.serviceType}</h4>
                    <p>
                      {b.bikeModel} &middot; {b.bookingDate}{" "}
                      {b.bookingTime && `at ${b.bookingTime}`}
                    </p>
                  </div>
                  <span className={`booking-status ${b.status?.toLowerCase()}`}>
                    {b.status}
                  </span>
                </div>
              ))
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
                  <div className="favorite-card" key={product.id}>
                    <OptimizedImage
                      src={product.imageUrl}
                      width={300}
                      alt={product.name}
                      fallbackSrc="https://placehold.co/300x300?text=No+Image"
                    />
                    <div className="favorite-card-info">
                      <h4>{product.name}</h4>
                      <span>₹ {product.price}</span>
                    </div>
                    <button
                      className="favorite-remove-btn"
                      onClick={() => toggleFavorite(product)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}

export default ProfilePage;
