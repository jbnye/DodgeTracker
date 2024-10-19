import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("NA");
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOptionClick = (region) => {
    setSelectedRegion(region);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          to="/"
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

        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            style={{
              color: "white",
              display: "flex",
              alignItems: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {selectedRegion} <span style={{ marginLeft: "0.25rem" }}>▾</span>
          </button>
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                marginTop: "0.5rem",
                width: "5rem",
                backgroundColor: "white",
                borderRadius: "0.375rem",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <button
                onClick={() => handleOptionClick("NA")}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  textAlign: "left",
                  color: "#374151",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#E5E7EB")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                NA
              </button>
              <button
                onClick={() => handleOptionClick("EUW")}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  textAlign: "left",
                  color: "#374151",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#E5E7EB")
                }
                onMouseLeave={(e) => (e.target.style.backgroundColor = "white")}
              >
                EUW
              </button>
            </div>
          )}
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

      {/* Search input */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search players"
          style={{
            padding: "0.5rem",
            borderRadius: "0.375rem",
            border: "1px solid #9CA3AF",
            outline: "none",
          }}
        />
      </div>

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
        to="/leaderboards"
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
