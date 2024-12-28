import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="landing-container text-center">
      <h1 className="landing-title">Bulls and Cows Game</h1>
      <img src="landing.jpg" alt="Bulls and Cows" className="landing-image" />
      <div className="landing-buttons mt-3">
        <Link to="/login" className="btn btn-primary mb-3">Login</Link>
        <a href="https://github.com/your-repo" className="btn btn-secondary">
          <i className="bi bi-github"></i> Contribute to the project
        </a>
      </div>
    </div>
  );
}

export default Home;
