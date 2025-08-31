import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
 
const generateTicketNumber = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 5);
  return `TKT-${timestamp}-${randomStr}`.toUpperCase();
};

export default function TicketEdit() {
  const history = useHistory();
  const { id } = useParams();  

  const [ticketData, setTicketData] = useState({
    ticketNumber: "",
    names: "",
    phone: "",
    express: "",
    schedule: "",
    busPlateNo: "",
    seatNo: "",
    totalAmount: 0,
    payState: "PAID",
    date: "",  
  });

  const [expressList, setExpressList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [busList, setBusList] = useState([]);
  const [role, setRole] = useState("");
  const [existingTickets, setExistingTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [error, setError] = useState("");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const expressId = localStorage.getItem("expressId");

        if (!token) {
          alert("You are not logged in. Redirecting to login page.");
          history.push("/login");
          return;
        }
 
        let userRole = "";
        const userObj = localStorage.getItem("user");
        if (userObj) {
          const user = JSON.parse(userObj);
          userRole = user.role ? user.role.toUpperCase() : "";
        } else {
          userRole = localStorage.getItem("role") ? localStorage.getItem("role").toUpperCase() : "";
        }
        setRole(userRole);
 
        const ticketResponse = await fetch(`http://localhost:5000/api/tickets/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Express-Id": expressId || "",
          },
        });

        if (!ticketResponse.ok) {
          throw new Error(`Failed to fetch ticket data: ${ticketResponse.status}`);
        }

        const ticket = await ticketResponse.json();
        setTicketData({
          ticketNumber: ticket.ticketNumber || "",
          names: ticket.names || "",
          phone: ticket.phone || "",
          express: ticket.express?.id || "",
          schedule: ticket.schedule?.id || "",
          busPlateNo: ticket.busPlateNo || "",
          seatNo: ticket.seatNo || "",
          totalAmount: ticket.totalAmount || 0,
          payState: ticket.payState || "PAID",
          date: ticket.date || ticket.schedule?.date || "",  
        });
 
        const expressResponse = await fetch("http://localhost:5000/api/express/all", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!expressResponse.ok) {
          if (expressResponse.status === 403) {
            throw new Error("Access forbidden. Please check your authentication.");
          }
          throw new Error("Cannot fetch express list");
        }

        const expresses = await expressResponse.json();
        setExpressList(expresses);
 
        let schedules = [];
        let scheduleResponse;

        try {
          scheduleResponse = await fetch("http://localhost:5000/api/tickets/schedule", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Express-Id": expressId || "",
            },
          });

          if (!scheduleResponse.ok) {
            scheduleResponse = await fetch("http://localhost:5000/api/tickschedule", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-Express-Id": expressId || "",
              },
            });
          }

          if (!scheduleResponse.ok) {
            if (scheduleResponse.status === 403) {
              throw new Error("Access forbidden to schedules. Check your permissions.");
            }
            throw new Error("Cannot fetch schedule list");
          }

          schedules = await scheduleResponse.json();
        } catch (scheduleError) {
          console.error("Schedule fetch error:", scheduleError);
          schedules = [];
        }

        const today = new Date();
        const filteredSchedules = schedules.filter((sch) => {
          if (!sch || !sch.date) return false;
          const scheduleDate = new Date(sch.date);
          const isNotExpired = scheduleDate >= today;
          const matchesExpress = userRole === "SUPER_ADMIN" ? true : (sch.express && sch.express.id === expressId);
          return isNotExpired && matchesExpress && sch.express;
        });

        const finalSchedules = userRole !== "SUPER_ADMIN" && expressId
          ? filteredSchedules.filter((sch) => sch.express && sch.express.id === expressId)
          : filteredSchedules;

        setScheduleList(finalSchedules);
 
        try {
          const busResponse = await fetch("http://localhost:5000/api/tickets/bus", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Express-Id": expressId || "",
            },
          });

          if (busResponse.ok) {
            setBusList(await busResponse.json());
          }
        } catch (busError) {
          console.error("Bus fetch error:", busError);
        }
 
        try {
          const ticketsResponse = await fetch("http://localhost:5000/api/tickets/all", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Express-Id": expressId || "",
            },
          });

          if (ticketsResponse.ok) {
            setExistingTickets(await ticketsResponse.json());
          }
        } catch (ticketError) {
          console.error("Tickets fetch error:", ticketError);
        }

        if (userRole !== "SUPER_ADMIN" && expressId) {
          setTicketData((prev) => ({ ...prev, express: expressId }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
        alert("Error: " + error.message);
      }
    };

    fetchData();
  }, [id, history]);
 
  useEffect(() => {
    if (!ticketData.schedule) return;

    const selectedSchedule = scheduleList.find((s) => s.id === ticketData.schedule);
    if (!selectedSchedule || !selectedSchedule.bus) return;

    const bookedSeats = existingTickets
      .filter((t) => t.schedule && t.schedule.id === ticketData.schedule && t.id !== id)
      .map((t) => t.seatNo);

    const remainingSeats = selectedSchedule.bus.busSize - bookedSeats.length;
    setAvailableSeats(remainingSeats);

    const nextSeat = [];
    for (let i = 1; i <= selectedSchedule.bus.busSize; i++) {
      if (!bookedSeats.includes(i)) {
        nextSeat.push(i);
      }
    }
    setTicketData((prev) => ({
      ...prev,
      seatNo: nextSeat.includes(parseInt(prev.seatNo)) ? prev.seatNo : (nextSeat.length > 0 ? nextSeat[0] : ""),
      busPlateNo: selectedSchedule.bus.plateNo,
      totalAmount: selectedSchedule.destination.cost || 0,
      date: selectedSchedule.date || prev.date,  
    }));
  }, [ticketData.schedule, scheduleList, existingTickets, id]);
 
  useEffect(() => {
    if (role !== "SUPER_ADMIN" || !ticketData.express) return;

    const fetchSchedulesForExpress = async () => {
      try {
        const token = localStorage.getItem("token");

        let scheduleResponse = await fetch("http://localhost:5000/api/tickets/schedule", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Express-Id": ticketData.express,
          },
        });

        if (!scheduleResponse.ok) {
          scheduleResponse = await fetch("http://localhost:5000/api/tickschedule", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-Express-Id": ticketData.express,
            },
          });
        }

        if (!scheduleResponse.ok) throw new Error("Cannot fetch schedules for express");

        const schedules = await scheduleResponse.json();

        const today = new Date();
        const filteredSchedules = schedules.filter((sch) => {
          if (!sch || !sch.date) return false;
          const scheduleDate = new Date(sch.date);
          return scheduleDate >= today && sch.express && sch.express.id === ticketData.express && sch.express;
        });

        setScheduleList(filteredSchedules);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setError(error.message);
      }
    };

    fetchSchedulesForExpress();
  }, [ticketData.express, role]);

  const generateQRCodeData = (ticket, selectedSchedule, selectedExpress) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const qrData = `
      Ticket: ${ticket.ticketNumber}
      Express: ${selectedExpress.expressName}
      Route: ${selectedSchedule.destination.fromLocation} - ${selectedSchedule.destination.toLocation}
      Time: ${selectedSchedule.time}
      Date: ${formatDate(selectedSchedule.date)}
      Bus: ${ticket.busPlateNo}
      Seat: ${ticket.seatNo}
      Passenger: ${ticket.names}
      Amount: ${ticket.totalAmount} Rwf
      Status: ${ticket.payState}
      Powered By TEGABUS
    `.trim();

    return qrData;
  };

  const generateQRCodeImage = async (qrCodeData) => {
    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
        width: 120,
        margin: 1,
        color: {
          dark: "#2c3e50",
          light: "#ffffff",
        },
      });
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  };

  const generatePDF = async (ticket) => {
    const selectedSchedule = scheduleList.find((s) => s.id === ticket.schedule.id);
    const selectedExpress = expressList.find((e) => e.id === ticket.express.id);

    if (!selectedSchedule || !selectedExpress) {
      console.error("Missing schedule or express data:", { selectedSchedule, selectedExpress });
      alert("Cannot generate PDF: Missing schedule or express data.");
      return;
    }

    const logoUrl = `http://localhost:5000/uploads/${selectedExpress.expressLogo}`;
    const doc = new jsPDF();

    const qrCodeData = generateQRCodeData(ticket, selectedSchedule, selectedExpress);

    doc.setFillColor(74, 107, 136);
    doc.rect(0, 0, 210, 25, "F");

    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text(`${selectedExpress.expressName || "N/A"}`, 105, 12, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Premium Travel Experience", 105, 18, { align: "center" });

    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 30, 190, 130, 8, 8, "FD");

    doc.setDrawColor(74, 107, 136);
    doc.setLineWidth(1);
    doc.roundedRect(12, 32, 186, 126, 6, 6, "S");

    doc.setFillColor(74, 107, 136);
    doc.roundedRect(15, 35, 180, 15, 4, 4, "F");

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.text("ELECTRONIC TICKET", 105, 45, { align: "center" });

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(70, 55, 70, 8, 4, 4, "F");

    doc.setFontSize(10);
    doc.setTextColor(74, 107, 136);
    doc.setFont(undefined, "bold");
    doc.text(`Ticket #: ${ticket.ticketNumber || "N/A"}`, 105, 60, { align: "center" });

    try {
      const qrCodeDataURL = await generateQRCodeImage(qrCodeData);

      doc.setFillColor(250, 250, 250);
      doc.roundedRect(135, 70, 60, 80, 5, 5, "F");
      doc.setDrawColor(200, 200, 200);
      doc.roundedRect(135, 70, 60, 80, 5, 5, "S");

      doc.addImage(qrCodeDataURL, "PNG", 140, 75, 50, 50);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("Scan Me", 165, 130, { align: "center" });
    } catch (error) {
      console.error("Error generating QR code:", error);
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text("QR Code Error", 160, 85, { align: "center" });
    }

    doc.setFontSize(12);
    doc.setTextColor(74, 107, 136);
    doc.setFont(undefined, "bold");
    doc.text("PASSENGER DETAILS", 65, 75);

    doc.setDrawColor(74, 107, 136);
    doc.setLineWidth(0.5);
    doc.line(20, 78, 130, 78);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(`Name: ${ticket.names || "-"}`, 20, 85);
    doc.text(`Phone: ${ticket.phone || "-"}`, 20, 92);

    doc.setFontSize(12);
    doc.setTextColor(74, 107, 136);
    doc.setFont(undefined, "bold");
    doc.text("JOURNEY INFORMATION", 65, 110);

    doc.line(20, 113, 130, 113);

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.text(
      `Route: ${selectedSchedule.destination.fromLocation} - ${selectedSchedule.destination.toLocation}`,
      20,
      120
    );
    doc.text(`Time: ${selectedSchedule.time || "-"}`, 20, 127);
    doc.text(
      `Date: ${selectedSchedule.date ? new Date(selectedSchedule.date).toLocaleDateString() : "-"}`,
      20,
      134
    );

    doc.text(`Bus: ${ticket.busPlateNo || "-"}`, 20, 141);
    doc.text(`Seat: ${ticket.seatNo || "-"}`, 80, 141);

    if (ticket.payState === "PAID") {
      doc.setFillColor(76, 175, 80);
    } else {
      doc.setFillColor(244, 67, 54);
    }
    doc.roundedRect(20, 148, 50, 8, 4, 4, "F");

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(`Status: ${ticket.payState || "PENDING"}`, 45, 153, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Price: ${ticket.totalAmount || 0} Rwf`, 100, 153);

    doc.setFillColor(74, 107, 136);
    doc.rect(0, 165, 210, 15, "F");

    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Powered By TEGABUS", 105, 172, { align: "center" });

    doc.setFillColor(44, 62, 80);
    for (let i = 0; i < 210; i += 10) {
      doc.circle(i, 180, 1, "F");
    }

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Please present this ticket during boarding • Please come early if you delay Ticket will be Expired • Thank you for traveling with us!",
      105,
      185,
      { align: "center" }
    );

    doc.text("Generated on " + new Date().toLocaleString(), 105, 190, { align: "center" });

    try {
      doc.addImage(logoUrl, "PNG", 175, 3, 25, 20, undefined, "FAST");
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }

    doc.save(`ticket_${ticket.ticketNumber || "unknown"}.pdf`);

    const pdfOutput = doc.output("bloburl");
    const printWindow = window.open(pdfOutput);
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
        }, 500);
      };
    } else {
      console.error("Failed to open print window. Ensure pop-ups are allowed.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target; 
    if (name === "ticketNumber") return;
    setTicketData({ ...ticketData, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!ticketData.seatNo) {
    return alert("No seats available for the selected schedule.");
  }

  if (!ticketData.date) {
    return alert("Ticket date is missing. Please select a valid schedule.");
  }

  try {
    const token = localStorage.getItem("token");
    const expressId = localStorage.getItem("expressId");

    const payload = {
      id: id,
      ticketNumber: ticketData.ticketNumber, 
      names: ticketData.names,
      phone: ticketData.phone,
      express: { id: ticketData.express },
      schedule: { id: ticketData.schedule },
      busPlateNo: ticketData.busPlateNo,
      seatNo: parseInt(ticketData.seatNo),
      totalAmount: parseFloat(ticketData.totalAmount),
      payState: ticketData.payState,
      date: ticketData.date,  
    };

    console.log("Payload sent to backend:", payload);

    const response = await fetch(`http://localhost:5000/api/tickets/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Express-Id": expressId || "",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Failed to update ticket: ${response.status}`);
    }

    const updatedTicket = await response.json();
    alert("Ticket updated successfully!");
 
    if (updatedTicket.payState !== "PENDING") {
      await generatePDF(updatedTicket);
    } else {
      console.log("PDF generation skipped: Payment status is PENDING");
    }

    history.push("/admin/tickets");
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("Error updating ticket: " + error.message);
  }
};

  const handleCancel = () => history.push("/admin/tickets");

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-white border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6 flex justify-between items-center">
            <h6 className="text-blueGray-700 text-xl font-bold">Edit Ticket</h6>
            <button
              onClick={handleCancel}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Back
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-6 mt-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Number</label>
                <input
                  type="text"
                  name="ticketNumber"
                  value={ticketData.ticketNumber}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Name *</label>
                <input
                  type="text"
                  name="names"
                  value={ticketData.names}
                  onChange={handleInputChange}
                  readOnly={role !== "SUPER_ADMIN"}
                  required
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
                  readOnly={role !== "SUPER_ADMIN"}
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
                  readOnly={role !== "SUPER_ADMIN"}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Bus Plate Number *</label>
                <input
                  type="text"
                  name="busPlateNo"
                  value={ticketData.busPlateNo}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                />
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost *</label>
                <input
                  type="number"
                  name="totalAmount"
                  value={ticketData.totalAmount}
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
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={availableSeats === 0 || !ticketData.date}
              >
                <i className="fas fa-ticket-alt mr-2"></i> Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 