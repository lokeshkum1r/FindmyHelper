import React, { useState } from "react";
import "../styles/login-modal.css";

const LoginModal = ({ closeModal, switchToSignup, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    if (email.trim() === "" || password.trim() === "") {
      setIsLoading(false);
      setError("Please enter both email and password");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const contentType = response.headers.get("content-type");
      const isJson = contentType && contentType.includes("application/json");
      const data = isJson ? await response.json() : null;
  
      if (response.ok) {
        console.log("Login successful, user data:", data.user); // Debugging
        alert(`Welcome back, ${data.user.firstName} ${data.user.lastName}`);
        localStorage.setItem("user", JSON.stringify({
          ...data.user,
          token: data.token,
        }));        
        onLoginSuccess({ ...data.user, token: data.token });
        closeModal();
      } else {
        console.log("Full error response:", { status: response.status, data });
        setError(data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-modal-content">
        <button
          className="login-close-btn"
          onClick={closeModal}
          aria-label="Close login modal"
        >
          <i className="fas fa-times close-icon"></i>
        </button>

        <h2 className="login-heading">Login</h2>
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <i className="fas fa-envelope input-icon"></i>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            <i className="fas fa-sign-in-alt"></i>
            {isLoading ? " Logging in..." : " Login"}
          </button>
        </form>

        <p className="login-register-text">
          Not registered?{" "}
          <span className="login-register-link" onClick={switchToSignup}>
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;