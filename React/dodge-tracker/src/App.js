import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
import DodgePage from "./DodgePage.js";
import Leaderboard from "./Leaderboard.js";
import SummonerPage from "./SummonerPage.js";
// import RegionNA from "./components/RegionNA.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/home" element={<DodgePage />} /> {/* Home Page */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/player/:accountName" element={<SummonerPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
