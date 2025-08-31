import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";  
import Chart from "chart.js";

export default function Reports({ showHeaderStats = true, showDateFilter = true, showCharts = true, showTable = true }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expressName, setExpressName] = useState("");
  const [expressLogo, setExpressLogo] = useState("");
  const [expressId, setExpressId] = useState("");

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalPaidTickets, setTotalPaidTickets] = useState(0);
  const [totalUnpaidTickets, setTotalUnpaidTickets] = useState(0);
  const [revenueData, setRevenueData] = useState({ labels: [], datasets: [] });
  const [ticketSalesData, setTicketSalesData] = useState({ labels: [], datasets: [] });
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lineChart, setLineChart] = useState(null);
  const [barChart, setBarChart] = useState(null);

  useEffect(() => { 
    const expressData = JSON.parse(localStorage.getItem("expressData") || "{}");
    const expressId = expressData.expressId || localStorage.getItem("expressId") || "";
    setExpressId(expressId);

    if (expressId) {
      fetchExpressDetails(expressId);
    }

    loadDefaultWeeklyData();

    return () => { 
      if (lineChart) lineChart.destroy();
      if (barChart) barChart.destroy();
    };
  }, []);

  useEffect(() => {
    renderCharts();
  }, [revenueData, ticketSalesData]);

  const fetchExpressDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/express/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const expressData = await response.json();
        setExpressName(expressData.expressName || "");
        setExpressLogo(expressData.expressLogo || "");
 
        localStorage.setItem("expressData", JSON.stringify({
          expressId: id,
          expressName: expressData.expressName,
          expressLogo: expressData.expressLogo
        }));
      }
    } catch (error) {
      console.error("Error fetching express details:", error);
    }
  };

  const renderCharts = () => { 
    if (revenueData.labels.length > 0) {
      const lineCtx = document.getElementById("line-chart");
      if (lineCtx) {
        if (lineChart) lineChart.destroy();
        const newLineChart = new Chart(lineCtx.getContext("2d"), {
          type: "line",
          data: revenueData,
          options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              labels: { fontColor: "white" },
              align: "end",
              position: "bottom"
            },
            scales: {
              xAxes: [{ ticks: { fontColor: "white" } }],
              yAxes: [{ ticks: { fontColor: "white", beginAtZero: true } }],
            },
          },
        });
        setLineChart(newLineChart);
      }
    }
 
    if (ticketSalesData.labels.length > 0) {
      const barCtx = document.getElementById("bar-chart");
      if (barCtx) {
        if (barChart) barChart.destroy();
        const newBarChart = new Chart(barCtx.getContext("2d"), {
          type: "bar",
          data: ticketSalesData,
          options: {
            maintainAspectRatio: false,
            responsive: true,
            legend: {
              position: "bottom",
              labels: { fontColor: "#4B5563" }
            },
            scales: {
              xAxes: [{
                ticks: {
                  autoSkip: false,
                  fontColor: "#4B5563"
                },
                gridLines: { display: false }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  precision: 0,
                  fontColor: "#4B5563"
                },
                gridLines: { color: "rgba(0,0,0,0.1)" }
              }],
            },
          },
        });
        setBarChart(newBarChart);
      }
    }
  };

  const loadDefaultWeeklyData = async () => {
    try {
      setIsLoading(true);
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);

      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];

      setStartDate(startStr);
      setEndDate(endStr);

      await fetchReportData(start.getTime(), end.getTime());
    } catch (error) {
      console.error("Error loading default weekly data:", error);
      alert("Error loading default weekly data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReportData = async (startMillis, endMillis) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/reports/date-range?start=${startMillis}&end=${endMillis}&expressId=${expressId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report data");
      }

      const data = await response.json();
      processReportData(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching report data: " + error.message);
    }
  };

  const processReportData = (data) => { 
    const groupedByDateAndDestination = {};
    data.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString();
      const destination = t.schedule?.destination || { fromLocation: 'Unknown', toLocation: 'Unknown' };
      const key = `${date}-${destination.fromLocation}-${destination.toLocation}`;

      if (!groupedByDateAndDestination[key]) {
        groupedByDateAndDestination[key] = {
          date,
          destination,
          tickets: 0,
          revenue: 0,
          paidTickets: 0,
          unpaidTickets: 0,
        };
      }

      groupedByDateAndDestination[key].tickets += 1;
      groupedByDateAndDestination[key].revenue += t.totalAmount || 0;

      if (t.payState === "PAID") {
        groupedByDateAndDestination[key].paidTickets += 1;
      } else {
        groupedByDateAndDestination[key].unpaidTickets += 1;
      }
    });

    const tableGroupedData = Object.values(groupedByDateAndDestination);
    setTableData(tableGroupedData);
 
    const groupedByDateOnly = {};
    data.forEach((t) => {
      const date = new Date(t.date).toLocaleDateString();

      if (!groupedByDateOnly[date]) {
        groupedByDateOnly[date] = {
          date,
          tickets: 0,
          revenue: 0,
          paidTickets: 0,
          unpaidTickets: 0,
        };
      }

      groupedByDateOnly[date].tickets += 1;
      groupedByDateOnly[date].revenue += t.totalAmount || 0;

      if (t.payState === "PAID") {
        groupedByDateOnly[date].paidTickets += 1;
      } else {
        groupedByDateOnly[date].unpaidTickets += 1;
      }
    });

    const chartGroupedData = Object.values(groupedByDateOnly);

    const totalRev = chartGroupedData.reduce((sum, r) => sum + r.revenue, 0);
    const totalTix = chartGroupedData.reduce((sum, r) => sum + r.tickets, 0);
    const totalPaid = chartGroupedData.reduce((sum, r) => sum + r.paidTickets, 0);
    const totalUnpaid = chartGroupedData.reduce((sum, r) => sum + r.unpaidTickets, 0);

    setTotalRevenue(totalRev);
    setTotalTickets(totalTix);
    setTotalPaidTickets(totalPaid);
    setTotalUnpaidTickets(totalUnpaid);

    const sortedChartData = chartGroupedData.sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const labels = sortedChartData.map((r) => r.date);
 
    const revenueChart = {
      labels,
      datasets: [
        {
          label: "Revenue (RWF)",
          data: sortedChartData.map((r) => r.revenue),
          borderColor: "rgb(59,130,246)",
          backgroundColor: "rgba(59,130,246,0.1)",
          tension: 0.4,
        },
      ],
    };
    setRevenueData(revenueChart);

    const ticketChart = {
      labels,
      datasets: [
        {
          label: "Paid Tickets",
          data: sortedChartData.map((r) => r.paidTickets),
          backgroundColor: "rgba(34,197,94,0.8)",
        },
        {
          label: "Unpaid Tickets",
          data: sortedChartData.map((r) => r.unpaidTickets),
          backgroundColor: "rgba(239,68,68,0.8)",
        },
      ],
    };
    setTicketSalesData(ticketChart);
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    try {
      setIsLoading(true);
      const startMillis = new Date(startDate).getTime();
      const endMillis = new Date(endDate).getTime();
      await fetchReportData(startMillis, endMillis);
      alert("Report generated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error generating report: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
  if (tableData.length === 0) {
    alert("No data to export. Please generate a report first.");
    return;
  }

  try {
    setIsLoading(true);
    
    const doc = new jsPDF();
     
    if (expressLogo) {
      try { 
        const logoResponse = await fetch(`http://localhost:5000/uploads/${expressLogo}`);
        const logoBlob = await logoResponse.blob();
        const logoBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(logoBlob);
        });
         
        doc.addImage(logoBase64, 'PNG', 14, 10, 30, 15);
      } catch (error) {
        console.error("Error loading logo:", error); 
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text(expressName, 14, 20);
      }
    } else if (expressName) { 
      doc.setFontSize(16);
      doc.setTextColor(59, 130, 246);
      doc.text(expressName, 14, 20);
    }
     
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("Travel Report", 105, 20, { align: "center" });
     
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Date Range: ${startDate} to ${endDate}`, 105, 28, { align: "center" });
     
    doc.setFillColor(245, 247, 250);
    doc.rect(10, 35, 190, 45, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text("SUMMARY", 14, 45);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
     
    doc.text(`Total Revenue: RWF ${totalRevenue.toLocaleString()}`, 14, 55);
    doc.text(`Total Tickets: ${totalTickets}`, 14, 65);
    
    doc.text(`Paid Tickets: ${totalPaidTickets}`, 100, 55);
    doc.text(`Unpaid Tickets: ${totalUnpaidTickets}`, 100, 65);
     
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(14, 70, 196, 70);
     
    autoTable(doc, {
      startY: 85,
      head: [
        [
          {content: 'Date', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}},
          {content: 'Destination', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}},
          {content: 'Tickets', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}},
          {content: 'Revenue', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}},
          {content: 'Paid', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}},
          {content: 'Unpaid', styles: {fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold'}}
        ]
      ],
      body: tableData.map(row => [
        row.date,
        `${row.destination.fromLocation} - ${row.destination.toLocation}`,
        row.tickets,
        `RWF ${row.revenue.toLocaleString()}`,
        {content: row.paidTickets, styles: {textColor: [34, 197, 94]}},
        {content: row.unpaidTickets, styles: {textColor: [239, 68, 68]}}
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak'
      },
      margin: { top: 10 }
    });
     
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount} • Generated on ${new Date().toLocaleDateString()}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
    
    const fileName = expressName 
      ? `${expressName.toLowerCase().replace(/\s+/g, '-')}-report-${startDate}-to-${endDate}.pdf`
      : `travel-report-${startDate}-to-${endDate}.pdf`;
    
    doc.save(fileName);
    setIsLoading(false);
    alert("PDF exported successfully!");
  } catch (error) {
    console.error("Error exporting PDF:", error);
    setIsLoading(false);
    alert("Error exporting PDF: " + error.message);
  }
};
 
  const StatCard = ({ title, value, icon, color, percent, percentColor, description }) => (
    <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-xs">
              {title}
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              {value}
            </span>
          </div>
          <div className="relative w-auto pl-4 flex-initial">
            <div className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${color}`}>
              <i className={icon}></i>
            </div>
          </div>
        </div>
        <p className="text-sm text-blueGray-400 mt-4"> 
          <span className="whitespace-nowrap">{description}</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Header Stats - Optional */}
      {showHeaderStats && (
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-3/12 mb-12 xl:mb-0 px-4">
            <StatCard
              title="Total Revenue"
              value={`RWF ${totalRevenue.toLocaleString()}`}
              icon="fas fa-dollar-sign"
              color="bg-emerald-500"  
            />
          </div>
          <div className="w-full xl:w-3/12 px-4">
            <StatCard
              title="Total Tickets"
              value={totalTickets}
              icon="fas fa-ticket-alt"
              color="bg-red-500"  
              description=" "
            />
          </div>
          <div className="w-full xl:w-3/12 px-4">
            <StatCard
              title="Paid Tickets"
              value={totalPaidTickets}
              icon="fas fa-check-circle"
              color="bg-black"  
              description=" "
            />
          </div>
          <div className="w-full xl:w-3/12 px-4">
            <StatCard
              title="Unpaid Tickets"
              value={totalUnpaidTickets}
              icon="fas fa-exclamation-circle"
              color="bg-orange-500"  
              description=""
            />
          </div>
        </div>
      )}

      {/* Date Range Selection - Optional */}
      {showDateFilter && (
        <div className="flex flex-wrap mt-4">
          <div className="w-full px-4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                {expressName || "Express"} Report Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={loadDefaultWeeklyData}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-black transition-colors font-medium"
                  >
                    <i className="fas fa-calendar-week mr-2"></i>
                    This Week
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                  className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-chart-line mr-2"></i>
                      Generate Report
                    </>
                  )}
                </button> &nbsp;&nbsp;
                <button
                  onClick={handleExportReport}
                  disabled={tableData.length === 0}
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors font-medium disabled:opacity-50"
                >
                  <i className="fas fa-download mr-2"></i>
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts - Optional */}
      {showCharts && (
        <div className="flex flex-wrap mt-4">
          <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
            {revenueData.labels.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Generate a report to view revenue chart</p>
              </div>
            )}
          </div>
          <div className="w-full xl:w-4/12 px-4">
            {ticketSalesData.labels.length > 0 ? (
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
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Generate a report to view ticket sales chart</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table - Optional */}
      {showTable && (
        <div className="flex flex-wrap mt-4">
          <div className="w-full px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
              <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                      Daily Summary by Destination
                    </h3>
                  </div>
                </div>
              </div>
              <div className="block w-full overflow-x-auto">
                {tableData.length > 0 ? (
                  <table className="items-center w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50">
                          Destination
                        </th>
                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50">
                          Tickets Sold
                        </th>
                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4">{row.date}</td>
                          <td className="px-6 py-4">{row.destination.fromLocation + " - " + row.destination.toLocation}</td>
                          <td className="px-6 py-4">{row.tickets}</td>
                          <td className="px-6 py-4">{`RWF ${row.revenue.toLocaleString()}`}</td>
                          <td className="px-6 py-4">
                            <span className="mr-4">
                              <i className="fas fa-circle text-emerald-500 mr-1"></i>
                              Paid: {row.paidTickets}
                            </span>
                            <span>
                              <i className="fas fa-circle text-orange-500 mr-1"></i>
                              Unpaid: {row.unpaidTickets}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No data available. Generate a report to view details.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}