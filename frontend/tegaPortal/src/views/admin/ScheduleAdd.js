import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function ScheduleAdd() {
  const history = useHistory();

  const [scheduleData, setScheduleData] = useState({
    express: "",
    bus: "",
    destination: "",
    departureTime: "",
    time: "",
    date: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [busList, setBusList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [existingSchedules, setExistingSchedules] = useState([]);
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
          const user = JSON.parse(userObj);
          userRole = user.role ? user.role.toUpperCase() : "";
        } else {
          userRole = localStorage.getItem("role") ? localStorage.getItem("role").toUpperCase() : "";
        }
        setRole(userRole);
 
        const expressResponse = await fetch("http://localhost:5000/api/express/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpressList(await expressResponse.json());
 
        const busResponse = await fetch("http://localhost:5000/api/buses/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setBusList(await busResponse.json());
 
        const destinationResponse = await fetch("http://localhost:5000/api/destinations/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        setDestinationList(await destinationResponse.json());
 
        const schedulesResponse = await fetch("http://localhost:5000/api/schedules/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "X-Express-Id": expressId || "" },
        });
        setExistingSchedules(await schedulesResponse.json());
 
        if (userRole !== "SUPER_ADMIN") {
          setScheduleData((prev) => ({ ...prev, express: expressId }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const conflict = existingSchedules.find(
      (sch) =>
        sch.express.id === scheduleData.express &&
        sch.date === scheduleData.date &&
        sch.time === scheduleData.time &&
        sch.destination.id === scheduleData.destination
    );

    if (conflict) {
      return alert("This express already has a schedule for the selected destination at this time!");
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...scheduleData,
        express:
          role === "SUPER_ADMIN"
            ? expressList.find((exp) => exp.id === scheduleData.express)
            : { id: scheduleData.express },
        bus: { id: scheduleData.bus },
        destination: { id: scheduleData.destination },
      };

      const response = await fetch("http://localhost:5000/api/schedules/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save schedule");
      }

      alert("Schedule added successfully!");
      history.push("/admin/schedules");
    } catch (error) {
      console.error(error);
      alert("Error saving schedule: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/schedules");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">Add New Schedule</h6>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
                    value={scheduleData.express}
                    onChange={handleInputChange}
                    required
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bus *</label>
                <select
                  name="bus"
                  value={scheduleData.bus}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Bus</option>
                  {busList.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.plateNo} ({bus.busName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
                <select
                  name="destination"
                  value={scheduleData.destination}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Destination</option>
                  {destinationList.map((dest) => (
                    <option key={dest.id} value={dest.id}>
                      {dest.fromLocation} - {dest.toLocation}
                    </option>
                  ))}
                </select>
              </div>
 

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={scheduleData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={scheduleData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button> &nbsp; &nbsp; &nbsp;
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
              >
                <i className="fas fa-save mr-2"></i> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
