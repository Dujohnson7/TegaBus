import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Buses() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/buses";

  const [searchTerm, setSearchTerm] = useState("");
  const [busList, setBusList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const expressId = localStorage.getItem("expressId");

      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "X-Express-Id": expressId || "",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("Fetched buses:", data);
      setBusList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching buses:", error);
      setLoading(false);
    }
  };

  const filteredBusList = busList.filter((bus) => {
    const search = searchTerm.toLowerCase();
    return (
      bus.express?.expressName?.toLowerCase().includes(search) ||
      bus.plateNo?.toLowerCase().includes(search) ||
      bus.busName?.toLowerCase().includes(search) ||
      bus.busSize?.toLowerCase().includes(search) ||
      String(bus.users?.length || 0).includes(search)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setBusList(busList.filter((bus) => bus.id !== id));
      alert("Bus deleted successfully!");
    } catch (error) {
      console.error("Error deleting bus:", error);
      alert("Failed to delete bus: " + error.message);
    }
  };

  const handleAddNew = () => history.push("/admin/buses/add");
  const handleUpdate = (id) => history.push(`/admin/buses/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading buses...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-blueGray-700">Buses List</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search buses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />&nbsp;&nbsp;&nbsp;
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i> Add
                </button>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">#</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Express</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Plate No</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Bus Name</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Bus Size</th> 
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusList.map((bus, index) => (
                    <tr key={bus.id}>
                      <td className="px-6 py-4 text-xs">{index + 1}</td>
                      <td className="px-6 py-4 text-xs">{bus.express?.expressName || "-"}</td>
                      <td className="px-6 py-4 text-xs">{bus.plateNo}</td>
                      <td className="px-6 py-4 text-xs">{bus.busName}</td>
                      <td className="px-6 py-4 text-xs">{bus.busSize}</td> 
                      <td className="px-6 py-4 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(bus.id)}
                            className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                          >
                            <i className="fas fa-edit mr-1"></i>
                          </button>&nbsp;&nbsp;&nbsp;
                          <button
                            onClick={() => handleDelete(bus.id)}
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
