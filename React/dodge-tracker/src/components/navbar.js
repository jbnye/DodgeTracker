import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // We'll create this file next

const navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">Dodge Tracker</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/region/na">North America</Link>
        </li>
        <li>
          <Link to="/region/eu">Europe</Link>
        </li>
      </ul>
    </nav>
  );
};

export default navbar;
