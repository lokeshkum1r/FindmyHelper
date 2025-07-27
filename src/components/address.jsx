import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/address.css';

const statesOfIndia = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
];

const tier1Cities = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat'
];

const AddressForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    floor: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    latitude: '',
    longitude: '',
    mapsLink: '',
  });

  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-1);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = savedUser?.token;

    if (token) {
      fetchAddresses(token);
    }
  }, []);

  const fetchAddresses = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedAddresses(data);
      } else {
        console.error("Failed to fetch addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    if (selectedAddressIndex !== -1) {
      setForm(savedAddresses[selectedAddressIndex]);
    }
  }, [selectedAddressIndex, savedAddresses]);

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(form.phone)) newErrors.phone = "Enter a valid 10-digit phone number";
    if (!form.street.trim()) newErrors.street = "Street address is required";
    if (!form.floor.trim()) newErrors.floor = "Floor number is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.zip.trim()) newErrors.zip = "Zip code is required";
    if (!/^\d{5,6}$/.test(form.zip)) newErrors.zip = "Enter a valid zip code";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
    setSelectedAddressIndex(-1);
    setSaveSuccess(false);
  };

  const handleStateSelect = (e) => {
    setForm(prev => ({ ...prev, state: e.target.value, city: '' }));
    setErrors(prev => ({ ...prev, state: undefined }));
    setSaveSuccess(false);
  };

  const handleSaveAddress = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Check for duplicate address
    const isDuplicate = savedAddresses.some(
      (addr) =>
        addr.fullName === form.fullName &&
        addr.phone === form.phone &&
        addr.street === form.street &&
        addr.floor === form.floor &&
        addr.city === form.city &&
        addr.state === form.state &&
        addr.zip === form.zip
    );

    if (isDuplicate) {
      alert("This address is already saved.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = savedUser?.token;

    if (!token) {
      alert("Please log in to save your address.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const savedResponse = await response.json();
        const newAddresses = [...savedAddresses, savedResponse.address || form]; // use the one with _id

        setSavedAddresses(newAddresses);
        localStorage.setItem("savedAddresses", JSON.stringify(newAddresses));
        setSaveSuccess(true);
        setSelectedAddressIndex(-1);
      } else {
        const err = await response.json();
        console.error("Failed to save address:", err.message);
      }
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const token = savedUser?.token;

    if (!token) {
      alert("Please log in to delete your address.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setSavedAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
      } else {
        const err = await response.json();
        console.error("Failed to delete address:", err.message);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  // Prevent delete button from triggering save
  const handleDeleteClick = (e, addressId) => {
    e.stopPropagation();
    handleDeleteAddress(addressId);
  };

  const handleBookHelper = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    const { cart, totalPrice, gst, grandTotal } = location.state || {};
    if (!cart || !totalPrice || !gst || !grandTotal) {
      alert("Missing cart or pricing details. Please check your cart and try again.");
      return;
    }
  
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = savedUser?.token;
      const userId = savedUser?.id;
  
      if (!token) {
        alert("You need to be logged in to place an order.");
        return;
      }
  
      const generateInvoiceNumber = () => {
        const prefix = 'INV';
        const timestamp = Date.now().toString().slice(-6);
        const randomNum = Math.floor(Math.random() * 9000) + 1000;
        return `${prefix}-${timestamp}-${randomNum}`;
      };
  
      const orderData = {
        userId,
        invoiceNo: generateInvoiceNumber(),
        items: cart.map(item => ({
          serviceId: item.id || item._id, 
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          description: item.description || '',
          image: item.image || ''
        })),
        address: {
          fullName: form.fullName,
          street: form.street,
          floor: form.floor,
          city: form.city,
          state: form.state,
          zip: form.zip,
          phone: form.phone
        },
        totals: {
          subtotal: totalPrice,
          discount: 100,
          gst: gst,
          delivery: 0,
          grandTotal: grandTotal
        },
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        status: 'pending'
      };
  
      console.log("Order Data to be sent:", orderData);
  
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error Data:", errorData);
        throw new Error(errorData.message || "Failed to create order");
      }
  
      const data = await res.json();
      // Navigate to order receipt page without passing state data
      navigate("/order-receipt");
      console.log("Received order response:", data);
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };
  
  const detectLiveLocation = async () => {
    try {
      setIsDetectingLocation(true);
  
      if (!navigator.geolocation) {
        throw new Error("Geolocation not supported by this browser.");
      }
  
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
  
        const apiKey = "AIzaSyB_FlEvUdEo2B15j8z6P8NjPgb1ebyxGW0";
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
  
        const data = await response.json();

        if (data.status === "OK") {
          const addressComponents = data.results[0]?.address_components || [];
          const getComponent = (types) =>
            addressComponents.find((comp) => types.every((type) => comp.types.includes(type)))?.long_name || '';

          setForm(prev => ({
            ...prev,
            latitude,
            longitude,
            mapsLink: `https://www.google.com/maps?q=${latitude},${longitude}`,
            city: getComponent(["locality"]) || getComponent(["administrative_area_level_2"]),
            state: getComponent(["administrative_area_level_1"]),
            zip: getComponent(["postal_code"]),
            street: getComponent(["route"]),
          }));
        } else {
          throw new Error("Failed to retrieve address from coordinates");
        }
      }, (error) => {
        throw new Error("Geolocation error: " + error.message);
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    handleSaveAddress();
    setSaveSuccess(true);
  };

  return (
    <div className="address-form-container">
      <h2>Address Information</h2>

      {saveSuccess && (
        <div className="success-message">
          <h3>Address saved successfully!</h3>
        </div>
      )}

      <div className="live-location-section">
        <button
          type="button"
          onClick={detectLiveLocation}
          disabled={isDetectingLocation}
          className="detect-location-button"
        >
          {isDetectingLocation ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Detecting Location...
            </>
          ) : (
            <>
              <i className="fas fa-map-marker-alt"></i> Detect Live Location
            </>
          )}
        </button>
        {locationError && <p className="error">{locationError}</p>}
      </div>

      <form className="address-form" onSubmit={handleSubmit} noValidate>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="address-input"
            placeholder="Enter your full name"
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="address-input"
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        {/* Street / Shipping Address */}
        <div className="form-group">
          <label htmlFor="street">Street / Shipping Address:</label>
          <input
            id="street"
            name="street"
            value={form.street}
            onChange={handleChange}
            className="address-input"
            placeholder="Enter street address"
          />
          {errors.street && <span className="error">{errors.street}</span>}
        </div>

        {/* Floor */}
        <div className="form-group">
          <label htmlFor="floor">Floor / Flat Number:</label>
          <input
            id="floor"
            name="floor"
            value={form.floor}
            onChange={handleChange}
            className="address-input"
            placeholder="Enter floor or flat number"
          />
          {errors.floor && <span className="error">{errors.floor}</span>}
        </div>

        {/* Zip */}
        <div className="form-group">
          <label htmlFor="zip">Zip Code:</label>
          <input
            id="zip"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            className="address-input"
            placeholder="Enter 5 or 6 digit zip code"
          />
          {errors.zip && <span className="error">{errors.zip}</span>}
        </div>

        {/* State */}
        <div className="form-group">
          <label htmlFor="state">State:</label>
          <select
            id="state"
            name="state"
            value={form.state}
            onChange={handleStateSelect}
            className="address-select"
          >
            <option value="">Select State</option>
            {statesOfIndia.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className="error">{errors.state}</span>}
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <select
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            className="address-select"
          >
            <option value="">Select City</option>
            {tier1Cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          {errors.city && <span className="error">{errors.city}</span>}
        </div>

        {/* Location Link */}
        {form.mapsLink && (
          <div className="form-group">
            <label>Location Link:</label>
            <a href={form.mapsLink} target="_blank" rel="noopener noreferrer" className="maps-link">
              View on Google Maps
            </a>
          </div>
        )}

        {savedAddresses.length > 0 && (
          <div className="saved-addresses">
            <h3>Saved Addresses:</h3>
            <ul>
              {savedAddresses.map((addr, index) => (
                <li key={addr._id || index}>
                  <div onClick={() => setSelectedAddressIndex(index)}>
                    {addr.fullName}, {addr.street}, {addr.city}, {addr.state}, {addr.zip}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, addr._id)}
                    className="delete-address-button"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Buttons */}
        <div className="button-group">
          <button type="button" onClick={handleSaveAddress} className="save-address-button">
            Save Address
          </button>
          <button type="button" onClick={handleBookHelper} className="book-helper-button">
            Book a Helper
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;