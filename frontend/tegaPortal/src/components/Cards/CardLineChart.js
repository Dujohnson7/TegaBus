import React, { useEffect, useState } from "react";
import Chart from "chart.js";

export default function CardLineChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWeeklyRevenue = async () => {
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
          console.error("Failed to fetch revenue:", response.status, errorText);
          return;
        }

        const tickets = await response.json();
        console.log("Fetched tickets:", tickets); 

        const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const revenuePerDay = Array(7).fill(0);

        tickets.forEach(ticket => {
          const ticketDate = new Date(ticket.date);
          const day = ticketDate.getDay();  
          const index = day === 0 ? 6 : day - 1;  
          revenuePerDay[index] += ticket.totalAmount || 0;
        });

        console.log("Revenue per day:", revenuePerDay);  
        setChartData({
          labels,
          datasets: [
            {
              label: "Revenue (RWF)",
              backgroundColor: "rgba(59,130,246,0.1)",
              borderColor: "rgb(59,130,246)",
              data: revenuePerDay,
              fill: true,
              tension: 0.4,
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }
    };

    fetchWeeklyRevenue();
  }, []);

  useEffect(() => {
    if (!chartData) return;

    const ctx = document.getElementById("line-chart").getContext("2d");
    if (window.myLine) window.myLine.destroy();

    window.myLine = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        legend: { labels: { fontColor: "white" }, align: "end", position: "bottom" },
        scales: {
          xAxes: [{ ticks: { fontColor: "white" } }],
          yAxes: [{ ticks: { fontColor: "white", beginAtZero: true } }],
        },
      },
    });

    return () => window.myLine && window.myLine.destroy();
  }, [chartData]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t px-4 py-3 bg-transparent">
        <h2 className="text-white text-xl font-semibold">Revenue Overview</h2>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas id="line-chart"></canvas>
        </div>
      </div>
    </div>
  );
}