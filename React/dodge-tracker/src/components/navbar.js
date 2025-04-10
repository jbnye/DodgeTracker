import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar.js";

const Navbar = ({ region, setRegion }) => {
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  //const dropdownRef = useRef(null);

  // const toggleDropdown = () => {
  //   setDropdownOpen(!dropdownOpen);
  // };

  // const handleRegionChange = (e) => {
  //   setRegion(e.target.value);
  //   setDropdownOpen(false);
  // };

  // const handleClickOutside = (event) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setDropdownOpen(false);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#27272a",
        padding: "0.5rem 1rem",
      }}
    >
      {/* Left section with logo and region dropdown */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/home"
          style={{
            color: "white",
            fontSize: "1.25rem",
            fontWeight: "bold",
            marginRight: "1rem",
            textDecoration: "none",
          }}
        >
          DodgeTracker
        </Link>
        <div>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{
              color: "white",
              backgroundColor: "#27272a",
              border: "1px solid #4b5563",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
            }}
          >
            <option value="NA">NA</option>
            <option value="EUW">EUW</option>
          </select>
        </div>
      </div>
      {/* Divider */}
      <div
        style={{
          borderLeft: "1px solid #4b5563",
          height: "2rem",
          margin: "0 1rem",
        }}
      ></div>

      <SearchBar />

      {/* Divider */}
      <div
        style={{
          borderLeft: "1px solid #4b5563",
          height: "2rem",
          margin: "0 1rem",
        }}
      ></div>

      {/* Links */}
      <Link
        to="/leaderboard"
        style={{
          color: "white",
          marginRight: "1rem",
          textDecoration: "none",
        }}
      >
        Leaderboard
      </Link>

      {/* Right section with About link */}
      <div style={{ marginLeft: "auto" }}>
        <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
