import React from "react";

const AnalyzeButton = () => {
  const handleClick = async () => {
    const response = await fetch("http://localhost:5000/analyze-folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folderPath: "E:\\Temporary Folder\\data analyse\\Today",
      }),
    });

    const data = await response.json();
    console.log("Analysis Result:", data);
    alert("Analysis complete! Check console for results.");
  };

  return (
    <button className="btn btn-primary" onClick={handleClick}>
      Analyze Today Folder
    </button>
  );
};

export default AnalyzeButton;
