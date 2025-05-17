import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // Import UUID for generating session IDs
import "../styles/plumber.css";
import Footer from "../components/Footer";


const ServicePage = ({ cart, setCart, searchQuery, user }) => {
  const { serviceType } = useParams();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

 useEffect(() => {
    console.log("User state in Navbar:", user);
  }, [user]);
  
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("Token");
    if (!token) {
      console.log("No token found in localStorage.");
      return null;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const data = await response.json();
      console.log("User profile response:", data); // ✅ log response
  
      if (response.ok) {
        localStorage.setItem("userData", JSON.stringify(data)); // unify with the cart logic

        return data;
      } else {
        console.error("Error fetching profile:", data.message); // 🔥 log error message
        return null;
      }
    } catch (error) {
      console.error("Network or server error:", error); // ❗ catch fetch/network issues
      return null;
    }
  };
  
  useEffect(() => {
    fetchUserProfile();
  }, []);
 
  // Ensure sessionId exists in localStorage
  let sessionId = localStorage.getItem("sessionId") || uuidv4();
  if (!sessionId) {
    sessionId = uuidv4(); // Generate a new sessionId if not present
    localStorage.setItem("sessionId", sessionId);
  }


  // Sample services data for different service types
  const servicesData = {
    plumber: [
      {
        id: 101,
        name: "Pipe Repair",
        description: "Fix broken or leaking pipes with expert plumbers.",
        price: 499,
        image: "https://th.bing.com/th/id/OIP._LdKGvkPfkaKMb98IG5r4AHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 102,
        name: "Drain Cleaning",
        description: "Unclog and clean drains for smooth water flow.",
        price: 599,
        image: "https://static.fanpage.it/wp-content/uploads/sites/22/2019/03/drain.jpg",
      },
      {
        id: 103,
        name: "Water Heater Repair",
        description: "Ensure your water heater runs efficiently.",
        price: 799,
        image: "https://th.bing.com/th/id/OIP.11nkckNdJctf--x6ouduDwHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 104,
        name: "Leak Detection",
        description: "Detect and fix water leaks in your plumbing system.",
        price: 699,
        image: "https://th.bing.com/th/id/OIP.nkn4ymW7-S9g1ylfio06GwHaE7?rs=1&pid=ImgDetMain",
      },
      {
        id: 105,
        name: "Fixture Installation",
        description: "Install new faucets, showers, and other fixtures.",
        price: 899,
        image: "https://www.jnrplumbing.com/wp-content/uploads/2022/08/why-proper-fixture-installation-matters.jpg",
      },
    ],
    electrician: [
      {
        id: 201,
        name: "Wiring Repair",
        description: "Fix faulty wiring and electrical connections to ensure safety and functionality.",
        price: 499,
        image: "https://th.bing.com/th/id/OIP.CtSYa1idUKsmuGzqtAUiCwAAAA?rs=1&pid=ImgDetMain",
      },
      {
        id: 202,
        name: "Light Installation",
        description: "Install new lights, fixtures, and switches for better illumination.",
        price: 599,
        image: "https://th.bing.com/th/id/OIP.egLU8HQNcAxEDTUgofRwAgHaEu?rs=1&pid=ImgDetMain",
      },
      {
        id: 203,
        name: "Circuit Breaker Repair",
        description: "Repair or replace faulty circuit breakers to prevent electrical hazards.",
        price: 799,
        image: "https://th.bing.com/th/id/OIP.eIh4RYbArX5Rdqf0LuqftQHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 204,
        name: "Panel Upgrade",
        description: "Upgrade your electrical panel to handle increased power demands.",
        price: 699,
        image: "https://assets.bxb.media/service_banners/Electrical%20Panel%20Upgrade/1%20-%20Electrical%20Panel%20Upgrade/electrical-panel-upgrade_1024x576.jpg",
      },
      {
        id: 205,
        name: "Switch Installation",
        description: "Install new electrical outlets and switches for convenience and functionality.",
        price: 899,
        image: "https://th.bing.com/th/id/OIP.4o31fvwlPLJoaHC6p7Vr2gHaEK?rs=1&pid=ImgDetMain",
      },
    ],
    carpenter: [
      {
        id: 301,
        name: "Furniture Repair",
        description: "Repair and restore damaged furniture to its original condition.",
        price: 499,
        image: "https://ahmfurniture.com/wp-content/uploads/2019/07/furniture-repair-0028.jpg",
      },
      {
        id: 302,
        name: "Custom Furniture",
        description: "Design and build custom furniture tailored to your needs.",
        price: 599,
        image: "https://th.bing.com/th/id/OIP.B7kYkPT7xfKbszMLHyW5QQHaFj?rs=1&pid=ImgDetMain",
      },
      {
        id: 303,
        name: "Cabinet Installation",
        description: "Install cabinets for kitchens, bathrooms, or storage spaces.",
        price: 799,
        image: "https://i.pinimg.com/originals/64/2c/d6/642cd6034eb53bd67550ad42d7cb67a1.jpg",
      },
      {
        id: 304,
        name: "Door and Window Repair",
        description: "Repair or replace damaged doors and windows for better functionality.",
        price: 699,
        image: "https://th.bing.com/th/id/OIP.HrkAP4Ym84aT7oP4K9IPKQHaGl?rs=1&pid=ImgDetMain",
      },
      {
        id: 305,
        name: "Wooden Flooring Installation",
        description: "Install high-quality wooden flooring for a stylish and durable finish.",
        price: 899,
        image: "https://i.pinimg.com/originals/50/e7/d1/50e7d19996e17f02240c1819bb22dfa1.jpg",
      },
    ],
    painter: [
      {
        id: 401,
        name: "Wall Painting",
        description: "Professional wall painting services for your home or office.",
        price: 499,
        image: "https://kaizenaire.com/wp-content/uploads/2024/01/Wall-Painting-Services-Singapore-Transform-Your-Home-with-Professional-Painters.jpg",
      },
      {
        id: 402,
        name: "Exterior Painting",
        description: " High-quality exterior painting to protect and beautify your property.",
        price: 599,
        image: "https://th.bing.com/th/id/OIP.W9vF5ScHseFFvzKw5eef1gHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 403,
        name: "Texture Painting",
        description: "Add unique textures and designs to your walls for a modern look.",
        price: 799,
        image: "https://i.ytimg.com/vi/2rzkiPDJnXo/maxresdefault.jpg",
      },
      {
        id: 404,
        name: "Waterproofing",
        description: "Apply waterproof coatings to protect walls from moisture and damage.",
        price: 699,
        image: "https://www.engineeringcivil.com/wp-content/uploads/2023/05/Waterproofing-in-Building-Construction2.jpg",
      },
      {
        id: 405,
        name: "Wallpaper Installation",
        description: "Install stylish wallpapers to enhance the aesthetics of your space.",
        price: 899,
        image: "https://romandecoratingproducts.com/wp-content/uploads/2022/07/worker-hanging-stylish-wall-paper-sheet-indoors.jpg",
      },
    ],
    bikeRepair: [
      {
        id: 501,
        name: "Engine Repair",
        description: "Diagnose and fix engine issues to ensure smooth performance.",
        price: 499,
        image: "https://thumbs.dreamstime.com/b/shoulder-shot-focus-hands-motorbike-mechanic-fixing-reparing-engine-garage-concept-maintenance-service-occupation-243531303.jpg",
      },
      {
        id: 502,
        name: "Bike Servicing",
        description: "Comprehensive servicing including oil change, chain lubrication, and overall inspection.",
        price: 599,
        image: "https://3.imimg.com/data3/BR/KG/MY-13797159/indian-bike-servicing-1000x1000.jpg",
      },
      {
        id: 503,
        name: "Clutch Plate Replacement",
        description: "Replace worn-out clutch plates for smooth gear shifting.",
        price: 799,
        image: "https://th.bing.com/th/id/OIP.WXeTT5chxHpiRa1935X3RQHaEK?rs=1&pid=ImgDetMain",
      },
      {
        id: 504,
        name: "Oil Change",
        description: "Replace engine oil and oil filter for better engine performance.",
        price: 699,
        image: "https://th.bing.com/th/id/OIP.fXojbHeog0KYLMbKjm42HgHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 505,
        name: "Brake Caliper Repair",
        description: "Repair or replace brake calipers to ensure smooth braking.",
        price: 899,
        image: "https://th.bing.com/th/id/OIP.m6Cl59a04tUvM8rZgQVnWAHaFj?rs=1&pid=ImgDetMain",
      },
    ],
    applianceRepair: [
      {
        id: 601,
        name: "Refrigerator Repair",
        description: "Diagnose and fix issues with your refrigerator, including cooling problems and leaks.",
        price: 499,
        image: "https://th.bing.com/th/id/OIP.iyIPQP1FYHe1pW3u8SpDpgHaE6?rs=1&pid=ImgDetMain",
      },
      {
        id: 602,
        name: "Washing Machine Repair",
        description: "Repair washing machines for issues like drainage problems, spinning errors, or water leakage.",
        price: 599,
        image: "https://th.bing.com/th/id/R.cf9d100ed0adc2728f55132f360dcf2d?rik=MHIUVkIob94Hog&riu=http%3a%2f%2fwww.totallyrepair.in%2fblog%2fwp-content%2fuploads%2f2017%2f07%2fWashing-Machine-Repair-2.jpg&ehk=7wXXVQfBKjTui7TZd34wDxTAvTPzBNDkECGwGiPkNkg%3d&risl=&pid=ImgRaw&r=0",
      },
      {
        id: 603,
        name: "Microwave Repair",
        description: "Fix microwave issues such as heating problems, door malfunctions, or electrical faults.",
        price: 799,
        image: "https://fixappliances.ca/wp-content/uploads/2019/02/wichita-ks-microwave-repair-900x506.jpg",
      },
      {
        id: 604,
        name: "Oven Repair",
        description: "Repair or replace faulty oven components, including heating elements and thermostats.",
        price: 699,
        image: "https://th.bing.com/th/id/OIP._dZqGHm7UZHln56PQ_7WHAHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 605,
        name: "Dishwasher Repair",
        description: "Fix dishwasher issues like poor cleaning, water drainage problems, or electrical faults.",
        price: 899,
        image: "https://th.bing.com/th/id/OIP.gdNx5l0FGzykby_lkv--uwHaEc?rs=1&pid=ImgDetMain",
      },
    ],
    acRepair: [
      {
        id: 701,
        name: "AC Gas Refill",
        description: "Refill refrigerant gas to restore cooling efficiency in your AC.",
        price: 499,
        image: "https://th.bing.com/th/id/OIP.I-NL05OL7wSFjyUUgLV7ggAAAA?rs=1&pid=ImgDetMain",
      },
      {
        id: 702,
        name: "AC Cleaning",
        description: "Deep cleaning of AC units, including filters, coils, and ducts, for better performance.",
        price: 599,
        image: "https://i.ytimg.com/vi/s6NHxfKUkUo/maxresdefault.jpg",
      },
      {
        id: 703,
        name: "AC Installation",
        description: "Professional installation of new AC units, including wiring and testing.",
        price: 799,
        image: "https://2.bp.blogspot.com/-oZVO2KglJCg/WiuOYa21qWI/AAAAAAAAA00/MD55a2cE-kcYxoh6qJxxB44ObBUPU-ijgCLcBGAs/s1600/air-conditioning-installation.jpg",
      },
      {
        id: 704,
        name: "AC Repair",
        description: "Diagnose and fix AC issues like cooling problems, strange noises, or electrical faults.",
        price: 699,
        image: "https://th.bing.com/th/id/OIP.XpkOHhJt56NWd3FnR6a8_QHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 705,
        name: "AC Maintenance",
        description: "Regular maintenance to ensure optimal performance and longevity of your AC.",
        price: 899,
        image: "https://th.bing.com/th/id/OIP.cvzeYeCg5LyTG3WyopDqjwHaE8?rs=1&pid=ImgDetMain",
      },
    ],
    waterPurifierRepair: [
      {
        id: 801,
        name: "Filter Replacement",
        description: "Replace old or clogged water purifier filters.",
        price: 499,
        image: "https://images-na.ssl-images-amazon.com/images/I/71MIQqwP8gL._SL1500_.jpg",
      },
      {
        id: 802,
        name: "UV Lamp Replacement",
        description: "Replace faulty UV lamps in water purifiers.",
        price: 599,
        image: "https://cdn.shopclues.com/images1/detailed/89219/139483189-89219982-1530003784.jpg",
      },
      {
        id: 803,
        name: "General Maintenance",
        description: "Regular maintenance to ensure optimal performance.Ensure your water heater runs efficiently.",
        price: 799,
        image: "https://th.bing.com/th/id/OIP.7-nMfbNpB8gwYatD19cvgwHaE8?rs=1&pid=ImgDetMain",
      },
      {
        id: 804,
        name: "Motor Repair",
        description: "Repair or replace water purifier motors.",
        price: 699,
        image: "https://i.ytimg.com/vi/uHbjiHi76js/maxresdefault.jpg",
      },
      {
        id: 805,
        name: "Leakage Repair",
        description: "Fix water leakage issues in purifiers.",
        price: 899,
        image: "https://5.imimg.com/data5/SELLER/Default/2022/12/WT/CB/NR/132537498/water-heater-500x500.jpg",
      },
    ],
  };

  const activeSearchTerm = searchQuery || localSearchTerm;

  const filteredServices = servicesData[serviceType]?.filter(service =>
    service.name.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(activeSearchTerm.toLowerCase())
  ) || [];

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addToCart = async (service) => {
    try {
      console.log("Original service image:", service.image);
      console.log("Service object received:", service);
  
      // 1. Get service ID (with validation)
      const serviceId = service.serviceId || service.id;
      if (!serviceId) throw new Error("Invalid service: missing ID");
  
      // 2. Get auth and session data
      const token = localStorage.getItem("Token");
      const userData = JSON.parse(localStorage.getItem("userData") || "null");
      let sessionId = localStorage.getItem("sessionId");
  
      if (userData) {
        console.log("User data is available:", userData);
      } else {
        console.log("No user data found.");
      }
  
      // 3. Create/update local cart
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(
        item => item.serviceId === serviceId.toString()
      );
  
      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        updatedCart.push({
          serviceId: serviceId.toString(),
          id: serviceId.toString(), // Add this line
          name: service.name,
          price: service.price,
          quantity: 1,
          image: service.image,
          description: service.description
        });
      }
      setCart(updatedCart);
  
      // 4. Generate session ID if needed (for guests)
      if (!userData?.id && !sessionId) {
        sessionId = uuidv4();
        localStorage.setItem("sessionId", sessionId);
      }
  
      // 5. Prepare API payload
      const payload = {
        serviceId: serviceId.toString(),
        name: service.name,
        price: Number(service.price),
        quantity: 1,
        image: service.image,
        description: service.description,
        userId: userData?.id || null,
        sessionId
      };
  
      // 6. Prepare headers
      const headers = {
        "Content-Type": "application/json",
        "x-session-id": sessionId
      };
  
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      // 7. Make API request
      const response = await fetch("http://localhost:5000/api/carts/add", {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      console.log("API Response:", data);
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to add item');
      }
  
      // 8. Sync with server response
      if (data.cart) {
        setCart(data.cart.items || []);
      }
  
    } catch (error) {
      console.error('Cart Error:', error.message);
      setCart(cart); // revert local UI if needed
      alert(error.message.includes("login")
        ? "Please login to save your cart"
        : "Failed to add item. Please try again.");
    }
  };
  
  const changeCartQuantity = async (serviceId, amount) => {
    try {
      // Find the item in cart
      const item = cart.find(i => i.serviceId === serviceId);
      if (!item) throw new Error("Service not found in cart");
  
      // Calculate new quantity
      const newQuantity = item.quantity + amount;
      
      // Prepare payload
      const userData = JSON.parse(localStorage.getItem("userData") || null);
      const sessionId = localStorage.getItem("sessionId");
      const token = localStorage.getItem("Token");
  
      const payload = {
        serviceId: serviceId.toString(),
        name: item.name,
        price: item.price,
        quantity: Math.abs(amount),
        image: item.image,
        description: item.description,
        userId: userData?.id || null,
        sessionId
      };
  
      const headers = {
        "Content-Type": "application/json",
        "x-session-id": sessionId
      };
  
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
  
      // Determine endpoint based on operation
      const endpoint = amount > 0
        ? "http://localhost:5000/api/carts/add"
        : "http://localhost:5000/api/carts/remove";
  
      // Make API call
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
  
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update cart");
      }
  
      // Update local state based on server response
      if (data.cart?.items) {
        setCart(data.cart.items);
      } else {
        // Fallback: Update local state manually
        const updatedCart = cart.map(item => {
          if (item.serviceId === serviceId) {
            return {
              ...item,
              quantity: newQuantity > 0 ? newQuantity : item.quantity
            };
          }
          return item;
        }).filter(item => item.quantity > 0);
        
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Cart update failed:", error.message);
      alert(error.message || "Failed to update cart.");
    }
  };

  const renderCartItem = (item) => (
    <li key={item.serviceId} className="cart-item">
      <div className="item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">₹{item.price}</span>
      </div>
      <div className="item-quantity">
        <button
          onClick={() => changeCartQuantity(item.serviceId, -1)}
          className="quantity-btn"
          aria-label="Decrease quantity"
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span className="quantity-text">Quantity: {item.quantity}</span>
        <button
          onClick={() => changeCartQuantity(item.serviceId, 1)}
          className="quantity-btn"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button
          onClick={() => changeCartQuantity(item.serviceId, -item.quantity)}
          className="remove-btn"
          aria-label="Remove item"
        >
          Remove
        </button>
      </div>
    </li>
  );


  return (
    <div className="plumber-page">
      <div className="main-content">
        <div className="service-list">
          <h2 className="Plumber-section">
            Find Your Right {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
          </h2>
          <div>
           
            {/* Other content */}
          </div>
          {/* Local search input for this page */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search services..."
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="services-grid">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div key={service.id} className="service-card">
                  <img src={service.image} alt={service.name} />
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <p className="price">₹{service.price}</p>
                  <button onClick={() => addToCart(service)}>Add to Cart</button>
                </div>
              ))
            ) : (
              <p className="no-results">No services found matching your search.</p>
            )}
          </div>
        </div>

        <div className="cart-section">
          <h3>Your Cart</h3>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="cart-items-list">
              {cart.map(renderCartItem)}
            </ul>
          )}
          <div className="total-price">
            <strong>Total:</strong> ₹{totalPrice}
          </div>
          <button
            className="checkout-btn"
            disabled={cart.length === 0}
          >
            <Link
              to="/cart"
              className="checkout-btn"
            >
              Proceed to Cart
            </Link>
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServicePage;