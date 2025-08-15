import "./Home.css";
import dashboardMockup from "../assets/images/home-page-images/dashboard.png";
import React from "react";

function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section class="hero">
        <div class="hero-content">
          <h1>Your Gateway to Solar Plant Insights</h1>
          <p>Secure, real-time access to solar generation data for informed decision-making.</p>
          <div class="hero-buttons">
            <a href="#" class="btn btn-primary">Login</a>
            <a href="#" class="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="features">
        <div class="feature-card">
          <h3>Real-Time Data</h3>
          <p>Monitor solar output instantly from anywhere.</p>
        </div>
        <div class="feature-card">
          <h3>Role-Based Access</h3>
          <p>Customized views for executives, engineers, and analysts.</p>
        </div>
        <div class="feature-card">
          <h3>Data Visualization</h3>
          <p>Interactive charts and downloadable reports.</p>
        </div>
        <div class="feature-card">
          <h3>Secure Access</h3>
          <p>Top-level encryption and authentication.</p>
        </div>
      </section>

      {/* About Section */}
      <section class="about">
        <div class="about-text">
          <h2>About the Portal</h2>
          <p>
            The MAXX Energy Enterprise Data Access Portal empowers stakeholders with on-demand,
            secure access to solar plant generation data. Our intuitive interface and powerful 
            visualization tools allow you to make informed decisions quickly and effectively.
          </p>
        </div>
        <div class="about-image">
          <img src={dashboardMockup} alt="Dashboard preview" />
        </div>
      </section>

      {/* Call to Action Section */}
      <section class="final-cta final-cta-card">
        <h2>Access the data you need, when you need it — securely.</h2>
        <a href="#" class="btn btn-primary">Get Started</a>
      </section>
    </main>

  );
}

export default Home;
