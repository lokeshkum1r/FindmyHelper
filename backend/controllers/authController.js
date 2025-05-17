const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const user = await User.create({ firstName, lastName, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
      expiresIn: '1d' 
    });

    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email
      },
      token
    });
  } catch (err) {
    res.status(400).json({ 
      message: err.message.includes('duplicate') 
        ? 'Email already exists' 
        : 'Registration failed'
    });
  }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Compare the provided password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
  
      // Generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      // Include lastName in the response
      res.status(200).json({
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName, // Include lastName here
          email: user.email,
          phone: user.phone,
          age:  user.age,
          gender: user.gender
        },
        token,
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
// Add this to your existing authController
exports.updateProfile = async (req, res) => {
    try {
      const { firstName, lastName, email, phone, age, gender, currentPassword, newPassword } = req.body;
  
      // Find the user by ID
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Update user fields
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.age = age || user.age;
      user.gender = gender || user.gender;
  
      // Handle password change
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: "Incorrect current password" });
        }
        user.password = await bcrypt.hash(newPassword, 10);
      }
  
      await user.save();
      res.status(200).json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  // controllers/authController.js

  exports.getCurrentUser = async (req, res) => {
    try {
      // The user is already attached to req by the authenticate middleware
      const user = req.user;
      
      // Return only necessary user data (excluding sensitive info)
      const userData = {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
        // Add other non-sensitive fields as needed
      };
      
      res.json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };