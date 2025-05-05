import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./SocketContext"; // Fixed import
import Navbar from "./components/navbar.js";
import DodgePage from "./DodgePage.js";
import Leaderboard from "./Leaderboard.js";
import SummonerPage from "./SummonerPage.js";
import "./App.css";
import "./index.css";

function App() {
  return (
    <SocketProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/region/:region" element={<DodgePage />} />
            <Route
              path="/region/:region/leaderboard"
              element={<Leaderboard />}
            />
            <Route
              path="/region/:region/player/:accountName"
              element={<SummonerPage />}
            />
          </Routes>
        </div>
      </Router>
    </SocketProvider>
  );
}

export default App;
