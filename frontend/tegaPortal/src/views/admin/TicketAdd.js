import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [existingTickets, setExistingTickets] = useState([]);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [availableSeats, setAvailableSeats] = useState([]);

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

        // Fetch existing tickets
        const ticketsResponse = await fetch("http://localhost:5000/api/tickets/all", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ticketsResponse.ok) throw new Error("Cannot fetch tickets");
        setExistingTickets(await ticketsResponse.json());

        // Set default express for non-admin
        if (userRole !== "SUPER_ADMIN") {
          setTicketData(prev => ({ ...prev, express: expressId }));
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

    const selectedSchedule = scheduleList.find(s => s.id === ticketData.schedule);
    if (!selectedSchedule) return;

    // Find already booked seats
    const bookedSeats = existingTickets
      .filter(t => t.schedule?.some(sch => sch.id === ticketData.schedule))
      .map(t => t.seatNo);

    const busCapacity = selectedSchedule.bus?.capacity || 0;
    const remainingSeats = [];
    for (let i = 1; i <= busCapacity; i++) {
      if (!bookedSeats.includes(i)) remainingSeats.push(i);
    }

    setAvailableSeats(remainingSeats);
    setTicketData(prev => ({
      ...prev,
      seatNo: remainingSeats.length > 0 ? remainingSeats[0] : "",
    }));
  }, [ticketData.schedule, scheduleList, existingTickets]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const generatePDF = (ticket) => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    doc.text("Bus Ticket", 105, y, null, null, "center");
    y += 10;
    doc.setFontSize(12);
    doc.text(`Name: ${ticket.names}`, 20, y);
    y += 8;
    doc.text(`Phone: ${ticket.phone}`, 20, y);
    y += 8;
    doc.text(`Email: ${ticket.email}`, 20, y);
    y += 8;
    doc.text(`Express: ${ticket.express.expressName}`, 20, y);
    y += 8;
    doc.text(`Schedule: ${ticket.schedule.map(s => s.fromLocation + " - " + s.toLocation).join(", ")}`, 20, y);
    y += 8;
    doc.text(`Date: ${new Date(ticket.date).toLocaleDateString()}`, 20, y);
    y += 8;
    doc.text(`Bus Plate: ${ticket.busPlateNo}`, 20, y);
    y += 8;
    doc.text(`Seat Number: ${ticket.seatNo}`, 20, y);
    y += 8;
    doc.text(`Ticket Number: ${ticket.tickeNumber}`, 20, y);

    doc.save(`ticket-${ticket.tickeNumber}.pdf`);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!ticketData.seatNo) return alert("No seats available.");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...ticketData,
        express: role === "SUPER_ADMIN"
          ? expressList.find(exp => exp.id === ticketData.express)
          : { id: ticketData.express },
        schedule: [{ id: ticketData.schedule }],
      };

      const response = await fetch("http://localhost:5000/api/tickets/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      const savedTicket = await response.json();
      alert("Ticket added successfully!");
      generatePDF(savedTicket);
      history.push("/admin/tickets");
    } catch (error) {
      console.error(error);
      alert("Error saving ticket: " + error.message);
    }
  };

  const handleCancel = () => history.push("/admin/tickets");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex justify-center mt-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Passenger Name *</label>
              <input type="text" name="names" value={ticketData.names} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label>Email</label>
              <input type="email" name="email" value={ticketData.email} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
              <label>Phone *</label>
              <input type="text" name="phone" value={ticketData.phone} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
            </div>

            {role === "SUPER_ADMIN" && (
              <div>
                <label>Express *</label>
                <select name="express" value={ticketData.express} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded">
                  <option value="">Select Express</option>
                  {expressList.map(exp => (
                    <option key={exp.id} value={exp.id}>{exp.expressName}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label>Schedule *</label>
              <select name="schedule" value={ticketData.schedule} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded">
                <option value="">Select Schedule</option>
                {scheduleList.map(sch => (
                  <option key={sch.id} value={sch.id}>
                    {sch.destination.fromLocation} - {sch.destination.toLocation} ({sch.date} {sch.time})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Seat Number * (Available: {availableSeats.length})</label>
              <input type="number" name="seatNo" value={ticketData.seatNo || ""} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
            </div>

            <div>
              <label>Payment Status *</label>
              <select name="payState" value={ticketData.payState} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded">
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            <div>
              <label>Date *</label>
              <input type="date" name="date" value={ticketData.date} onChange={handleInputChange} required className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-black text-white rounded" disabled={availableSeats.length === 0}>Save Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}
