import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const services = [
  { name: "Plumbing", path: "/services/plumber" },
  { name: "Electrical", path: "/services/electrician" },
  { name: "Carpentry", path: "/services/carpenter" },
  { name: "Painter", path: "/services/painter" },
  { name: "Bike Repair", path: "/services/bikeRepair" },
  { name: "Appliance Repair", path: "/services/applianceRepair" },
  { name: "AC Repair", path: "/services/acRepair" },
  { name: "Water Purifier Repair", path: "/services/waterPurifierRepair" },
];

const Navbar = ({ openLoginModal, cart, user, onLogout }) => {
  const [location, setLocation] = useState(() => 
    localStorage.getItem('userLocation') || "Agra, Uttar Pradesh, India"
  );
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualLocation, setManualLocation] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

 

  // Add this useEffect to monitor user changes
  useEffect(() => {
    console.log("User state in Navbar:", user);
  }, [user]);

  // Add this useEffect to save location to localStorage
  useEffect(() => {
    localStorage.setItem('userLocation', location);
  }, [location]);

  // Function to detect user's current location using Google Maps Geocoding API
  const detectLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Using Google Maps Geocoding API
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyB_FlEvUdEo2B15j8z6P8NjPgb1ebyxGW0`
            );
            const data = await response.json();

            if (data.status === 'OK' && data.results.length > 0) {
              // Get the most detailed result
              const addressComponents = data.results[0].formatted_address;
              setLocation(addressComponents);
              localStorage.setItem('userLocation', addressComponents); // Save to localStorage
            } else {
              setError("Could not find detailed address.");
            }
          } catch (err) {
            setError("Failed to fetch location details.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setError("Unable to retrieve your location.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsLoading(false);
    }
  };

  const handleManualLocationSubmit = async () => {
    if (!manualLocation.trim()) {
      setError("Please enter a valid location.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(manualLocation)}&key=AIzaSyB_FlEvUdEo2B15j8z6P8NjPgb1ebyxGW0`
      );
      const data = await response.json();
  
      if (data.status === "OK" && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address;
  
        setLocation(formattedAddress);
        localStorage.setItem('userLocation', formattedAddress); // Save to localStorage
        setIsLocationModalOpen(false);
        setError(""); // clear error
      } else {
        setError("Location not found. Please try again.");
      }
    } catch (error) {
      console.error("Geocoding API error:", error);
      setError("Something went wrong. Please try again.");
    }
  };
  
  
  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav id="Navbar" className="navbar">
      {/* Mobile menu toggle button */}
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? (
          <i className="fa-solid fa-times close-icon"></i>
        ) : (
          <i className="fa-solid fa-bars menu-icon"></i>
        )}
      </div>

      {/* Logo */}
      <div className="logo">
        <Link to="/">FindMyHelper</Link>
      </div>

      {/* Location Section */}
      <div className="location-section" onClick={() => setIsLocationModalOpen(true)}>
        <i className="fas fa-map-marker-alt location-icon"></i>
        <p id="user-location">{location}</p>
      </div>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="location-modal">
          <div className="modal-content">
            <h3>Choose Location</h3>
            <div className="current-location">
              <h4 className="locationh4">Current Location:</h4>
              <p className="full-address">{location}</p>
            </div>
            <button
              onClick={detectLocation}
              disabled={isLoading}
              className="detect-btn"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Detecting...
                </>
              ) : (
                <>
                  <i className="fas fa-location-arrow"></i> Detect my location
                </>
              )}
            </button>
            <div className="manual-location">
              <h4>Enter Location Manually:</h4>
              <input
                type="text"
                placeholder="Enter your location"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
              />
              <button
                onClick={handleManualLocationSubmit}
                className="submit-btn"
              >
                Submit
              </button>
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              className="close-modal"
              onClick={() => setIsLocationModalOpen(false)}
            >
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      <div className={`side-bar ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="sidebar-close" onClick={toggleMobileMenu}>
          <i className="fa-solid fa-times"></i>
        </div>

        <ul className="mobile-menu">
          <li>
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              className="mobile-link"
            >
              <i className="fas fa-home"></i> Home
            </Link>
          </li>

          <li className="dropdown">
            <div className="dropdown-header">
              <i className="fas fa-cogs"></i> Services
            </div>
            <ul className="dropdown-content mobile-dropdown">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="dropdown-link"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
                setIsMobileMenuOpen(false);
              }}
              className="mobile-link"
            >
              <i className="fas fa-envelope"></i> Contact
            </a>
          </li>

          <li>
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-link"
            >
              <i className="fas fa-shopping-cart"></i> Cart
              {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/order-receipt"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-link"
            >
              <i className="fas fa-shopping-cart"></i> Order
            </Link>
          </li>

          {/* Conditional mobile auth links */}
          {user ? (
            <>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mobile-link"
                >
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="mobile-logout-btn"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-login-btn"
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* Desktop Navigation Links */}
      <ul className="nav-links">
        <li>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="nav-link"
          >
            <i className="fas fa-home"></i> Home
          </Link>
        </li>

        <li className="dropdown">
          <div className="dropdown-header">
            <i className="fas fa-cogs"></i> Services
          </div>
          <ul className="dropdown-content">
            {services.map((service, index) => (
              <li key={index}>
                <Link
                  to={service.path}
                  className="dropdown-link"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </li>

        <li>
          <a
            href="#footer"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
            }}
            className="nav-link"
          >
            <i className="fas fa-envelope"></i> Contact
          </a>
        </li>

        <li>
          <Link
            to="/cart"
            className="nav-link"
          >
            <i className="fas fa-shopping-cart"></i> Cart
            {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
          </Link>
        </li>
        {/* Mobile Sidebar */}
        <li>
          <Link
            to="/order-receipt" // Corrected path
            onClick={() => setIsMobileMenuOpen(false)}
            className="mobile-link"
          >
            <i class="fa-brands fa-jedi-order"></i>Order
          </Link>
        </li>
      </ul>

      {/* Desktop Auth Section - Updated with better user detection */}
      <div className="auth-section">
        {user ? (
          <div className="user-profile-container">
            <Link to="/profile" className="profile-icon-btn">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <i className="fas fa-user-circle fa-2x"></i>
              )}
            </Link>

          </div>
        ) : (
          <button
            className="login-btn"
            onClick={openLoginModal}
          >
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        )}
      </div>

      {/* Overlay when mobile menu is open */}
      {isMobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;