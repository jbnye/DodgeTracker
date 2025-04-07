import React, { useState, useEffect } from "react";
import SearchDropDown from "./SearchDropDown";

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [summonerList, setSummonerList] = useState([]);

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSummonerList([]);
      return;
    }

    const timer = setTimeout(() => {
      fetch(
        `http://127.0.0.1:5000/api/search-summoner?searchInput=${encodeURIComponent(
          searchInput
        )}`
      )
        .then((response) => response.json())
        .then((data) => {
          setSummonerList(data); // Update summoner list
          console.log(data);
        })
        .catch((error) => console.error("Error:", error));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        placeholder="Search players"
        value={searchInput}
        onChange={handleChange}
        style={{
          padding: "0.5rem",
          borderRadius: "0.375rem",
          border: "1px solid #9CA3AF",
          outline: "none",
        }}
      />
      <SearchDropDown sumList={summonerList} />
    </div>
  );
}
