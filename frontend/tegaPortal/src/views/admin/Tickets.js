import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Tickets() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/tickets";

  const [searchTerm, setSearchTerm] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);  
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage, setTicketsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const expressId = localStorage.getItem("expressId");

      if (!token) {
        alert("You are not logged in. Redirecting to login page.");
        history.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Express-Id": expressId || "",
        },
      });

      if (response.status === 401) {
        alert("Unauthorized access. Please log in again.");
        history.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTicketList(data); 
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      alert(`Failed to fetch tickets: ${error.message}`);
      setLoading(false);
    }
  };

  const filteredTicketList = ticketList.filter((ticket) => {
    const search = searchTerm.toLowerCase();
    const scheduleIds = Array.isArray(ticket.schedule)
      ? ticket.schedule.map((s) => s?.id).join(" ")
      : ticket.schedule?.id || "";
    return (
      ticket.names?.toLowerCase().includes(search) ||
      ticket.phone?.toLowerCase().includes(search) ||
      ticket.express?.expressName?.toLowerCase().includes(search) ||
      scheduleIds.includes(search) ||
      ticket.payState?.toLowerCase().includes(search) ||
      new Date(ticket.date).toLocaleDateString().includes(search)
    );
  });
 
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTicketList.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTicketList.length / ticketsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        alert("Unauthorized access. Please log in again.");
        history.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTicketList(ticketList.filter((ticket) => ticket.id !== id));
      alert("Ticket deleted successfully!");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert(`Failed to delete ticket: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNew = () => history.push("/admin/tickets/add");
  const handleUpdate = (id) => history.push(`/admin/tickets/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading tickets...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-12/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
              <h3 className="font-semibold text-lg text-blueGray-700">Tickets List</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                /> &nbsp; &nbsp;
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                  disabled={deleting}
                >
                  <i className="fas fa-plus mr-2"></i> Add
                </button>
              </div>
            </div>

            <div className="block w-full overflow-x-auto">
              <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">#</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Passenger</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Phone</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Express</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Route</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Date</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Time</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Amount</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Payment</th>
                    <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTickets.map((ticket, index) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 text-xs">{indexOfFirstTicket + index + 1}</td>
                      <td className="px-6 py-4 text-xs">{ticket.names || "-"}</td>
                      <td className="px-6 py-4 text-xs">{ticket.phone || "-"}</td>
                      <td className="px-6 py-4 text-xs">{ticket.express?.expressName || "-"}</td>
                      <td className="px-6 py-4 text-xs">
                        {ticket.schedule?.destination
                          ? `${ticket.schedule.destination.fromLocation} - ${ticket.schedule.destination.toLocation}`
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-xs">{ticket.schedule?.date || "-"}</td>
                      <td className="px-6 py-4 text-xs">{ticket.schedule?.time || "-"}</td>
                      <td className="px-6 py-4 text-xs">{ticket.totalAmount ? `${ticket.totalAmount} RWF` : "-"}</td>
                      <td className="px-6 py-4 text-xs">{ticket.payState || "-"}</td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(ticket.id)}
                            className="px-3 py-1 bg-blueGray-600 text-white rounded text-xs hover:bg-blueGray-700 font-medium"
                            disabled={deleting}
                          >
                            <i className="fas fa-ticket-alt mr-2"></i>
                          </button> &nbsp; &nbsp; &nbsp;
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 font-medium"
                            disabled={deleting}
                          >
                            <i className="fas fa-trash mr-1"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentTickets.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center py-4 text-sm text-gray-500">
                        No tickets found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600"> &nbsp; &nbsp;Rows per page:</span> &nbsp;
                  <select
                    value={ticketsPerPage}
                    onChange={(e) => {
                      setTicketsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-2 py-1 border rounded-md text-sm"
                  >
                    {[10, 20, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}  &nbsp; &nbsp;
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