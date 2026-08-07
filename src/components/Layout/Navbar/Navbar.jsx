import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaClipboardList, FaHeart, FaCalendarCheck, FaBell } from "react-icons/fa";
import "./Navbar.css";
import { useCustomerAuth } from "../../../context/CustomerAuthContext";
import { useNotifications } from "../../../context/NotificationContext";
import LoginModal from "../../Auth/LoginModal";

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const { customer, logout } = useCustomerAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const whatsappMessage = encodeURIComponent(
    "Hello R24 Automotive 👋\n\nI visited your website and I'm interested in your services. Please provide me with more details."
  );

  return (
    <>
      <header className={scrolled ? "navbar scrolled" : "navbar"}>
        <div className="container navbar-container">

          <Link
            to="/"
            className="logo"
            onClick={() => setMenuOpen(false)}
          >
            R24 <span>Automotive</span>
          </Link>

          <nav className={menuOpen ? "nav-links active" : "nav-links"}>

            <NavLink to="/" onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/products" onClick={() => setMenuOpen(false)}>
              Products
            </NavLink>

            <NavLink to="/help" onClick={() => setMenuOpen(false)}>
              Help
            </NavLink>

            <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </NavLink>

            <a
              href={`https://wa.me/918309560622?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="book-btn"
              onClick={() => setMenuOpen(false)}
            >
              <FaCalendarCheck /> Book Service
            </a>

            {customer && (
              <div className="notif-menu" ref={notifRef}>
                <button
                  className="notif-bell-btn"
                  onClick={() => {
                    setNotifOpen((prev) => !prev);
                    if (!notifOpen) markAllRead();
                  }}
                  aria-label="Notifications"
                >
                  <FaBell />
                  {unreadCount > 0 && <span className="notif-dot"></span>}
                </button>

                {notifOpen && (
                  <div className="notif-dropdown">
                    <div className="notif-dropdown-header">Notifications</div>

                    {notifications.length === 0 ? (
                      <p className="notif-empty">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          className="notif-item"
                          onClick={() => {
                            setNotifOpen(false);
                            setMenuOpen(false);
                            navigate("/profile?tab=bookings");
                          }}
                        >
                          <span>{n.message}</span>
                          <small>{timeAgo(n.createdAt)}</small>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {customer ? (
              <div className="profile-menu" ref={profileRef}>
                <button
                  className="profile-avatar-btn"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  aria-label="My Account"
                  title={customer.name || "My Account"}
                >
                  {customer.name ? (
                    <span className="profile-avatar-initials">
                      {customer.name.trim().charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <FaUserCircle />
                  )}
                </button>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <strong>{customer.name || "My Account"}</strong>
                      <span>+91 {customer.phoneNumber}</span>
                    </div>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <FaUserCircle /> My Profile
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setMenuOpen(false);
                        navigate("/profile?tab=bookings");
                      }}
                    >
                      <FaClipboardList /> My Bookings
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setMenuOpen(false);
                        navigate("/profile?tab=favorites");
                      }}
                    >
                      <FaHeart /> Favorites
                    </button>

                    <button
                      className="logout-item"
                      onClick={() => {
                        logout();
                        setProfileOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="login-btn"
                onClick={() => {
                  setShowLogin(true);
                  setMenuOpen(false);
                }}
              >
                <FaUserCircle /> Login
              </button>
            )}

          </nav>

          <div
            className="menu-icon"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </div>

        </div>
      </header>

      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}

export default Navbar;