import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
import DodgeList from "./components/DodgeList.js"; // Adjust the path if necessary
import Leaderboard from "./Leaderboard"; // Import Leaderboard Component
import SummonerPage from "./SummonerPage";
// import RegionNA from "./components/RegionNA.js";

const sampleItems = [
  {
    image:
      "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/5950.jpg",
    name: "Fachizzle#NA1",
    rankImage:
      "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/challenger.svg",
    lp: 1000,
    dodgeAmount: 5,
    timeDifference: "2 hours ago",
  },
  {
    image:
      "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/23.jpg",
    name: "Feast on Frogs#NA1",
    rankImage:
      "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-mini-crests/master.svg",
    lp: 200,
    dodgeAmount: 3,
    timeDifference: "1 hour ago",
  },
  // Add more items as needed
];

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/player/:gameName/:tagLine" element={<SummonerPage />} />
        </Routes>
        {/* <DodgeList items={sampleItems} /> */}
      </div>
    </Router>
  );
}

export default App;
