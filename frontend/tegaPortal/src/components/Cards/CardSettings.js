import React, { useState, useEffect } from "react";

export default function AccountSettings() {
  const [userData, setUserData] = useState({
    nid: "",
    names: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    express: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.role === "super_admin") {
        const fetchExpresses = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/express/all", {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) throw new Error("Failed to fetch expresses");
            const data = await response.json();
            setExpressList(data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchExpresses();
      }
    }
  }, []);
 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User not logged in");

        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUserData({ ...data, express: data.express?.id || "", password: "" });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const expressObj =
        user?.role === "super_admin"
          ? expressList.find((exp) => exp.id === userData.express)
          : undefined;
 
      const payload = {
        ...userData,
        express: expressObj,
        password: userData.password || undefined,
      };

      const response = await fetch(
        `http://localhost:5000/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update profile");
      }

      alert("Profile updated successfully!");
      setUserData({ ...userData, password: "" });  
    } catch (error) {
      console.error(error);
      alert("Error updating profile: " + error.message);
    }
  };

  if (loading) return <p className="text-center p-6">Loading user data...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">My Account</h6>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-auto px-4 lg:px-10 py-10 pt-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID *
                </label>
                <input
                  type="text"
                  name="nid"
                  value={userData.nid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  readOnly
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  readOnly
                />
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password (leave blank if unchanged)
                </label>
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="••••••"
                />
              </div>
 
              {user?.role === "SUPER_ADMIN" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Express
                  </label>
                  <select
                    name="express"
                    value={userData.express}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Express</option>
                    {expressList.map((exp) => (
                      <option key={exp.id} value={exp.id}>
                        {exp.expressName}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
