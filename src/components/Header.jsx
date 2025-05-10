import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  function handleHomeClick() {
    navigate('/');
    window.location.reload();
  }

  return (
    <header>
      <h1>🌟 Personality Quiz</h1>
      <nav>
        <Link to="/" onClick={handleHomeClick}>Home</Link>
        <Link to="/quiz">Take the Quiz</Link>
      </nav>
    </header>
  );
}
