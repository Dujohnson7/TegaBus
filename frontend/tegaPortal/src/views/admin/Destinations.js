import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Destinations() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/destinations";

  const [searchTerm, setSearchTerm] = useState("");
  const [destinationList, setDestinationList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const token = localStorage.getItem("token");
      const expressId = localStorage.getItem("expressId");

      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Express-Id": expressId || ""
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched destinations:", data);
      setDestinationList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      setLoading(false);
    }
  };
 
  const filteredDestinations = destinationList.filter((dest) => {
    const search = searchTerm.toLowerCase();
    return (
      dest.express?.expressName?.toLowerCase().includes(search) ||
      dest.fromLocation?.toLowerCase().includes(search) ||
      dest.toLocation?.toLowerCase().includes(search) ||
      String(dest.cost).toLowerCase().includes(search)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setDestinationList(destinationList.filter((dest) => dest.id !== id));
      alert("Destination deleted successfully!");
    } catch (error) {
      console.error("Error deleting destination:", error);
      alert("Failed to delete destination: " + error.message);
    }
  };

  const handleAddNew = () => history.push("/admin/destinations/add");
  const handleUpdate = (id) => history.push(`/admin/destinations/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading destinations...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable> 
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center justify-between">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-lg text-blueGray-700">Destinations List</h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  /> &nbsp;&nbsp;&nbsp;
                  <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  >
                    <i className="fas fa-plus mr-2"></i> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">#</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Express</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">From</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">To</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Cost</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDestinations.map((dest, index) => (
                    <tr key={dest.id}>
                      <td className="px-6 py-4 text-xs">{index + 1}</td>
                      <td className="px-6 py-4 text-xs">{dest.express?.expressName || "-"}</td>
                      <td className="px-6 py-4 text-xs">{dest.fromLocation}</td>
                      <td className="px-6 py-4 text-xs">{dest.toLocation}</td>
                      <td className="px-6 py-4 text-xs">{dest.cost} RWF</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(dest.id)}
                            className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                          >
                            <i className="fas fa-edit mr-1"></i>
                          </button> &nbsp;&nbsp;&nbsp;
                          <button
                            onClick={() => handleDelete(dest.id)}
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
