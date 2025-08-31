import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function UserAdd() {
  const history = useHistory();

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

    const response = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Failed to save user");
    }

    const savedUser = await response.json();
    console.log("Saved User:", savedUser);
    alert("User added successfully!");
    history.push("/admin/users");
  } catch (error) {
    console.error("Error saving user:", error);
    alert("Failed to save user: " + error.message);
  }
};

  const handleCancel = () => history.push("/admin/users");

  return (
    <>
    {/* Add New User Form */}
      <div className="flex flex-wrap">
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">Add New User</h6>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID*
                  </label>
                  <input
                    type="number"
                    name="nid"
                    value={userData.nid}
                    onChange={handleInputChange}
                    placeholder="Enter National ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="names"
                    value={userData.names}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="user@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleInputChange}
                    placeholder="+250 7XX XXX XXX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Role</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="AGENT">AGENT</option>
                    <option value="DRIVER">DRIVER</option>
                  </select>
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express *
                  </label>
                  <select
                    name="express"
                    value={userData.express}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={userData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                

              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>&nbsp;&nbsp;&nbsp;
                <button
                  type="submit"
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <i className="fas fa-save mr-2"></i>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
 