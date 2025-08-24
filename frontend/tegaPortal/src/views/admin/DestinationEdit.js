import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

export default function DestinationUpdate() {
  const history = useHistory();
  const { id } = useParams(); // get destination id from URL

  const [destinationData, setDestinationData] = useState({
    express: "",
    fromLocation: "",
    toLocation: "",
    cost: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
 
        let userRole = "";
        const userObj = localStorage.getItem("user");
        if (userObj) {
          const user = JSON.parse(userObj);
          userRole = user.role ? user.role.toUpperCase() : "";
        } else {
          userRole = localStorage.getItem("role") ? localStorage.getItem("role").toUpperCase() : "";
        }
        setRole(userRole);
 
        const destRes = await fetch(`http://localhost:5000/api/destinations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dest = await destRes.json();

        setDestinationData({
          express: dest.express?.id || "",
          fromLocation: dest.fromLocation || "",
          toLocation: dest.toLocation || "",
          cost: dest.cost || "",
        });
 
        const expressResponse = await fetch("http://localhost:5000/api/express/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const expresses = await expressResponse.json();
        setExpressList(expresses);
 
        const districtResponse = await fetch("http://localhost:5000/api/destinations/districts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const districts = await districtResponse.json();
        setDistrictList(districts);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDestinationData({ ...destinationData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (destinationData.fromLocation === destinationData.toLocation) {
      alert("From Location and To Location cannot be the same!");
      return;
    }

    try {
      const payload = {
        ...destinationData,
        express:
          role === "SUPER_ADMIN"
            ? expressList.find((exp) => exp.id === destinationData.express)
            : { id: destinationData.express },
      };

      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/destinations/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update destination");
      }

      alert("Destination updated successfully!");
      history.push("/admin/destinations");
    } catch (error) {
      console.error(error);
      alert("Error updating destination: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/destinations");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">Update Destination</h6>
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
              {/* Express */}
              {role === "SUPER_ADMIN" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Express *</label>
                  <select
                    name="express"
                    value={destinationData.express}
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
              )}
 

              {/* From Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Location *</label>
                <select
                  name="fromLocation"
                  value={destinationData.fromLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select From Location</option>
                  {districtList.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* To Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Location *</label>
                <select
                  name="toLocation"
                  value={destinationData.toLocation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select To Location</option>
                  {districtList
                    .filter((district) => district !== destinationData.fromLocation)
                    .map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                </select>
              </div>

              {/* Cost */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost (RWF) *</label>
                <input
                  type="number"
                  name="cost"
                  value={destinationData.cost}
                  onChange={handleInputChange}
                  placeholder="Enter cost"
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button> &nbsp;&nbsp;&nbsp;
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
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
