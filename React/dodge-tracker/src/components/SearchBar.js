import React, { useState, useEffect, useRef } from "react";
import SearchDropDown from "./SearchDropDown";

export default function SearchBar({ region }) {
  const [searchInput, setSearchInput] = useState("");
  const [summonerList, setSummonerList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSummonerList([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    const timer = setTimeout(() => {
      fetch(
        `http://127.0.0.1:5000/api/search-summoner?searchInput=${encodeURIComponent(
          searchInput
        )}&region=${region}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSummonerList(data); // Update summoner list
          setIsLoading(false);
          console.log(data);
        })
        .catch((error) => console.error("Error:", error))
        .finally(() => setIsLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [region, searchInput]);

  const handleItemClick = () => {
    setIsDropDownOpen(false);
    setSearchInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        position: "relative",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Search players"
        value={searchInput}
        onChange={(e) => {
          handleChange(e);
          setIsDropDownOpen(true);
        }}
        onFocus={() => {
          if (searchInput.trim()) setIsDropDownOpen(true);
        }}
        style={{
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #9CA3AF",
          outline: "none",
          width: "250px", // or whatever width you want
        }}
      />
      {searchInput && summonerList && isDropDownOpen && (
        <SearchDropDown
          summonerList={summonerList}
          isLoading={isLoading}
          onClose={() => setIsDropDownOpen(false)}
          inputRef={inputRef}
          hasSearched={hasSearched}
          region={region}
          onItemClick={handleItemClick}
        />
      )}
    </div>
  );
}
