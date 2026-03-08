import React, { useEffect, useState } from "react";

const SummaryViewer = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/summary")
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching summary:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading summary...</p>;

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">
          Final today summary of engine no {summary[0].Engine}
        </h2>
      </div>

      <div className="card-content">
        <div className="over-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Parameter</th>
                <th>Average</th>
                <th>Max</th>
                <th>Min</th>
                <th>Engine No</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx}</td>
                  <td>{row.Parameter}</td>
                  <td>{row.Average.toFixed(2)}</td>
                  <td>{row.Max}</td>
                  <td>{row.Min}</td>
                  <td>{row.Engine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SummaryViewer;
