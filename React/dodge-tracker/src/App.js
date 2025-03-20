import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Switch,
} from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
import DodgeList from "./components/DodgeList.js"; // Adjust the path if necessary
import Leaderboard from "./Leaderboard"; // Import Leaderboard Component
import SummonerPage from "./SummonerPage";
// import RegionNA from "./components/RegionNA.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Switch>
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/player/:gameName/:tagLine" element={<SummonerPage />} />
        </Switch>
        {/* <DodgeList items={sampleItems} /> */}
      </div>
    </Router>
  );
}

export default App;
