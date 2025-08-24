import React, { useState } from "react";
import PropTypes from "prop-types";

// components
import TableDropdown from "components/Dropdowns/TableDropdown.js";

export default function CardTable({ color }) {
  const [showAll, setShowAll] = useState(false);

  const sampleData = [
    {
      id: 1,
      project: "Argon Design System",
      budget: "$2,500 USD",
      status: "pending",
      users: 4,
      completion: 60,
      image: require("assets/img/bootstrap.jpg")
    },
    {
      id: 2,
      project: "Angular Now UI Kit PRO",
      budget: "$1,800 USD",
      status: "completed",
      users: 4,
      completion: 100,
      image: require("assets/img/angular.jpg")
    },
    {
      id: 3,
      project: "Black Dashboard Sketch",
      budget: "$3,150 USD",
      status: "delayed",
      users: 4,
      completion: 73,
      image: require("assets/img/sketch.jpg")
    },
    {
      id: 4,
      project: "React Material Dashboard",
      budget: "$4,400 USD",
      status: "on schedule",
      users: 4,
      completion: 90,
      image: require("assets/img/react.jpg")
    },
    {
      id: 5,
      project: "Vue Material Dashboard",
      budget: "$2,200 USD",
      status: "completed",
      users: 4,
      completion: 100,
      image: require("assets/img/vue.jpg")
    }
  ];

  const displayedData = showAll ? sampleData : sampleData.slice(0, 3);

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
          (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
        }
      >
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center justify-between">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3
                className={
                  "font-semibold text-lg " +
                  (color === "light" ? "text-blueGray-700" : "text-white")
                }
              >
                Sample Projects Table
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAll(!showAll)}
                className={
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
                  (color === "light" 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "bg-lightBlue-600 text-white hover:bg-lightBlue-700")
                }
              >
                {showAll ? "Show Less" : "See All"}
              </button>
              <button
                className={
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
                  (color === "light" 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-lightBlue-600 text-white hover:bg-lightBlue-700")
                }
              >
                Add New Project
              </button>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Project
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Budget
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Status
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Users
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Completion
                </th>
                <th
                  className={
                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                      : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                  }
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedData.map((item) => (
                <tr key={item.id}>
                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                    <img
                      src={item.image}
                    className="h-12 w-12 bg-white rounded-full border"
                      alt="..."
                    />
                  <span
                    className={
                      "ml-3 font-bold " +
                        (color === "light" ? "text-blueGray-600" : "text-white")
                    }
                  >
                      {item.project}
                  </span>
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.budget}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className={`fas fa-circle mr-2 ${
                      item.status === 'completed' ? 'text-emerald-500' :
                      item.status === 'pending' ? 'text-orange-500' :
                      item.status === 'delayed' ? 'text-red-500' :
                      'text-teal-500'
                    }`}></i>
                    {item.status}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex">
                    <img
                      src={require("assets/img/team-1-800x800.jpg")}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                      />
                    <img
                      src={require("assets/img/team-2-800x800.jpg")}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                      />
                    <img
                      src={require("assets/img/team-3-800x800.jpg")}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                      />
                    <img
                      src={require("assets/img/team-4-470x470.png")}
                      alt="..."
                      className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                      />
                  </div>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                      <span className="mr-2">{item.completion}%</span>
                    <div className="relative w-full">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                        <div
                            style={{ width: `${item.completion}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                              item.completion === 100 ? 'bg-emerald-500' :
                              item.completion >= 80 ? 'bg-teal-500' :
                              item.completion >= 60 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                  <TableDropdown />
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardTable.defaultProps = {
  color: "light",
};

CardTable.propTypes = {
  color: PropTypes.oneOf(["light", "dark"]),
};
