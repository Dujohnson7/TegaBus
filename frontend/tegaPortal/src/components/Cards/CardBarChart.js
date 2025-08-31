import React, { useEffect, useState } from "react";
import Chart from "chart.js";

export default function CardBarChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWeeklyTickets = async () => {
      try {
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1));
        startOfWeek.setHours(0, 0, 0, 0);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/reports/date-range?start=${startOfWeek.getTime()}&end=${endOfWeek.getTime()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to fetch tickets:", response.status, errorText);
          return;
        }

        const tickets = await response.json();
        console.log("Fetched tickets for bar chart:", tickets);  

        const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const paid = Array(7).fill(0);
        const unpaid = Array(7).fill(0);

        tickets.forEach(ticket => {
          const ticketDate = new Date(ticket.date);
          const day = ticketDate.getDay();
          const index = day === 0 ? 6 : day - 1;
           
          if (ticket.payState === "PAID" || ticket.payState === "paid") {
            paid[index] += 1;
          } else {
            unpaid[index] += 1;
          }
        });

        console.log("Paid tickets per day:", paid);  
        console.log("Unpaid tickets per day:", unpaid); 

        setChartData({
          labels,
          datasets: [
            {
              label: "Paid Tickets",
              backgroundColor: "rgba(34,197,94,0.8)",
              data: paid,
              barThickness: 8,
            },
            {
              label: "Unpaid Tickets",
              backgroundColor: "rgba(239,68,68,0.8)",
              data: unpaid,
              barThickness: 8,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchWeeklyTickets();
  }, []);

  useEffect(() => {
    if (!chartData) return;

    const ctx = document.getElementById("bar-chart").getContext("2d");
    if (window.myBar) window.myBar.destroy();

    window.myBar = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: { 
          position: "bottom",
          labels: {
            fontColor: "#4B5563"  
          }
        },
        scales: {
          xAxes: [{ 
            ticks: { 
              autoSkip: false,
              fontColor: "#4B5563"
            },
            gridLines: {
              display: false
            }
          }],
          yAxes: [{ 
            ticks: { 
              beginAtZero: true, 
              precision: 0,
              fontColor: "#4B5563"
            },
            gridLines: {
              color: "rgba(0,0,0,0.1)"
            }
          }],
        },
      },
    });

    return () => window.myBar && window.myBar.destroy();
  }, [chartData]);

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t px-4 py-3 bg-transparent">
        <h2 className="text-blueGray-700 text-xl font-semibold">Ticket Sales</h2>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas id="bar-chart"></canvas>
        </div>
      </div>
    </div>
  );
}