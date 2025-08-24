import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function TicketAdd() {
  const history = useHistory();

  const [ticketData, setTicketData] = useState({
    names: "",
    email: "",
    phone: "",
    express: "",
    schedule: "",
    payState: "PENDING",
    date: "",
    seatNo: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [role, setRole] = useState("");
  const [existingTickets, setExistingTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
  try {
    const token = localStorage.getItem("token");
    const expressId = localStorage.getItem("expressId");

    // Role
    let userRole = "";
    const userObj = localStorage.getItem("user");
    if (userObj) {
      const user = JSON.parse(userObj);
      userRole = user.role ? user.role.toUpperCase() : "";
    } else {
      userRole = localStorage.getItem("role") ? localStorage.getItem("role").toUpperCase() : "";
    }
    setRole(userRole);

    // Fetch express list
    const expressResponse = await fetch("http://localhost:5000/api/express/all", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!expressResponse.ok) throw new Error("Cannot fetch express list");
    setExpressList(await expressResponse.json());

    // Fetch schedules
    const scheduleResponse = await fetch("http://localhost:5000/api/schedules/all", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, "X-Express-Id": expressId || "" },
    });
    if (!scheduleResponse.ok) throw new Error("Cannot fetch schedule list");
    setScheduleList(await scheduleResponse.json());

    // Fetch tickets
    const ticketsResponse = await fetch("http://localhost:5000/api/tickets/all", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!ticketsResponse.ok) throw new Error("Cannot fetch existing tickets");
    setExistingTickets(await ticketsResponse.json());

    // Auto-set express for non-admin
    if (userRole !== "SUPER_ADMIN") {
      setTicketData((prev) => ({ ...prev, express: expressId }));
    }

    setLoading(false);
  } catch (error) {
    console.error("Error fetching data:", error);
    setLoading(false);
    alert(error.message);  
  }
};


    fetchData();
  }, []);
 
  useEffect(() => {
    if (!ticketData.schedule) return;

    const selectedSchedule = scheduleList.find((s) => s.id === ticketData.schedule);
    if (!selectedSchedule) return;

    const bookedSeats = existingTickets
      .filter((t) => t.schedule.some((sch) => sch.id === ticketData.schedule))
      .map((t) => t.bus.busSeat);

    const remainingSeats = selectedSchedule.bus.capacity - bookedSeats.length;
    setAvailableSeats(remainingSeats);
 
    const nextSeat = [];
    for (let i = 1; i <= selectedSchedule.bus.busSeat; i++) {
      if (!bookedSeats.includes(i)) {
        nextSeat.push(i);
      }
    }
    setTicketData((prev) => ({
      ...prev,
      seatNo: nextSeat.length > 0 ? nextSeat[0] : "",
    }));
  }, [ticketData.schedule, scheduleList, existingTickets]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ticketData.seatNo) {
      return alert("No seats available for the selected schedule.");
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...ticketData,
        express: role === "SUPER_ADMIN"
          ? expressList.find((exp) => exp.id === ticketData.express)
          : { id: ticketData.express },
        schedule: [{ id: ticketData.schedule }],
      };

      const response = await fetch("http://localhost:5000/api/tickets/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save ticket");
      }

      alert("Ticket added successfully!");
      history.push("/admin/tickets");
    } catch (error) {
      console.error(error);
      alert("Error saving ticket: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/tickets");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">Add New Ticket</h6>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Name *</label>
                <input
                  type="text"
                  name="names"
                  value={ticketData.names}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={ticketData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                <input
                  type="text"
                  name="phone"
                  value={ticketData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>

              {role === "SUPER_ADMIN" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Express *</label>
                  <select
                    name="express"
                    value={ticketData.express}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Express</option>
                    {expressList.map((exp) => (
                      <option key={exp.id} value={exp.id}>{exp.expressName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule *</label>
                <select
                  name="schedule"
                  value={ticketData.schedule}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Select Schedule</option>
                  {scheduleList.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.destination.fromLocation} - {sch.destination.toLocation} ({sch.date} {sch.time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seat Number * (Available: {availableSeats})
                </label>
                <input
                  type="number"
                  name="seatNo"
                  value={ticketData.seatNo || ""}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status *</label>
                <select
                  name="payState"
                  value={ticketData.payState}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={ticketData.date}
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
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700"
                disabled={availableSeats === 0}
              >
                <i className="fas fa-save mr-2"></i> Save Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

