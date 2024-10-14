import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
// import RegionNA from "./components/RegionNA.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/region/na" element={<RegionNA />} />
          <Route path="/region/euw" element={<RegionEUW />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
