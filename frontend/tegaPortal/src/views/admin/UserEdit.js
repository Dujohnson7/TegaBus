import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

export default function UserEdit() {
  const history = useHistory();
  const { id } = useParams();  

  const [userData, setUserData] = useState({
    nid: "",
    names: "",
    email: "",
    phone: "",
    role: "USER",
    username: "",
    password: "",
    status: "active",
    express: ""  
  });

  const [expressList, setExpressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch express list
  useEffect(() => {
    const fetchExpresses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/express/all", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch expresses");
        const data = await response.json();
        setExpressList(data);
      } catch (error) {
        console.error("Error fetching expresses:", error);
      }
    };
    fetchExpresses();
  }, []);

  // Fetch user data by id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user");
        const data = await response.json();
 
        setUserData({
          ...data,
          express: data.express?.id || ""
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { 
      const expressObj = expressList.find(exp => exp.id === userData.express);
      const payload = { ...userData, express: expressObj };

      const response = await fetch(`http://localhost:5000/api/users/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update user");
      }

      const updatedUser = await response.json();
      console.log("Updated User:", updatedUser);
      alert("User updated successfully!");
      history.push("/admin/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/users");

  if (loading) return <p className="text-center p-6">Loading user...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">Update User</h6>
              <button
                onClick={handleCancel}
                className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                type="button"
              >
                Back
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID*</label>
                <input
                  type="number"
                  name="nid"
                  value={userData.nid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="names"
                  value={userData.names}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="AGENT">AGENT</option>
                  <option value="DRIVER">DRIVER</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Express *</label>
                <select
                  name="express"
                  value={userData.express}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Express</option>
                  {expressList.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.expressName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password (leave blank if unchanged)</label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>&nbsp;&nbsp;&nbsp;
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                <i className="fas fa-save mr-2"></i>
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
