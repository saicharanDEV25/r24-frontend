import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaHeart, FaCalendarCheck, FaUserShield } from "react-icons/fa";
import "./Navbar.css";
import { useCustomerAuth } from "../../../context/CustomerAuthContext";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { customer } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
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
            replace
            className="logo"
            onClick={() => {
              setMenuOpen(false);
              // router only scrolls to top on a pathname change, force it if already on "/"
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            R24 <span>Automotive</span>
          </Link>

          <nav className={menuOpen ? "nav-links active" : "nav-links"}>

            <NavLink to="/" replace onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>

            <NavLink to="/products" replace onClick={() => setMenuOpen(false)}>
              Products
            </NavLink>

            <NavLink to="/help" replace onClick={() => setMenuOpen(false)}>
              Help
            </NavLink>

            <NavLink to="/contact" replace onClick={() => setMenuOpen(false)}>
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

            <a
              href="https://admin.r24-automotive.com"
              target="_blank"
              rel="noreferrer"
              className="staff-login-link"
              title="Staff Login"
              onClick={() => setMenuOpen(false)}
            >
              <FaUserShield /> Staff Login
            </a>

            <div className="profile-menu" ref={profileRef}>
              <button
                className="profile-avatar-btn"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-label="My Account"
                title={customer?.name || "My Account"}
              >
                {customer?.name ? (
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
                    <strong>{customer?.name || "My Account"}</strong>
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
                      navigate("/profile?tab=favorites");
                    }}
                  >
                    <FaHeart /> Favorites
                  </button>
                </div>
              )}
            </div>

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
    </>
  );
}

export default Navbar;