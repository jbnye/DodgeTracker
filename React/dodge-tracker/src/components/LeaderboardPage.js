import React, { useState } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  style,
}) {
  const [isPrevHovered, setIsPrevHovered] = useState(false);
  const [isNextHovered, setIsNextHovered] = useState(false);

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
  };

  return (
    <div
      style={{
        gap: "10px",
        marginTop: "20px",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{
          display: "flex",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          backgroundColor: isPrevHovered
            ? "#6c6c7a"
            : style?.backgroundColor || "#4c4c55",
          ...style,
        }}
        onMouseEnter={() => setIsPrevHovered(true)}
        onMouseLeave={() => setIsPrevHovered(false)}
      >
        Previous
      </button>
      <span style={{ display: "flex" }}>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        style={{
          display: "flex",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          backgroundColor: isNextHovered
            ? "#6c6c7a"
            : style?.backgroundColor || "#4c4c55",
          ...style,
        }}
        onMouseEnter={() => setIsNextHovered(true)}
        onMouseLeave={() => setIsNextHovered(false)}
      >
        Next
      </button>
    </div>
  );
}
