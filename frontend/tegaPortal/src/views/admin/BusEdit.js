import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

export default function BusAdd() {
  const history = useHistory();
  const { id } = useParams();  
  const isEdit = !!id;

  const [busData, setBusData] = useState({
    plateNo: "",
    busName: "",
    busSize: "",
    users: "",
    express: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const expressId = localStorage.getItem("expressId");
 
        let userRole = "";
        const userObj = localStorage.getItem("user");
        if (userObj) {
          try {
            const user = JSON.parse(userObj);
            userRole = user.role ? user.role.toUpperCase() : "";
          } catch (e) {
            userRole = localStorage.getItem("role")?.toUpperCase() || "";
          }
        } else {
          userRole = localStorage.getItem("role")?.toUpperCase() || "";
        }
        setRole(userRole);
 
        const expressResponse = await fetch("http://localhost:5000/api/express/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const expresses = await expressResponse.json();
        setExpressList(expresses);
 
        const userResponse = await fetch("http://localhost:5000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = await userResponse.json();
        const filteredDrivers = users.filter((u) => u.role?.toUpperCase() === "DRIVER");
        setAllDrivers(filteredDrivers);

        setDriverList(
          userRole === "SUPER_ADMIN"
            ? filteredDrivers
            : filteredDrivers.filter((u) => u.express?.id === expressId)
        );
 
        if (isEdit) {
          const busRes = await fetch(`http://localhost:5000/api/buses/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (busRes.ok) {
            const bus = await busRes.json();
            setBusData({
              plateNo: bus.plateNo || "",
              busName: bus.busName || "",
              busSize: bus.busSize || "",
              users: bus.users?.id || "",
              express: bus.express?.id || (userRole !== "SUPER_ADMIN" ? expressId : ""),
            }); 
            const driversForExpress = filteredDrivers.filter(
              (d) => d.express?.id === (bus.express?.id || expressId)
            );
            setDriverList(driversForExpress);
          }
        } else if (userRole !== "SUPER_ADMIN") {
          setBusData((prev) => ({ ...prev, express: expressId }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusData({ ...busData, [name]: value });
 
    if (name === "express" && role === "SUPER_ADMIN") {
      const filteredDrivers = allDrivers.filter((user) => user.express?.id === value);
      setDriverList(filteredDrivers);
      setBusData((prev) => ({ ...prev, users: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...busData,
        express:
          role === "SUPER_ADMIN"
            ? expressList.find((exp) => exp.id === busData.express)
            : { id: busData.express },
        users: { id: busData.users },
      };

      const url = isEdit
        ? `http://localhost:5000/api/buses/update/${id}`
        : "http://localhost:5000/api/buses/register";

      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save bus");
      }

      alert(`Bus ${isEdit ? "updated" : "added"} successfully!`);
      history.push("/admin/buses");
    } catch (error) {
      console.error(error);
      alert("Error saving bus: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/buses");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">
              {isEdit ? "Edit Bus" : "Add New Bus"}
            </h6>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md"
            >
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {role === "SUPER_ADMIN" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Express *</label>
                  <select
                    name="express"
                    value={busData.express}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number *</label>
                <input
                  type="text"
                  name="plateNo"
                  value={busData.plateNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bus Name *</label>
                <input
                  type="text"
                  name="busName"
                  value={busData.busName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bus Size *</label>
                <input
                  type="number"
                  name="busSize"
                  value={busData.busSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver *</label>
                <select
                  name="users"
                  value={busData.users}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Driver</option>
                  {driverList.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.names}
                    </option>
                  ))}
                </select>
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
                <i className="fas fa-save mr-2"></i> {isEdit ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
