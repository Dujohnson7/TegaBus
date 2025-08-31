import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Schedules() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/schedules";
  const [searchTerm, setSearchTerm] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [schedulesPerPage, setSchedulesPerPage] = useState(10);
 
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userRole = user.role;  

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
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
      console.log("Fetched schedules:", data);
      setScheduleList(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      setLoading(false);
    }
  };

  const filteredScheduleList = scheduleList.filter((schedule) => {
    const search = searchTerm.toLowerCase();
    return (
      schedule.express?.expressName?.toLowerCase().includes(search) ||
      schedule.bus?.busName?.toLowerCase().includes(search) ||
      schedule.destination?.toLowerCase().includes(search) ||
      schedule.date?.toLowerCase().includes(search) ||
      schedule.status?.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const indexOfLastSchedule = currentPage * schedulesPerPage;
  const indexOfFirstSchedule = indexOfLastSchedule - schedulesPerPage;
  const currentSchedules = filteredScheduleList.slice(
    indexOfFirstSchedule,
    indexOfLastSchedule
  );
  const totalPages = Math.ceil(filteredScheduleList.length / schedulesPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setScheduleList(scheduleList.filter((schedule) => schedule.id !== id));
      alert("Schedule deleted successfully!");
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("Failed to delete schedule: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNew = () => history.push("/admin/schedules/add");
  const handleUpdate = (id) => history.push(`/admin/schedules/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading schedules...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-10/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-blueGray-700">Schedules List</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search schedules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                /> 
                {userRole !== "DRIVER" && (
                  <>
                    &nbsp; &nbsp; &nbsp;
                    <button
                      onClick={handleAddNew}
                      className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                      disabled={deleting}
                    >
                      <i className="fas fa-plus mr-2"></i> Add
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">#</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Express</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Bus</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Destination</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Arrival</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Date</th> 
                    {userRole !== "DRIVER" && (
                      <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentSchedules.map((schedule, index) => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 text-xs">{indexOfFirstSchedule + index + 1}</td>
                      <td className="px-6 py-4 text-xs">{schedule.express?.expressName || "-"}</td>
                      <td className="px-6 py-4 text-xs">{schedule.bus?.busName || "-"}</td>
                      <td className="px-6 py-4 text-xs">
                        {schedule.destination
                          ? `${schedule.destination.fromLocation} - ${schedule.destination.toLocation}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs">{schedule.time}</td>
                      <td className="px-6 py-4 text-xs">{schedule.date}</td> 
                      {userRole !== "DRIVER" && (
                        <td className="px-6 py-4 text-xs">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUpdate(schedule.id)}
                              className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                              disabled={deleting}
                            >
                              <i className="fas fa-edit mr-1"></i>
                            </button>
                            &nbsp;&nbsp;&nbsp;
                            <button
                              onClick={() => handleDelete(schedule.id)}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium"
                              disabled={deleting}
                            >
                              <i className="fas fa-trash mr-1"></i>
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {currentSchedules.length === 0 && (
                    <tr>
                      <td 
                        colSpan={userRole !== "DRIVER" ? "7" : "6"} 
                        className="text-center py-4 text-sm text-gray-500"
                      >
                        No schedules found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  &nbsp; &nbsp; <span className="text-sm text-gray-600">Rows per page:  &nbsp; &nbsp;</span>
                  <select
                    value={schedulesPerPage}
                    onChange={(e) => {
                      setSchedulesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size} &nbsp; &nbsp;
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || deleting}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === i + 1
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      disabled={deleting}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || deleting}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button> &nbsp; &nbsp;
                </div>
              </div> 
            )}
            <br />
          </CardTable>
        </div>
      </div>
    </div>
  );
}