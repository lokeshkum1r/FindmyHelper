import React, { useState, useEffect } from "react";
import "../styles/profile.css";

const Profile = ({ user, onLogout, onUserUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || "",
        gender: user.gender || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (formData.phone && !/^[\d\s+-]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 13 || formData.age > 120)) {
      newErrors.age = "Age must be between 13 and 120";
    }
    
    if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
      if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword = "Must contain at least one uppercase letter";
      } else if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = "Must contain at least one number";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");
  
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) throw new Error("Authentication required");

      const response = await fetch("http://localhost:5000/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          gender: formData.gender,
          ...(formData.currentPassword && {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");

      const updatedUser = { ...user, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setEditMode(false);
      
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setErrors({});
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      age: user.age || "",
      gender: user.gender || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const displayValue = (value) => value || <span className="not-provided">Not provided</span>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2 className="profile-title">My Profile</h2>
        {!editMode ? (
          <button 
            className="btn-edit"
            onClick={() => setEditMode(true)}
          >
            <i className="icon-edit"></i> Edit Profile
          </button>
        ) : (
          <button 
            className="btn-cancel"
            onClick={cancelEdit}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>

      {successMessage && (
        <div className="alert-success">
          <i className="icon-check"></i> {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="alert-error">
          <i className="icon-error"></i> {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>First Name</label>
          {editMode ? (
            <>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "input-error" : ""}
                placeholder="Enter first name"
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.firstName)}</p>
          )}
        </div>

        <div className="form-group">
          <label>Last Name</label>
          {editMode ? (
            <>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "input-error" : ""}
                placeholder="Enter last name"
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.lastName)}</p>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>
          {editMode ? (
            <>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
                placeholder="Enter email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.email)}</p>
          )}
        </div>

        <div className="form-group">
          <label>Phone</label>
          {editMode ? (
            <>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "input-error" : ""}
                placeholder="Enter phone number"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.phone)}</p>
          )}
        </div>

        <div className="form-group">
          <label>Age</label>
          {editMode ? (
            <>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                max="120"
                className={errors.age ? "input-error" : ""}
                placeholder="Enter age"
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.age)}</p>
          )}
        </div>

        <div className="form-group">
          <label>Gender</label>
          {editMode ? (
            <>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? "input-error" : ""}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </>
          ) : (
            <p className="profile-info">{displayValue(formData.gender)}</p>
          )}
        </div>

        {editMode && (
          <div className="password-section">
            <h3 className="section-title">Change Password</h3>
            <p className="section-description">Leave blank to keep current password</p>
            
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={errors.currentPassword ? "input-error" : ""}
                placeholder="Enter current password"
              />
              {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={errors.newPassword ? "input-error" : ""}
                placeholder="At least 8 characters"
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>
        )}

        {editMode && (
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-save"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="icon-spinner spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="icon-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {!editMode && (
        <div className="profile-actions">
          <button className="btn-logout" onClick={() => onLogout()}>
            <i className="icon-logout"></i> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;