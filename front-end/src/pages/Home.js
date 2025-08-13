import React from "react";
import "./Home.css";
import logo from "../assets/images/home-logo.png";

function Home() {
  return (
    <main className="home-container">
      <section className="home-section logo-section">
        <img src={logo} alt="MAXX Energy Logo" className="home-logo" />
      </section>
      <h1>MAXX Energy Data Access Portal</h1>
      <p>
        Welcome to the Enterprise Data Access Portal.  
        This platform allows authorized MAXX Energy stakeholders to securely view and analyze
        solar plant generation data in real-time.
      </p>
      <section className="home-section">
        <h2>Quick Links</h2>
        <ul>
          <li><a href="/reports">View generation reports</a></li>
          <li><a href="/downloads">Download data exports</a></li>
          <li><a href="/about">Learn more about MAXX Energy</a></li>
        </ul>
      </section>

    </main>
  );
}

export default Home;
