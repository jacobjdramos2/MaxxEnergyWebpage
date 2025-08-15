import React from "react";
import "./Navbar.css";
import logo from "../assets/images/navbar-logo-yellow.jpeg";

function Navbar() {
  return (
    <nav className="nav">
      <a href="/" className="logo-link">
        <img src={logo} alt="MAXX Energy Logo" className="logo-img" />
      </a>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;


// import React from "react";
// import { Link } from "react-router-dom";
// import "./Navbar.css";
// import logo from "../assets/images/navbar-logo-yellow.jpeg";

// function Navbar() {
//   return (
//     <nav className="nav">
//       <Link to="/" className="logo-link">
//         <img src={logo} alt="MAXX Energy Logo" className="logo-img" />
//       </Link>
//       <ul className="nav-links">
//         <li><Link to="/">Home</Link></li>
//         <li><Link to="/about">About</Link></li>
//         <li><Link to="/blog">Blog</Link></li>
//         <li><Link to="/contact">Contact</Link></li>
//       </ul>
//     </nav>
//   );
// }

// export default Navbar;
