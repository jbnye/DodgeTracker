import react, { useState } from "react";

export default function SearchBar() {
  const [input, setInput] = useState();
  const [list, setList] = useState([]);

    useEffect(() => {
        
        fetch(`http://127.0.0.1:5000/api/leaderboard?page=${}`) // Fetch from backend
        .then((response) => response.json())
        .then((data) => {
            setList(data)
        })
        .catch((error) => console.error("Error fetching leaderboard:", error));
    },[input,]);


  return (
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
  );
}
