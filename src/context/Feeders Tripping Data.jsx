import React, { createContext, useContext, useState } from "react";
function formatToHHMM(value) {
  if (!value || value === "-" || value.toLowerCase() === "nill") return value;

  // Case 1: already in hh:mm:ss
  if (value.includes(":")) {
    const parts = value.split(":");
    return `${parts[0]}:${parts[1]}`; // hh:mm
  }

  // Case 2: decimal hours (e.g. 13.32013889)
  const num = parseFloat(value);
  if (!isNaN(num)) {
    const hours = Math.floor(num);
    const minutes = Math.round((num - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  return value;
}

const FeedersTrippingData = createContext();

export const FeedersTrippingProvider = ({ children }) => {
  const [feedersTrippingData] = useState([
    {
      id: 1,
      month: "Jan-25",
      cm1: { hours: formatToHHMM("84:38:00"), stops: 14 },
      cm2: { hours: formatToHHMM("385:17:00"), stops: 20 },
      cm3: { hours: formatToHHMM("Nill"), stops: "-" },
      rm1: { hours: formatToHHMM("115:38:00"), stops: 6 },
      rm2: { hours: "-", stops: "-" },
      kiln1: { hours: formatToHHMM("31:10:00"), stops: 2 },
      kiln2: { hours: "-", stops: "-" },
    },
    {
      id: 2,
      month: "Feb-25",
      cm1: { hours: formatToHHMM("49:55:00"), stops: 12 },
      cm2: { hours: formatToHHMM("76:17:00"), stops: 12 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("21:08:00"), stops: 2 },
      rm2: { hours: "-", stops: "-" },
      kiln1: { hours: formatToHHMM("18:10:00"), stops: 1 },
      kiln2: { hours: "-", stops: "-" },
    },
    {
      id: 3,
      month: "Mar-25",
      cm1: { hours: formatToHHMM("461:36:00"), stops: 15 },
      cm2: { hours: formatToHHMM("174:37:00"), stops: 14 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("62:50:00"), stops: 5 },
      rm2: { hours: "-", stops: "-" },
      kiln1: { hours: formatToHHMM("48:09:00"), stops: 1 },
      kiln2: { hours: "-", stops: "-" },
    },
    {
      id: 4,
      month: "Apr-25",
      cm1: { hours: formatToHHMM("140:45:00"), stops: 13 },
      cm2: { hours: formatToHHMM("217:15:00"), stops: 9 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("30:02:00"), stops: 4 },
      rm2: { hours: "-", stops: "-" },
      kiln1: { hours: formatToHHMM("15:27:00"), stops: 2 },
      kiln2: { hours: "-", stops: "-" },
    },
    {
      id: 5,
      month: "May-25",
      cm1: { hours: formatToHHMM("142:33:00"), stops: 13 },
      cm2: { hours: formatToHHMM("161:34:00"), stops: 18 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("14:26:00"), stops: 9 },
      rm2: { hours: formatToHHMM("867:25:00"), stops: 15 },
      kiln1: { hours: formatToHHMM("5:05:00"), stops: 4 },
      kiln2: { hours: formatToHHMM("5:13:00"), stops: 2 },
    },
    {
      id: 6,
      month: "Jun-25",
      cm1: { hours: formatToHHMM("206:56:00"), stops: 12 },
      cm2: { hours: formatToHHMM("326:42:00"), stops: 11 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("305:44:00"), stops: 5 },
      rm2: { hours: formatToHHMM("431:27:00"), stops: 34 },
      kiln1: { hours: formatToHHMM("13.32013889"), stops: 5 },
      kiln2: { hours: formatToHHMM("16.08194444"), stops: 7 },
    },
    {
      id: 7,
      month: "Jul-25",
      cm1: { hours: formatToHHMM("102:45:00"), stops: 13 },
      cm2: { hours: formatToHHMM("159:25:00"), stops: 10 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("20:08:00"), stops: 9 },
      rm2: { hours: formatToHHMM("103:33:00"), stops: 38 },
      kiln1: { hours: "0:00:00", stops: "-" },
      kiln2: { hours: formatToHHMM("31:47:00"), stops: 4 },
    },
    {
      id: 8,
      month: "Aug-25",
      cm1: { hours: formatToHHMM("225:14:00"), stops: 12 },
      cm2: { hours: formatToHHMM("279:13:00"), stops: 8 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("34:26:00"), stops: 5 },
      rm2: { hours: formatToHHMM("54:24:00"), stops: 17 },
      kiln1: { hours: "-", stops: "-" },
      kiln2: { hours: formatToHHMM("160:22:00"), stops: 7 },
    },
    {
      id: 9,
      month: "Sep-25",
      cm1: { hours: formatToHHMM("121:28:00"), stops: 9 },
      cm2: { hours: formatToHHMM("173:53:00"), stops: 11 },
      cm3: { hours: "-", stops: "-" },
      rm1: { hours: formatToHHMM("57:33:00"), stops: 5 },
      rm2: { hours: formatToHHMM("140:56:00"), stops: 38 },
      kiln1: { hours: formatToHHMM("20:58:00"), stops: 2 },
      kiln2: { hours: formatToHHMM("26:39:00"), stops: 3 },
    },
    {
      id: 10,
      month: "Oct-25",
      cm1: { hours: formatToHHMM("134:11:00"), stops: 13 },
      cm2: { hours: formatToHHMM("135:33:00"), stops: 17 },
      cm3: { hours: "It runs only 58 hours for testing", stops: "-" },
      rm1: { hours: formatToHHMM("37:55:00"), stops: 8 },
      rm2: { hours: formatToHHMM("56:32:00"), stops: 38 },
      kiln1: { hours: "-", stops: "-" },
      kiln2: { hours: formatToHHMM("10:46:00"), stops: 2 },
    },
    {
      id: 11,
      month: "Nov-25",
      cm1: { hours: formatToHHMM("307:17:00"), stops: 17 },
      cm2: { hours: formatToHHMM("291:06:00"), stops: 14 },
      cm3: { hours: formatToHHMM("280:04:00"), stops: 28 },
      rm1: { hours: formatToHHMM("25:19:00"), stops: 5 },
      rm2: { hours: formatToHHMM("101:03:00"), stops: 13 },
      kiln1: { hours: "-", stops: "-" },
      kiln2: { hours: formatToHHMM("107:40:00"), stops: 1 },
    },

    {
      id: 12,
      month: "Dec-25",
      cm1: { hours: formatToHHMM("469:15:00"), stops: 9 },
      cm2: { hours: formatToHHMM("396:53:00"), stops: 12 },
      cm3: { hours: formatToHHMM("457:47:00"), stops: 15 },
      rm1: { hours: formatToHHMM("24:26:00"), stops: 7 },
      rm2: { hours: formatToHHMM("152:08:00"), stops: 9 },
      kiln1: { hours: formatToHHMM("4:50:00"), stops: 1 },
      kiln2: { hours: formatToHHMM("145:52:00"), stops: 3 },
    },
  ]);

  return (
    <FeedersTrippingData.Provider value={{ feedersTrippingData }}>
      {children}
    </FeedersTrippingData.Provider>
  );
};

export const useFeedersTripping = () => {
  const context = useContext(FeedersTrippingData);
  if (!context) {
    throw new Error(
      "useFeedersTripping must be used within FeedersTrippingProvider",
    );
  }
  return context;
};
