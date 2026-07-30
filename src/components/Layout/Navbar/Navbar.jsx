import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
              Book Service
            </a>

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