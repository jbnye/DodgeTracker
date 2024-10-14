import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // If you have additional custom styles

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
    <nav className="sticky top-0 z-10 flex items-center bg-zinc-800 p-2">
      <div className="flex items-center">
        <Link to="/" className="text-white text-xl font-bold mr-4">
          DodgeTracker
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-white flex items-center"
          >
            {selectedRegion} <span className="ml-1">▾</span>
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 w-20 bg-white rounded-md shadow-lg">
              <button
                onClick={() => handleOptionClick("NA")}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                NA
              </button>
              <button
                onClick={() => handleOptionClick("EUW")}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                EUW
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-l border-gray-600 h-8 mx-4"></div>
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search players"
          className="p-2 rounded-md"
        />
      </div>
      <div className="border-l border-gray-600 h-8 mx-4"></div>
      <Link to="/leaderboards" className="text-white mr-4">
        Leaderboard
      </Link>
      <div className="ml-auto">
        <Link to="/about" className="text-white">
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
