import React, { useState, useEffect } from "react";
import axios from "axios";

const DodgeList = () => {
  const [dodes, setDodes] = useState([]);

  useEffect(() => {
    fetchDodes();
    const interval = setInterval(fetchDodes, 5000); // Fetch new data every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDodes = async () => {
    try {
      const response = await axios.get("/api/dodes?limit=10"); // Adjust the API endpoint as needed
      setDodes(response.data);
    } catch (error) {
      console.error("Error fetching dodes:", error);
    }
  };

  return (
    <div>
      <h2>Last 10 Dodes</h2>
      <ul>
        {dodes.map((dode, index) => (
          <li key={index}>
            {dode.name} - {dode.currentLP} LP - Last Match: {dode.lastMatchId}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DodgeList;

// import React from 'react';
// import DodgeList from './components/DodgeList';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Dodge Tracker</h1>
//       </header>
//       <DodgeList />
//     </div>
//   );
// }

// export default App;

// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 5000;

// const dodes = [
//   // Sample data
//   { name: 'Player1', currentLP: 100, lastMatchId: 'match1' },
//   { name: 'Player2', currentLP: 200, lastMatchId: 'match2' },
//   // Add more sample data as needed
// ];

// app.get('/api/dodes', (req, res) => {
//   const limit = parseInt(req.query.limit) || 10;
//   res.json(dodes.slice(0, limit));
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
