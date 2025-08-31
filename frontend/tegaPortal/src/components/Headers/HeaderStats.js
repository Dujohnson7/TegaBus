import React, { useState, useEffect } from "react";
import CardStats from "components/Cards/CardStats.js";

export default function HeaderStats() {
  const [stats, setStats] = useState({
    tickets: 0,
    buses: 0,
    destinations: 0,
    employees: 0,
  });
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const expressId = localStorage.getItem("expressId");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Express-Id": expressId || "",
        };
 
        const ticketResponse = await fetch(`${API_URL}/api/dashboard/ticket/current-month`, {
          method: "GET",
          headers,
        });
        if (!ticketResponse.ok) throw new Error("Failed to fetch tickets");
        const tickets = await ticketResponse.json();
 
        const busResponse = await fetch(`${API_URL}/api/dashboard/bus`, {
          method: "GET",
          headers,
        });
        if (!busResponse.ok) throw new Error("Failed to fetch buses");
        const buses = await busResponse.json();
 
        const destinationResponse = await fetch(`${API_URL}/api/dashboard/destination`, {
          method: "GET",
          headers,
        });
        if (!destinationResponse.ok) throw new Error("Failed to fetch destinations");
        const destinations = await destinationResponse.json();
 
        const employeeResponse = await fetch(`${API_URL}/api/dashboard/employee`, {
          method: "GET",
          headers,
        });
        if (!employeeResponse.ok) throw new Error("Failed to fetch employees");
        const employees = await employeeResponse.json();

        setStats({
          tickets: tickets.length,
          buses: buses.length,
          destinations: destinations.length,
          employees: employees.length,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center p-6">Loading dashboard...</div>;
  }

  return (
    <>
      {/* Header */}
      <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Tickets Sold"
                  statTitle={stats.tickets.toString()}
                  statDescription="This Month"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Buses"
                  statTitle={stats.buses.toString()}
                  statDescription="Total Active"
                  statIconName="fas fa-bus"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Destinations"
                  statTitle={stats.destinations.toString()}
                  statDescription="Total Active"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Employees"
                  statTitle={stats.employees.toString()}
                  statDescription="Total Active"
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}