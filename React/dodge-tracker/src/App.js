import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.js";
import "./index.css";
import DodgeList from "./components/DodgeList.js"; // Adjust the path if necessary
// import RegionNA from "./components/RegionNA.js";

const sampleItems = [
  {
    image: "path/to/image1.jpg",
    name: "Player1",
    rankImage: "path/to/rank1.png",
    lp: 100,
    dodgeAmount: 5,
    timeDifference: "2 hours ago",
  },
  {
    image: "path/to/image2.jpg",
    name: "Player2",
    rankImage: "path/to/rank2.png",
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
          {/* <Route path="/" element={<Home />} />
          <Route path="/region/na" element={<RegionNA />} />
          <Route path="/region/euw" element={<RegionEUW />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/about" element={<About />} /> */}
        </Routes>
        <DodgeList items={sampleItems} />
      </div>
    </Router>
  );
}

export default App;
