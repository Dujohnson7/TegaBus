import React, { useState, useEffect } from "react"; 
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Users() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/users";  

  const [searchTerm, setSearchTerm] = useState("");
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
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
    console.log("Fetched users:", data);
    setUserList(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching users:", error);
    setLoading(false);
  }
};


  const filteredUserList = userList.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.names?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.username?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search) ||
      user.express?.expressName?.toLowerCase().includes(search)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setUserList(userList.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user: " + error.message);
    }
  };

  const handleAddNew = () => history.push("/admin/users/add");
  const handleUpdate = (id) => history.push(`/admin/users/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading users...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-10/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center justify-between">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-lg text-blueGray-700">Users List</h3>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  /> &nbsp; &nbsp; &nbsp;
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
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Name</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Email</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Phone</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Username</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Role</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Express</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUserList.map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-xs">{index + 1}</td>
                      <td className="px-6 py-4 text-xs">{user.names}</td>
                      <td className="px-6 py-4 text-xs">{user.email}</td>
                      <td className="px-6 py-4 text-xs">{user.phone}</td>
                      <td className="px-6 py-4 text-xs">{user.username}</td>
                      <td className="px-6 py-4 text-xs">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : user.role === "driver"
                            ? "bg-blue-100 text-blue-800"
                            : user.role === "staff"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4 text-xs">{user.express?.expressName || "-"}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                          >
                            <i className="fas fa-edit mr-1"></i>
                          </button> &nbsp; &nbsp; &nbsp;
                          <button
                            onClick={() => handleDelete(user.id)}
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

