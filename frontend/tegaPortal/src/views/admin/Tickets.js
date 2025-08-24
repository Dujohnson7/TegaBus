import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CardTable from "components/Cards/CardTable.js";

export default function Tickets() {
  const history = useHistory();
  const API_URL = "http://localhost:5000/api/tickets";

  const [searchTerm, setSearchTerm] = useState("");
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      const expressId = localStorage.getItem("expressId");

      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Express-Id": expressId || "",
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setTicketList(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setTicketList(ticketList.filter(t => t.id !== id));
      alert("Deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete ticket: " + error.message);
    }
  };

  const filteredTickets = ticketList.filter(ticket => {
    const search = searchTerm.toLowerCase();
    return (
      ticket.names?.toLowerCase().includes(search) ||
      ticket.phone?.toLowerCase().includes(search) ||
      ticket.express?.expressName?.toLowerCase().includes(search) ||
      ticket.schedule?.map(s => s?.id).join(" ").includes(search) ||
      ticket.payState?.toLowerCase().includes(search)
    );
  });

  const handleAdd = () => history.push("/admin/tickets/add");
  const handleEdit = id => history.push(`/admin/tickets/edit/${id}`);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="flex flex-wrap mt-4">
      <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <CardTable>
            <div className="flex justify-between mb-4">
              <h3>Tickets List</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button onClick={handleAdd} className="px-3 py-1 bg-teal-500 text-white rounded">Add</button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Passenger</th>
                    <th>Phone</th>
                    <th>Express</th>
                    <th>Schedule(s)</th>
                    <th>Seat No</th>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t, idx) => (
                    <tr key={t.id}>
                      <td>{idx + 1}</td>
                      <td>{t.names}</td>
                      <td>{t.phone}</td>
                      <td>{t.express?.expressName}</td>
                      <td>{t.schedule?.map(s => `${s.fromLocation} - ${s.toLocation}`).join(", ")}</td>
                      <td>{t.seatNo}</td>
                      <td>{t.payState}</td>
                      <td>{new Date(t.date).toLocaleDateString()}</td>
                      <td>
                        <button onClick={() => handleEdit(t.id)} className="px-2 py-1 bg-blue-500 text-white rounded mr-1">Edit</button>
                        <button onClick={() => handleDelete(t.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardTable>
        </div>
      </div>
    </div>
  );
}
