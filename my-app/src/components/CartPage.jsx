import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/CartPage.css";
import Footer from "../components/Footer";

const CartPage = ({ cart, removeFromCart, clearCart, openLoginModal }) => {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [totalPrice, setTotalPrice] = useState(0);
  const [gst, setGst] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const navigate = useNavigate(); // Initialize navigate
  const [imgError, setImgError] = useState({});
  const defaultImage = "/default-service.png"; // Add a default image in public folder


  useEffect(() => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);

    const calculatedGst = Math.round(total * 0.18);
    setGst(calculatedGst);

    const calculatedGrandTotal = total ;
    setGrandTotal(calculatedGrandTotal);
  }, [cart, gst]);

  const handleGoToAddress = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token || token === "null" || token === "") {
      alert("Please login to proceed with payment.");
      if (typeof openLoginModal === "function") {
        openLoginModal();
      }
      return;
    }

    navigate("/address", {
      state: {
        cart,
        totalPrice,
        gst,
        grandTotal,
      },
    }); // Pass cart and payment details to OrderReceipt
  };

     const renderCartItem = (item) => (
    <li key={item.serviceId || item.id} className="cart-item">
      <img
        src={imgError[item.id] ? defaultImage : item.image}
        alt={item.name}
        className="item-img"
        onError={(e) => {
          console.error("Image failed to load:", item.image);
          e.target.src = defaultImage;
          setImgError(prev => ({ ...prev, [item.serviceId || item.id]: true }));
        }}
      />
      <div className="item-info">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <p>₹{item.price.toFixed(2)}</p>
        <div className="quantity-controls">
         
          <span> Total Quantity{" -> "}{item.quantity}</span>
         
        </div>
      </div>
     
    </li>
  );
  return (
    <>
      <div className="cart-container">
        <div className="cart-left">
          <Link to="/" className="back-link">← Continue shopping</Link>
          <h3>Shopping cart</h3>
          <p>Your cart contains {cart.reduce((sum, item) => sum + item.quantity, 0)} items in total</p>
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty</p>
              <Link to="/" className="shop-btn">Browse Services</Link>
            </div>
          ) : (
            <ul className="cart-items">
              {cart.map(renderCartItem)}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-right">
            <h3>Payment details</h3>

            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="payment-method-content">
                  <span>Cash on Delivery</span>
                </div>
              </label>
            </div>

            <div className="totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="checkout-btn"
              onClick={handleGoToAddress}
              disabled={cart.length === 0}
            >
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default CartPage;
