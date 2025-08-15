import './App.css';
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
// import About from './pages/About';
// import Blog from './pages/Blog';
// import BlogPost from './pages/BlogPost';
// import Contact from './pages/Contact';
// import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
