import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Express() {
  const history = useHistory();
  const [showForm, setShowForm] = useState(false);
  const [editingExpress, setEditingExpress] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // Added for filter functionality
  const [expressData, setExpressData] = useState({
    name: "",
    route: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    status: "active",
  });
  const [expressList, setExpressList] = useState([
    {
      id: 1,
      name: "Express 1",
      route: "Kigali - Huye",
      departureTime: "08:00",
      arrivalTime: "10:30",
      price: "2500",
      status: "active"
    },
    {
      id: 2,
      name: "Express 2",
      route: "Kigali - Musanze",
      departureTime: "10:00",
      arrivalTime: "12:00",
      price: "3000",
      status: "active"
    },
    {
      id: 3,
      name: "Express 3",
      route: "Kigali - Kibuye",
      departureTime: "12:00",
      arrivalTime: "14:30",
      price: "2800",
      status: "active"
    },
    {
      id: 4,
      name: "Express 4",
      route: "Kigali - Rusizi",
      departureTime: "14:00",
      arrivalTime: "16:30",
      price: "3200",
      status: "active"
    },
    {
      id: 5,
      name: "Express 5",
      route: "Kigali - Huye",
      departureTime: "16:00",
      arrivalTime: "18:30",
      price: "2500",
      status: "active"
    },
    {
      id: 6,
      name: "Express 6",
      route: "Kigali - Musanze",
      departureTime: "18:00",
      arrivalTime: "20:00",
      price: "3000",
      status: "active"
    }
  ]);
// Filter express list based on search term and status
  const filteredExpressList = expressList.filter((express) =>
    (express.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      express.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      express.status.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === "all" || express.status === filterStatus)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpressData({ ...expressData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingExpress) {
      setExpressList(expressList.map((item) =>
        item.id === editingExpress.id ? { ...expressData, id: item.id } : item
      ));
      setEditingExpress(null);
    } else {
      setExpressList([...expressList, { ...expressData, id: Date.now() }]);
    }
    setExpressData({
      name: "",
      route: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      status: "active",
    });
    setShowForm(false);
  };

  const handleEdit = (express) => {
    setEditingExpress(express);
    setExpressData(express);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setExpressList(expressList.filter((item) => item.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingExpress(null);
    setExpressData({
      name: "",
      route: "",
      departureTime: "",
      arrivalTime: "",
      price: "",
      status: "active",
    });
  };

  const handleAddNew = () => {
    history.push("/admin/express/add");
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Express
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-edit mr-2"></i>
              Quick Add
            </button>
          </div>
        </div>

        {showForm && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">
              {editingExpress ? "Edit Express" : "Add New Express"}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                value={expressData.name}
                onChange={handleInputChange}
                placeholder="Express Name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                name="route"
                value={expressData.route}
                onChange={handleInputChange}
                placeholder="Route"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="time"
                name="departureTime"
                value={expressData.departureTime}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="time"
                name="arrivalTime"
                value={expressData.arrivalTime}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="price"
                value={expressData.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                name="status"
                value={expressData.status}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="md:col-span-3 flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  {editingExpress ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-t mb-0 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-700">
              Express Routes
            </h3>
            <div className="flex space-x-2">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search express routes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {["Name", "Route", "Departure", "Arrival", "Price", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-xs font-semibold text-left text-gray-600 uppercase border-b border-gray-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredExpressList.map((express) => (
                <tr key={express.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm border-b border-gray-200">{express.name}</td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">{express.route}</td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">{express.departureTime}</td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">{express.arrivalTime}</td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">RWF {express.price}</td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        express.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {express.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm border-b border-gray-200">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(express)}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors duration-200"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(express.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors duration-200"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}