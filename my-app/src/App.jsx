import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchSection from "./components/SearchSection";
import Services from "./components/Services";
import Slider from "./components/Slider";
import AboutFeedback from "./components/AboutFeedback";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import ServicePage from "./components/plumber";
import CartPage from "./components/CartPage";
import ScrollToTop from "./components/scrolltotop";
import Helper from "./components/helper";
import Profile from "./components/Profile"; // Import Profile component
import OrderReceipt from "./components/OrderReceipt";
import Address from "./components/address"; // Import the Address component
// Import OrderReceipt component
// Move this to a separate file if it gets large
const allServicesData = {
  plumber: [
    {
      id: 1,
      name: "Pipe Repair",
      description: "Fix broken or leaking pipes with expert plumbers.",
      price: 499,
      image: "https://th.bing.com/th/id/OIP._LdKGvkPfkaKMb98IG5r4AHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Drain Cleaning",
      description: "Unclog and clean drains for smooth water flow.",
      price: 599,
      image: "https://static.fanpage.it/wp-content/uploads/sites/22/2019/03/drain.jpg",
    },
    {
      id: 3,
      name: "Water Heater Repair",
      description: "Ensure your water heater runs efficiently.",
      price: 799,
      image: "https://th.bing.com/th/id/OIP.11nkckNdJctf--x6ouduDwHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 4,
      name: "Leak Detection",
      description: "Detect and fix water leaks in your plumbing system.",
      price: 699,
      image: "https://th.bing.com/th/id/OIP.nkn4ymW7-S9g1ylfio06GwHaE7?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      name: "Fixture Installation",
      description: "Install new faucets, showers, and other fixtures.",
      price: 899,
      image: "https://www.jnrplumbing.com/wp-content/uploads/2022/08/why-proper-fixture-installation-matters.jpg",
    },
    // Add more plumber services
  ],
  electrician: [
    {
      id: 1,
      name: "Wiring Repair",
      description: "Fix faulty wiring and electrical connections to ensure safety and functionality.",
      price: 499,
      image: "https://th.bing.com/th/id/OIP.CtSYa1idUKsmuGzqtAUiCwAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Light Installation",
      description: "Install new lights, fixtures, and switches for better illumination.",
      price: 599,
      image: "https://th.bing.com/th/id/OIP.egLU8HQNcAxEDTUgofRwAgHaEu?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      name: "Circuit Breaker Repair",
      description: "Repair or replace faulty circuit breakers to prevent electrical hazards.",
      price: 799,
      image: "https://th.bing.com/th/id/OIP.eIh4RYbArX5Rdqf0LuqftQHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 4,
      name: "Panel Upgrade",
      description: "Upgrade your electrical panel to handle increased power demands.",
      price: 699,
      image: "https://assets.bxb.media/service_banners/Electrical%20Panel%20Upgrade/1%20-%20Electrical%20Panel%20Upgrade/electrical-panel-upgrade_1024x576.jpg",
    },
    {
      id: 5,
      name: "Switch Installation",
      description: "Install new electrical outlets and switches for convenience and functionality.",
      price: 899,
      image: "https://th.bing.com/th/id/OIP.4o31fvwlPLJoaHC6p7Vr2gHaEK?rs=1&pid=ImgDetMain",
    },
    // Add more electrician services
  ],
  carpenter: [
    {
      id: 1,
      name: "Furniture Repair",
      description: "Repair and restore damaged furniture to its original condition.",
      price: 499,
      image: "https://ahmfurniture.com/wp-content/uploads/2019/07/furniture-repair-0028.jpg",
    },
    {
      id: 2,
      name: "Custom Furniture",
      description: "Design and build custom furniture tailored to your needs.",
      price: 599,
      image: "https://th.bing.com/th/id/OIP.B7kYkPT7xfKbszMLHyW5QQHaFj?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      name: "Cabinet Installation",
      description: "Install cabinets for kitchens, bathrooms, or storage spaces.",
      price: 799,
      image: "https://i.pinimg.com/originals/64/2c/d6/642cd6034eb53bd67550ad42d7cb67a1.jpg",
    },
    {
      id: 4,
      name: "Door and Window Repair",
      description: "Repair or replace damaged doors and windows for better functionality.",
      price: 699,
      image: "https://th.bing.com/th/id/OIP.HrkAP4Ym84aT7oP4K9IPKQHaGl?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      name: "Wooden Flooring Installation",
      description: "Install high-quality wooden flooring for a stylish and durable finish.",
      price: 899,
      image: "https://i.pinimg.com/originals/50/e7/d1/50e7d19996e17f02240c1819bb22dfa1.jpg",
    },
    // Add more carpenter services
  ],
  painter: [
    {
      id: 1,
      name: "Wall Painting",
      description: "Professional wall painting services for your home or office.",
      price: 499,
      image: "https://kaizenaire.com/wp-content/uploads/2024/01/Wall-Painting-Services-Singapore-Transform-Your-Home-with-Professional-Painters.jpg",
    },
    {
      id: 2,
      name: "Exterior Painting",
      description: " High-quality exterior painting to protect and beautify your property.",
      price: 599,
      image: "https://th.bing.com/th/id/OIP.W9vF5ScHseFFvzKw5eef1gHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 3,
      name: "Texture Painting",
      description: "Add unique textures and designs to your walls for a modern look.",
      price: 799,
      image: "https://i.ytimg.com/vi/2rzkiPDJnXo/maxresdefault.jpg",
    },
    {
      id: 4,
      name: "Waterproofing",
      description: "Apply waterproof coatings to protect walls from moisture and damage.",
      price: 699,
      image: "https://www.engineeringcivil.com/wp-content/uploads/2023/05/Waterproofing-in-Building-Construction2.jpg",
    },
    {
      id: 5,
      name: "Wallpaper Installation",
      description: "Install stylish wallpapers to enhance the aesthetics of your space.",
      price: 899,
      image: "https://romandecoratingproducts.com/wp-content/uploads/2022/07/worker-hanging-stylish-wall-paper-sheet-indoors.jpg",
    },
    // Add more painter services
  ],
  bikeRepair: [
    {
      id: 1,
      name: "Engine Repair",
      description: "FDiagnose and fix engine issues to ensure smooth performance.",
      price: 499,
      image: "https://thumbs.dreamstime.com/b/shoulder-shot-focus-hands-motorbike-mechanic-fixing-reparing-engine-garage-concept-maintenance-service-occupation-243531303.jpg",
    },
    {
      id: 2,
      name: "Bike Servicing",
      description: "Comprehensive servicing including oil change, chain lubrication, and overall inspection.",
      price: 599,
      image: "https://3.imimg.com/data3/BR/KG/MY-13797159/indian-bike-servicing-1000x1000.jpg",
    },
    {
      id: 3,
      name: "Clutch Plate Replacement",
      description: "Replace worn-out clutch plates for smooth gear shifting.",
      price: 799,
      image: "https://th.bing.com/th/id/OIP.WXeTT5chxHpiRa1935X3RQHaEK?rs=1&pid=ImgDetMain",
    },
    {
      id: 4,
      name: "Oil Change",
      description: "Replace engine oil and oil filter for better engine performance.",
      price: 699,
      image: "https://th.bing.com/th/id/OIP.fXojbHeog0KYLMbKjm42HgHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      name: "Brake Caliper Repair",
      description: "Repair or replace brake calipers to ensure smooth braking.",
      price: 899,
      image: "https://th.bing.com/th/id/OIP.m6Cl59a04tUvM8rZgQVnWAHaFj?rs=1&pid=ImgDetMain",
    },
    // Add more bike repair services
  ],
  applianceRepair: [
    {
      id: 1,
      name: "Refrigerator Repair",
      description: "Diagnose and fix issues with your refrigerator, including cooling problems and leaks.",
      price: 499,
      image: "https://th.bing.com/th/id/OIP.iyIPQP1FYHe1pW3u8SpDpgHaE6?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "Washing Machine Repair",
      description: "Repair washing machines for issues like drainage problems, spinning errors, or water leakage.",
      price: 599,
      image: "https://th.bing.com/th/id/R.cf9d100ed0adc2728f55132f360dcf2d?rik=MHIUVkIob94Hog&riu=http%3a%2f%2fwww.totallyrepair.in%2fblog%2fwp-content%2fuploads%2f2017%2f07%2fWashing-Machine-Repair-2.jpg&ehk=7wXXVQfBKjTui7TZd34wDxTAvTPzBNDkECGwGiPkNkg%3d&risl=&pid=ImgRaw&r=0",
    },
    {
      id: 3,
      name: "Microwave Repairr",
      description: " Fix microwave issues such as heating problems, door malfunctions, or electrical faults.",
      price: 799,
      image: "https://fixappliances.ca/wp-content/uploads/2019/02/wichita-ks-microwave-repair-900x506.jpg",
    },
    {
      id: 4,
      name: "Oven Repair",
      description: "Repair or replace faulty oven components, including heating elements and thermostats.",
      price: 699,
      image: "https://th.bing.com/th/id/OIP._dZqGHm7UZHln56PQ_7WHAHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      name: "Dishwasher Repair",
      description: "Fix dishwasher issues like poor cleaning, water drainage problems, or electrical faults.",
      price: 899,
      image: "https://th.bing.com/th/id/OIP.gdNx5l0FGzykby_lkv--uwHaEc?rs=1&pid=ImgDetMain",
    },
    // Add more bike repair services
  ],
  acRepair: [
    {
      id: 1,
      name: "AC Gas Refill",
      description: "Refill refrigerant gas to restore cooling efficiency in your AC.",
      price: 499,
      image: "https://th.bing.com/th/id/OIP.I-NL05OL7wSFjyUUgLV7ggAAAA?rs=1&pid=ImgDetMain",
    },
    {
      id: 2,
      name: "AC Cleaning",
      description: "Deep cleaning of AC units, including filters, coils, and ducts, for better performance.",
      price: 599,
      image: "https://i.ytimg.com/vi/s6NHxfKUkUo/maxresdefault.jpg",
    },
    {
      id: 3,
      name: "AC Installation",
      description: "Professional installation of new AC units, including wiring and testing.",
      price: 799,
      image: "https://2.bp.blogspot.com/-oZVO2KglJCg/WiuOYa21qWI/AAAAAAAAA00/MD55a2cE-kcYxoh6qJxxB44ObBUPU-ijgCLcBGAs/s1600/air-conditioning-installation.jpg",
    },
    {
      id: 4,
      name: "AC Repair",
      description: "Diagnose and fix AC issues like cooling problems, strange noises, or electrical faults.",
      price: 699,
      image: "https://th.bing.com/th/id/OIP.XpkOHhJt56NWd3FnR6a8_QHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 5,
      name: "AC Maintenance",
      description: "Regular maintenance to ensure optimal performance and longevity of your AC.",
      price: 899,
      image: "https://th.bing.com/th/id/OIP.cvzeYeCg5LyTG3WyopDqjwHaE8?rs=1&pid=ImgDetMain",
    },
    // Add more bike repair services
  ],
  waterPurifierRepair: [
    {
      id: 1,
      name: "Filter Replacement",
      description: "Replace old or clogged water purifier filters.",
      price: 499,
      image: "https://images-na.ssl-images-amazon.com/images/I/71MIQqwP8gL._SL1500_.jpg",
    },
    {
      id: 2,
      name: "UV Lamp Replacement",
      description: "Replace faulty UV lamps in water purifiers.",
      price: 599,
      image: "https://cdn.shopclues.com/images1/detailed/89219/139483189-89219982-1530003784.jpg",
    },
    {
      id: 3,
      name: "General Maintenance",
      description: "Regular maintenance to ensure optimal performance.Ensure your water heater runs efficiently.",
      price: 799,
      image: "https://th.bing.com/th/id/OIP.7-nMfbNpB8gwYatD19cvgwHaE8?rs=1&pid=ImgDetMain",
    },
    {
      id: 4,
      name: "Motor Repair",
      description: "Repair or replace water purifier motors.",
      price: 699,
      image: "https://i.ytimg.com/vi/uHbjiHi76js/maxresdefault.jpg",
    },
    {
      id: 5,
      name: "Leakage Repair",
      description: "Fix water leakage issues in purifiers.",
      price: 899,
      image: "https://5.imimg.com/data5/SELLER/Default/2022/12/WT/CB/NR/132537498/water-heater-500x500.jpg",
    },
    // Add more bike repair services
  ],
  // ... other service categories
};

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);  // Store logged-in user
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (id, amount) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + amount } : item
    ).filter(item => item.quantity > 0));
  };

  // Modal control functions
  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
  };

  const closeLoginModal = () => setShowLoginModal(false);
  const closeSignupModal = () => setShowSignupModal(false);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === "") {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    const results = Object.entries(allServicesData).flatMap(([category, services]) =>
      services
        .filter(
          (service) =>
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            service.description.toLowerCase().includes(query.toLowerCase()
            )
        )
        .map((service) => ({ ...service, category }))
    );

    setSearchResults(results);
  };

  const handleLoginSuccess = (userData) => {
    console.log("Login successful, user data:", userData); // Debugging
    setUser(userData); // Update user state
    localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
    setShowLoginModal(false);
    navigate("/profile"); // Redirect to profile page
  };
  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("Token");        // Clear auth token
    localStorage.removeItem("userData");     // Clear user info
    localStorage.removeItem("sessionId");    // Clear guest session (optional)
    setUser(null);                           // Clear user state (if using global state or context)
    setCart([]);                             // Clear cart state
    navigate("/");                           // Redirect to homepage or login
  };
  

  return (
    <>
      <ScrollToTop />
      <Navbar
        openLoginModal={openLoginModal}
        cart={cart}
        user={user}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchSection onSearch={handleSearch} />
              {isSearching ? (
                <div className="search-results-container">
                  <h2>Search Results for "{searchQuery}"</h2>
                  {searchResults.length > 0 ? (
                    <div className="services-grid">
                      {searchResults.map((service) => (
                        <div
                          key={`${service.category}-${service.id}`}
                          className="service-card"
                          onClick={() => navigate(`/services/${service.category}`)}
                        >
                          <img src={service.image} alt={service.name} />
                          <h3>{service.name}</h3>
                          <p>{service.description}</p>
                          <p className="price">₹{service.price}</p>
                          <p className="category">{service.category}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-results">No services found matching your search.</p>
                  )}
                </div>
              ) : (
                <>
                  <Services searchQuery={searchQuery} />
                  <Slider />
                  <AboutFeedback />
                </>
              )}
              <Footer openLoginModal={openLoginModal} openSignupModal={openSignupModal} />
            </>
          }
        />

        <Route
          path="/services/:serviceType"
          element={
            <ServicePage
              cart={cart}
              setCart={setCart}
              searchQuery={searchQuery}
            />
          }
        />
        <Route path="/helper" element={<Helper />} />
        <Route path="/receipt/:orderId" element={<OrderReceipt />} />
        <Route
          path="/cart"
          element={
            <CartPage
              cart={cart}
              removeFromCart={removeFromCart}
              openLoginModal={openLoginModal}  // ✅ Pass this!
            />
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" /> // Redirect to home if not logged in
            )
          }
        />

       
        {/* OrderReceipt Route */}
        <Route
          path="/order-receipt"
          element={<OrderReceipt />} // Define the OrderReceipt route
        />
        <Route path="/address" element={<Address />} /> {/* Add this route */}
      </Routes>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          closeModal={closeLoginModal}
          switchToSignup={() => {
            closeLoginModal();
            openSignupModal();
          }}
          onLoginSuccess={handleLoginSuccess}  // Use the new handler
        />
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <SignupModal
          closeModal={closeSignupModal}
          switchToLogin={() => {
            closeSignupModal();
            openLoginModal();
          }}
        />
      )}
    </>
  );
}

export default App;