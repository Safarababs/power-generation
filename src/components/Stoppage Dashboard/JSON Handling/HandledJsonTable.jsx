import React from "react";
import handleddata from "./feeders trippin records human readable.json";

const HandledJsonFeederRecord = () => {
  const sortByYear = (data) => {
    return data.sort((a, b) => {
      const yearA = new Date(a.startTime).getFullYear();
      const yearB = new Date(b.startTime).getFullYear();
      return yearA - yearB;
    });
  };

  const groupByMill = (data) => {
    return data.reduce((acc, record) => {
      if (!acc[record.mill]) {
        acc[record.mill] = [];
      }
      acc[record.mill].push(record);
      return acc;
    }, {});
  };

  const processData = (data) => {
    const sorted = sortByYear(data).reverse();
    const grouped = groupByMill(sorted);
    return grouped;
  };

  const groupedData = processData(handleddata);

  return (
    <div>
      {Object.keys(groupedData).map((millName) => (
        <div key={millName}>
          <h2>{millName}</h2>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Id</th>
                <th>Year</th>
                <th>Stop Time</th>
                <th>Start Time</th>
                <th>Total Stop Time</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[millName]
                // keep only duplicates
                .filter(
                  (record, index, self) =>
                    self.findIndex(
                      (r) =>
                        r.stopTime === record.stopTime &&
                        r.mill === record.mill,
                    ) !== index,
                )
                .map((record, index) => (
                  <tr key={index}>
                    <td>{record.id}</td>
                    <td>{new Date(record.startTime).getFullYear()}</td>
                    <td>{record.stopTime}</td>
                    <td>{record.startTime}</td>
                    <td>{record.totalStop}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default HandledJsonFeederRecord;
