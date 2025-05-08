import { useState, useEffect } from "react";
export default function DodgeTimer({ socket, region }) {
  const [lastCheckedTime, setLastCheckedTime] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    if (!socket) return;

    const handleLastChecked = (checkedRegion) => {
      console.log(`Timer reset for ${region}`);
      if (checkedRegion === region) {
        setLastCheckedTime(0);
        startFlash();
      }
    };

    socket.on("last-checked", handleLastChecked);

    return () => {
      socket.off("last-checked", handleLastChecked);
    };
  }, [socket, region]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLastCheckedTime((prev) => {
        const newTime = prev + 0.1;
        return Number(newTime.toFixed(1)); // Prevent floating point errors
      });
    }, 100);
    return () => clearInterval(intervalId); // Cleanup
  });

  const startFlash = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      Last Dodge Check:
      <div
        style={{
          backgroundColor: isFlashing ? "#4CAF50" : "#041c1f",
          minWidth: "80px",
          borderRadius: "6px",
          justifyContent: "space-between",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-timer size-4"
        >
          <line x1="10" x2="14" y1="2" y2="2"></line>
          <line x1="12" x2="15" y1="14" y2="11"></line>
          <circle cx="12" cy="14" r="8"></circle>
        </svg>
        {" " + lastCheckedTime.toFixed(1)}s
      </div>
    </div>
  );
}
