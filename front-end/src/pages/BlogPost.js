import React from "react";
import { useParams, Link } from "react-router-dom";

function BlogPost() {
  const { slug } = useParams();

  let title = "";
  let content = "";

  // Simple switch for demo purposes; you can replace with dynamic data later
  switch(slug) {
    case "solar-energy":
      title = "How Solar Energy is Changing the World";
      content = "Full article content about solar energy and its impact on the world...";
      break;
    case "2025-goals":
      title = "MAXX Energy’s 2025 Goals";
      content = "Full article content about MAXX Energy’s vision and upcoming projects...";
      break;
    default:
      title = "Blog Post Not Found";
      content = "The blog post you are looking for does not exist.";
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
      <h1>{title}</h1>
      <p>{content}</p>
      <Link to="/blog" style={{ color: "#496DA7", textDecoration: "none", fontWeight: "bold" }}>
        ← Back to Blog
      </Link>
    </div>
  );
}

export default BlogPost;
