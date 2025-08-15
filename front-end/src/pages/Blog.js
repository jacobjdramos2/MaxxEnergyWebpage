import React from "react";
import { Link } from 'react-router-dom';

function Blog() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>MAXX Energy Blog</h1>
      <p>Stay updated with the latest news, trends, and insights from the solar energy industry.</p>

      <div style={{ marginTop: "30px", maxWidth: "700px", margin: "0 auto" }}>
        <article style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h2>How Solar Energy is Changing the World</h2>
          <p>Discover how solar technology is shaping a sustainable future...</p>
          <Link to="/blog/solar-energy" style={{ color: "#496DA7", textDecoration: "none", fontWeight: "bold" }}>
            Read More
          </Link>
        </article>

        <article style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
          <h2>MAXX Energy’s 2025 Goals</h2>
          <p>Learn about our vision and upcoming projects for the next year...</p>
          <Link to="/blog/2025-goals" style={{ color: "#496DA7", textDecoration: "none", fontWeight: "bold" }}>
            Read More
          </Link>
        </article>
      </div>
    </div>
  );
}

export default Blog;
