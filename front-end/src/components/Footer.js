import React from "react";
import "./Footer.css";
import facebookIcon from "../assets/images/icons8-facebook-30.png";
import twitterIcon from "../assets/images/icons8-x-30.png";
import linkedinIcon from "../assets/images/icons8-linkedin-48.png";
import instagramIcon from "../assets/images/icons8-instagram-30.png";
import logo from "../assets/images/navbar-logo-yellow.jpeg";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left - Logo */}
        <div className="footer-column footer-logo">
          <img src={logo} alt="MAXX Energy Logo" />
        </div>

        {/* Middle - Links & Newsletter */}
        <div className="footer-column footer-middle">
          <div className="footer-links">
            <a href="/dashboard">DASHBOARD</a>
            <a href="/about">ABOUT MAXX ENERGY</a>
          </div>
          <p className="footer-text">
            Stay informed on the latest solar energy insights, plant performance updates, and stakeholder reports.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email Address" required />
            <button type="submit">SUBSCRIBE</button>
          </form>
          <p className="footer-copy">© 2025 MAXX Energy. All rights reserved.</p>
        </div>

        {/* Right - Social & Contact */}
        <div className="footer-column footer-right">
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
          </div>
          <p className="footer-text">
            MAXX Energy operates nationwide with solar plants across multiple regions.  
            <br />
            <strong>Contact: <a href="mailto:info@maxxenergy.com">info@maxxenergy.com</a></strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
