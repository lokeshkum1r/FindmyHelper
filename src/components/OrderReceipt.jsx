import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/OrderReceipt.css";
import LoginModal from "./LoginModal";
import Footer from "../components/Footer";

const OrderReceipt = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cart, orderInfo } = location.state || {};
  const [isPolling, setIsPolling] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [helperDetails, setHelperDetails] = useState(null);
  
  // Location state
  const [userLocation, setUserLocation] = useState(null);
  const [locationShared, setLocationShared] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const [orderData, setOrderData] = useState(orderInfo || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const sendTelegramRequest = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:5000/api/workers/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          orderId: orderData._id,
          items: orderData.items,
          address: orderData.address,
          totals: orderData.totals,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Telegram notifications sent:", result.message);
    } catch (error) {
      console.error("Error sending Telegram notifications:", error);
    }
  }, [user?.token, orderData]);
  
  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationError(null);
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred";
        }
        setLocationError(errorMessage);
        setUserLocation(null);
      }
    );
  };

  // Share location with helper
  const shareLocationWithHelper = async () => {
    if (!userLocation || !helperDetails || !helperDetails.helperChatId) {
      setLocationError("Cannot share location at this time");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:5000/api/workers/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          orderId: orderData._id,
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          workerChatId: helperDetails.helperChatId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setLocationShared(true);
      }
    } catch (error) {
      console.error("Error sharing location:", error);
      setLocationError("Failed to share location");
    }
  };

  useEffect(() => {
    if (orderData && orderData._id && orderData.status === "pending" && !isPolling) {
      sendTelegramRequest();
      setIsPolling(true);
    }
    
    // Get user location when component mounts
    getUserLocation();
  }, [orderData, isPolling, sendTelegramRequest]);
  
  useEffect(() => {
    if (!orderData || !orderData._id) return;
  
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderData._id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user.token}`
          }
        });
        const data = await res.json();
  
        // Only update if status changed to accepted
      if (data.status === "accepted" && data.helperName && (!orderData.helperName || orderData.status !== "accepted")) {
        console.log("Order accepted:", data.status);
          
          // Update state with new data
          setOrderData(data);
          setHelperDetails({
            name: data.helperName,
            phone: data.helperPhone,
            rating: data.helperRating,
            photo: data.helperPhoto,
            eta: data.helperETA,
            helperChatId: data.helperChatId,
            telegramUsername: data.helperTelegramUsername
          });
          setIsAccepted(true);
          setIsPolling(false); 
  
          // Clear interval and stop polling
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error polling order status:", error);
      }
    }, 5000);
  
    // Cleanup function to clear interval when the component unmounts or when dependencies change
    return () => clearInterval(interval);
  }, [user?.token, orderData]); // Dependencies
  

  const getOrderIdFromURL = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
  }, []);

  const fetchOrderById = useCallback(async (token, orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("user");
        setShowLoginModal(true);
        setIsLoading(false);
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const order = data.order;
      
      // Check if order is already accepted
      if (order.status === "accepted" && order.helperName) {
        setHelperDetails({
          name: order.helperName,
          phone: order.helperPhone,
          rating: order.helperRating,
          photo: order.helperPhoto,
          eta: order.helperETA,
          helperChatId: order.helperChatId,
          telegramUsername: order.helperTelegramUsername
        });
        setIsAccepted(true);
      }
      
      setOrderData(order);
      setIsLoading(false);
      return order;
    } catch (error) {
      console.error("Fetch order by ID failed:", error);
      setIsLoading(false);
      return null;
    }
  }, []);

  const fetchMostRecentOrder = useCallback(async (token, userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });      
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Check if most recent order is accepted
        if (sorted[0].status === "accepted" && sorted[0].helperName) {
          setHelperDetails({
            name: sorted[0].helperName,
            phone: sorted[0].helperPhone,
            rating: sorted[0].helperRating,
            photo: sorted[0].helperPhoto,
            eta: sorted[0].helperETA,
            helperChatId: sorted[0].helperChatId,
            telegramUsername: sorted[0].helperTelegramUsername
          });
          setIsAccepted(true);
        }
        
        setOrderData(sorted[0]);
        setIsLoading(false);
        return sorted[0];
      }
    } catch (error) {
      console.error("Fetch most recent order failed:", error);
    }
    setIsLoading(false);
    return null;
  }, []);

  const fetchRecentOrders = useCallback(async (token, userId, excludeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      const filtered = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter(o => o._id !== excludeId)
        .slice(0, 4);
      setRecentOrders(filtered);
    } catch (error) {
      console.error("Error fetching recent orders:", error);
    }
  }, []);

  const loadOrdersData = useCallback(async (token, userId) => {
    const id = getOrderIdFromURL();
    let order = null;
    if (id) {
      order = await fetchOrderById(token, id);
    } else {
      order = await fetchMostRecentOrder(token, userId);
    }
    if (order) {
      await fetchRecentOrders(token, userId, order._id);
    }
  }, [getOrderIdFromURL, fetchOrderById, fetchMostRecentOrder, fetchRecentOrders]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const userObj = stored ? JSON.parse(stored) : null;
    if (!userObj?.token || !userObj?.id) {
      setShowLoginModal(true);
      setIsLoading(false);
      return;
    }
    setUser(userObj);
    loadOrdersData(userObj.token, userObj.id);
  }, [loadOrdersData]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setShowLoginModal(false);
    loadOrdersData(userData.token, userData._id);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    if (!user) navigate("/");
  };

  const viewOrderDetails = (order) => {
    setOrderData(order);
    window.history.pushState(null, "", `?id=${order._id}`);
    if (user?.token && user?.id) {
      fetchRecentOrders(user.token, user.id, order._id);
    }
  };

  const formatDate = date => new Date(date).toLocaleDateString();

  if (isLoading) return <div className="loading-spinner">Loading order details...</div>;

  if (!user && showLoginModal) {
    return (
      <div className="order-receipt">
        <LoginModal
          closeModal={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
          switchToSignup={() => {
            closeLoginModal();
            navigate("/", { state: { showSignup: true } });
          }}
        />
      </div>
    );
  }

  // Add this condition to check if no order is found
  if (!orderData) {
    return (
      <div className="order-success-page">
        <div className="order-success-container">
          <div className="no-order-found">
            <h2>No Order Found</h2>
            <p>We couldn't find any order details to display.</p>
            <button 
              className="back-to-home-button"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
            
            {recentOrders.length > 0 && (
              <div className="recent-orders-section">
                <h3>Your Recent Orders</h3>
                <div className="recent-orders-list">
                  {recentOrders.map((order) => (
                    <div key={order._id} className="recent-order-card" onClick={() => viewOrderDetails(order)}>
                      <p>Order #{order._id.slice(-6)}</p>
                      <p>Status: {order.status}</p>
                      <p>Date: {formatDate(order.createdAt)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="order-status">
          {!isAccepted ? (
            <div className="waiting-message">
              <h2>Finding a helper near you...</h2>
              <p>Please wait while we connect you with someone.</p>
              <div className="finding-animation">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          ) : (
            <div className="helper-details">
              <h2>Your request has been accepted!</h2>
              <div className="helper-info">
                {helperDetails.photo && (
                  <img src={helperDetails.photo} alt="Helper" className="helper-photo" />
                )}
                <div className="helper-text">
                  <h3>{helperDetails.name}</h3>
                  <p><strong>Phone:</strong> {helperDetails.phone}</p>
                  <p><strong>Rating:</strong> {helperDetails.rating}/5</p>
                  <p><strong>ETA:</strong> {helperDetails.eta} minutes</p>
                  <div className="helper-actions">
                    <a href={`tel:${helperDetails.phone}`} className="call-button">
                      Call Helper
                    </a>
                    {helperDetails.telegramUsername && (
                      <a 
                        href={`https://t.me/${helperDetails.telegramUsername}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="telegram-button"
                      >
                        Message on Telegram
                      </a>
                    )}
                  </div>
                  
                  <div className="location-sharing">
                    <h4>Share Your Location</h4>
                    {locationError && (
                      <p className="location-error">{locationError}</p>
                    )}
                    {!userLocation && !locationError && (
                      <button 
                        className="get-location-button"
                        onClick={getUserLocation}
                      >
                        Get My Location
                      </button>
                    )}
                    {userLocation && !locationShared && (
                      <button 
                        className="share-location-button"
                        onClick={shareLocationWithHelper}
                      >
                        Share Location with Helper
                      </button>
                    )}
                    {locationShared && (
                      <p className="location-shared-confirmation">
                        ✅ Location shared successfully with helper
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="order-summary">
          <div className="order-receipt">
            <h2>Order Details</h2>
            <div className="receipt-items">
              {(orderData.items || cart || []).map((item, index) => (
                <div className="receipt-item" key={index}>
                  <img src={item.image || "/placeholder.jpg"} alt={item.name} />
                  <div>
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p>Invoice No: {orderData?.invoiceNo || orderData?._id?.slice(-6)}</p>
              <p>Date: {orderData?.createdAt ? formatDate(orderData.createdAt) : new Date().toLocaleDateString()}</p>
              <p>Order Status: <span className={`status-${orderData?.status?.toLowerCase()}`}>{orderData?.status || "Pending"}</span></p>

              <div className="address-details">
                <h4>Shipping Address:</h4>
                <p>{orderData?.address?.fullName}</p>
                <p>
                  {orderData?.address?.street}, {orderData?.address?.floor}, {orderData?.address?.city}, {orderData?.address?.state} -{" "}
                  {orderData?.address?.zip}
                </p>
                <p>Phone: {orderData?.address?.phone}</p>
              </div>

              <div className="summary-breakdown">
                <p>Total: ₹{orderData?.totals?.subtotal || 0}</p>
                <p>Discount: ₹{orderData?.totals?.discount || 0}</p>
                <p>GST 18%: ₹{orderData?.totals?.gst || 0}</p>
                <p>Delivery Charges: {orderData?.totals?.delivery === 0 ? "Free" : `₹${orderData?.totals?.delivery}`}</p>
              </div>

              <h2 className="total-paid">TOTAL PAID: ₹{orderData?.totals?.grandTotal || 0}</h2>
              <p className="payment-method">Payment Method: {orderData?.paymentMethod || "COD"}</p>
              <p className="payment-status">Payment Status: {orderData?.paymentStatus || "Pending"}</p>
            </div>
          </div>
          {recentOrders.length > 0 && (
            <div className="recent-orders">
              <h3>Recent Orders</h3>
              {recentOrders.map((order) => (
                <div key={order._id} className="recent-order-card" onClick={() => viewOrderDetails(order)}>
                  <p>Order #{order._id.slice(-6)}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {formatDate(order.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderReceipt;