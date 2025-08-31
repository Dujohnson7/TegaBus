import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function ExpressList() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/express";

  const [expressList, setExpressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExpressList();
  }, []);

  const fetchExpressList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setExpressList(data);
    } catch (error) {
      console.error("Error fetching express list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this express?")) return;

    try {
      const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setExpressList(expressList.filter((express) => express.id !== id));
      alert("Express deleted successfully!");
    } catch (error) {
      console.error("Error deleting express:", error);
      alert("Failed to delete express: " + error.message);
    }
  };

  const handleAddNew = () => history.push("/admin/express/add");
  const handleUpdate = (id) => history.push(`/admin/express/edit/${id}`);

  const filteredExpressList = expressList.filter((express) =>
    express.expressName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    express.expressDescription?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center p-6">Loading express list...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center justify-between">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-lg text-blueGray-700">Express List</h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search express..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />&nbsp;&nbsp;
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">#</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Logo</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">BUS</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Name</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Description</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpressList.map((express, index) => (
                    <tr key={express.id}>
                      <td className="px-6 py-4 text-xs">{index + 1}</td>
                      <td className="px-6 py-4 text-xs">
                        {express.expressLogo ? (
                          <img
                            src={`http://localhost:5000/uploads/${express.expressLogo}`}
                            alt="Logo"
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {express.expressProfile ? (
                          <img
                            src={`http://localhost:5000/uploads/${express.expressProfile}`}
                            alt="Profile"
                            className="h-10 w-10 object-cover rounded-full"
                          />
                        ) : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs">{express.expressName}</td>
                      <td className="px-6 py-4 text-xs">
                        {(() => {
                          if (!express.expressDescription) return "-";

                          const words = express.expressDescription.split(" ");
                          const preview = words.slice(0, 20).join(" ");
                          return words.length > 20 ? preview + "..." : preview;
                        })()}
                      </td>

                      <td className="px-6 py-4 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(express.id)}
                            className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                          >
                            <i className="fas fa-edit mr-1"></i>
                          </button> &nbsp;&nbsp;&nbsp;
                          <button
                            onClick={() => handleDelete(express.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium"
                          >
                            <i className="fas fa-trash mr-1"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardTable>
        </div>
      </div>
    </div>
  );
}
