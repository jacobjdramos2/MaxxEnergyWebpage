import React from "react";
import "./Footer.css";
import facebookIcon from "../assets/images/icons8-facebook-30.png";
import twitterIcon from "../assets/images/icons8-x-30.png";
import linkedinIcon from "../assets/images/icons8-linkedin-48.png";
import instagramIcon from "../assets/images/icons8-instagram-30.png";
import logo from "..//assets/images/navbar-logo-yellow.jpeg";
// import logo from "..//assets/images/Branding/MAXX-Energy-White.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left - Logo */}
        <div className="footer-column footer-logo">
          <img src={logo} alt="MAXX Potential Logo" />
        </div>

        {/* Middle - Newsletter */}
        <div className="footer-column footer-middle">
          <div className="footer-links">
            <a href="/blog">SUCCESS STORIES</a>
            <a href="/work-at-maxx">WORK AT MAXX</a>
          </div>
          <p className="footer-text">
            Stay connected. Get the latest on mentorship, skill-building, and Apprentice success stories.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email Address" required />
            <button type="submit">SIGN UP</button>
          </form>
          <p className="footer-copy">© 2025 MAXX Potential LLC</p>
        </div>

        {/* Right - Social & Contact */}
        <div className="footer-column footer-right">
          <div className="social-icons">
            <a href="https://twitter.com/MaxxTechnology" target="_blank" rel="noreferrer">
              <img src={twitterIcon} alt="Twitter" />
            </a>
            <a href="https://www.facebook.com/maxxpotentialllc/" target="_blank" rel="noreferrer">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a href="https://www.linkedin.com/company/maxx-potential" target="_blank" rel="noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/maxxpotential/" target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
          </div>
          <p className="footer-text">
            MAXX Potential Apprentices are nationwide and ready to assist. Our major hubs are in Virginia and North Carolina.  
            <br />
            <strong>Call: <a href="tel:866-525-6299">866-525-MAXX (6299)</a></strong>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
