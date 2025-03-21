import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
import DodgePage from "./DodgePage.js";
import Leaderboard from "./Leaderboard";
import SummonerPage from "./SummonerPage";
// import RegionNA from "./components/RegionNA.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/home" element={<DodgePage />} /> {/* Home Page */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/player/:gameName/:tagLine" element={<SummonerPage />} />
        </Routes>
        {/* <DodgeList items={sampleItems} /> */}
      </div>
    </Router>
  );
}

export default App;
