import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar.js";

const Navbar = () => {
  const navigate = useNavigate();
  const pathSegments = window.location.pathname.split("/");
  const region = pathSegments[2] || "NA";
  console.log("NAVAR REGION", region);
  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    // Navigate to the same base route with new region
    const currentPath = window.location.pathname.split("/").slice(3).join("/"); // e.g., "leaderboard" or "player/123"
    navigate(`/region/${newRegion}/${currentPath}`);
    window.location.reload();
  };

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
          to={region ? `/region/${region}` : "/region/NA"} // Updated link
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
            value={region || "NA"} // Default to 'na' if region is undefined
            onChange={handleRegionChange}
            style={{
              color: "white",
              backgroundColor: "#27272a",
              border: "1px solid #4b5563",
              borderRadius: "0.25rem",
              padding: "0.25rem 0.5rem",
              cursor: "pointer",
            }}
          >
            <option value="na">NA</option>
            <option value="euw">EUW</option>
            <option value="kr">KR</option>
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

      <SearchBar region={region} />

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
        to={region ? `region/${region}/leaderboard` : "/region/NA/leaderboard"}
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
        <Link
          to={region ? `region/${region}/about` : "/region/NA/leaderboard"}
          style={{ color: "white", textDecoration: "none" }}
        >
          About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
