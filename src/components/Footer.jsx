import React from "react";
import { Link } from "react-router-dom"; // ✅ Correct Import

const Footer = ({ openLoginModal }) => { // ✅ Accept openModal as a prop
    return (
        <footer id="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>About Us</h3>
                    <p>We connect you with trusted professionals for home services. Book skilled workers for plumbing, electrical work, carpentry, and more.</p>
                </div>
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            <i className="fas fa-home"></i> Home
                        </Link></li>
                        <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                            <i className="fas fa-cogs"></i> Services
                        </Link></li>
                        <li> <a href="/" onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("footer").scrollIntoView({ behavior: "smooth" });
                        }}>
                            Contact
                        </a></li>
                        <li><Link to="/helper">Register as a helper</Link></li>
                        <li>
                        <a
                                href="/Login"
                                onClick={(e) => {
                                    e.preventDefault();
                                    openLoginModal(); // Changed from openModal("Login")
                                }}
                            >
                                
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Our Services</h3>
                    <ul>
                        <li><Link to="/services/plumber">Plumbing</Link></li>
                        <li><Link to="/services/electrician">Electrical</Link></li>
                        <li><Link to="/services/carpenter">Carpentry</Link></li>
                        <li><Link to="/services/painter">Painting</Link></li>
                        <li><Link to="/services/bikeRepair">Bike Repair</Link></li>
                        <li><Link to="/services/applianceRepair">Appliance Repair</Link></li>
                        <li><Link to="/services/acRepair">AC Repair</Link></li>
                        <li><Link to="/services/waterPurifierRepair">Water Purifier Repair</Link></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Contact Us</h3>
                    <p>Email: Lokesh20127050@gmail.com</p>
                    <p>Phone: +91 7231990433</p>
                    <p>Address: 123, City Street, Your City</p>
                </div>
                <div className="footer-column">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://www.twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a href="https://www.instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a href="https://www.linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 FindMyHelper. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
