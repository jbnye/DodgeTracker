import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchDropDownItem from "./SearchDropDownItem.js";

export default function SearchDropDown({
  summonerList,
  onClose,
  inputRef,
  isLoading,
  hasSearched,
  region,
}) {
  const dropdownRef = useRef(null);
  console.log("REGION IS", region);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, inputRef]);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: "100%",
        width: "100%",
        border: "1px solid #ddd",
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        zIndex: 1000,
        maxHeight: "300px",
        overflowY: "auto",
      }}
    >
      {isLoading ? (
        <div
          style={{ color: "#9CA3AF", fontSize: "0.9rem", padding: "0.25rem" }}
        >
          Loading...
        </div>
      ) : summonerList.length === 0 && hasSearched ? (
        <div
          style={{ color: "#9CA3AF", fontSize: "0.9rem", padding: "0.25rem" }}
        >
          <strong>No players found.</strong>
          <div style={{ marginTop: "0.25rem" }}>
            (Players without any dodges in Master+ will not show up)
          </div>
        </div>
      ) : (
        <div>
          {summonerList.map((item, index) => (
            <Link
              key={index}
              to={`/region/${region}/player/${item.gameName}-${item.tagLine}`}
              onClick={() => onClose()}
              style={{
                textDecoration: "none",
                color: "white",
              }}
            >
              <SearchDropDownItem item={item} isLoading={isLoading} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
