import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

const BookingPage = () => {
  const [formData, setFormData] = useState({
    names: "",
    phone: "",
    express: "",
    fromLocation: "",
    toLocation: "",
    date: null,
    time: "",
    seatNo: "",
    totalAmount: "",
  });

  const [expressList, setExpressList] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [ticketList, setTicketList] = useState([]);
  const [availableSeats, setAvailableSeats] = useState(0);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expressResponse = await fetch("http://localhost:5000/api/tegaTicket/express", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!expressResponse.ok) throw new Error("Failed to fetch expresses");
        const expresses = await expressResponse.json();
        setExpressList(expresses);

        const destinationResponse = await fetch("http://localhost:5000/api/tegaTicket/destination", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!destinationResponse.ok) throw new Error("Failed to fetch destinations");
        const destinations = await destinationResponse.json();
        setDestinationList(destinations);

        const scheduleResponse = await fetch("http://localhost:5000/api/tegaTicket/scheduleAll", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!scheduleResponse.ok) throw new Error("Failed to fetch schedules");
        const schedules = await scheduleResponse.json();
        setScheduleList(schedules);

        const ticketResponse = await fetch("http://localhost:5000/api/tegaTicket/ticket", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!ticketResponse.ok) throw new Error("Failed to fetch tickets");
        const tickets = await ticketResponse.json();
        setTicketList(tickets);
 
        const now = new Date(); 
        now.setHours(0, 0, 0, 0);
        
        const validDates = schedules
          .filter(sch => {
            if (!sch.date) return false;
             
            const scheduleDate = new Date(sch.date);
            scheduleDate.setHours(0, 0, 0, 0);
            
            return scheduleDate >= now;
          })
          .map(sch => {
            const date = new Date(sch.date);
            date.setHours(0, 0, 0, 0);
            return date.getTime();  
          });
         
        const uniqueDates = [...new Set(validDates)]
          .map(timestamp => new Date(timestamp))
          .sort((a, b) => a - b); 
          
        setAvailableDates(uniqueDates);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);
 
  const getAvailableDestinations = () => { 
    const destinationsWithSchedules = destinationList.filter((dest) =>
      scheduleList.some(
        (sch) =>
          sch.destination?.id === dest.id &&
          (!formData.express || sch.express?.id === formData.express) 
      )
    );
 
    const fromLocations = [...new Set(destinationsWithSchedules.map((d) => d.fromLocation))];
    const toLocations = [...new Set(destinationsWithSchedules.map((d) => d.toLocation))];

    return { fromLocations, toLocations };
  };

  useEffect(() => {
    if (formData.express && formData.fromLocation && formData.toLocation && formData.date) {
      const filteredSchedules = scheduleList.filter(
        (sch) =>
          sch.express?.id === formData.express &&
          sch.destination?.fromLocation === formData.fromLocation &&
          sch.destination?.toLocation === formData.toLocation && 
          new Date(sch.date).toDateString() === formData.date.toDateString()
      );

      const times = filteredSchedules.map((sch) => sch.time).filter((time) => time);
      setAvailableTimes([...new Set(times)]);

      if (filteredSchedules.length > 0) {
        const selectedSchedule = filteredSchedules[0];
        const bookedSeats = ticketList
          .filter((t) => t.schedule && t.schedule.id === selectedSchedule.id)
          .map((t) => t.seatNo);
        const remainingSeats = selectedSchedule.bus?.busSize
          ? selectedSchedule.bus.busSize - bookedSeats.length
          : 0;
        setAvailableSeats(remainingSeats);

        const nextSeat = [];
        if (selectedSchedule.bus?.busSize) {
          for (let i = 1; i <= selectedSchedule.bus.busSize; i++) {
            if (!bookedSeats.includes(i)) nextSeat.push(i);
          }
        }

        setFormData((prev) => ({
          ...prev,
          seatNo: nextSeat.length > 0 ? nextSeat[0] : "",
          totalAmount: selectedSchedule.destination?.cost || 0,
          time: times[0] || "",
        }));
      } else {
        setAvailableSeats(0);
        setFormData((prev) => ({ ...prev, seatNo: "", totalAmount: "", time: "" }));
      }
    } else {
      setAvailableSeats(0);
      setFormData((prev) => ({ ...prev, seatNo: "", totalAmount: "", time: "" }));
    }
  }, [formData.express, formData.fromLocation, formData.toLocation, formData.date, scheduleList, ticketList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, 
      ...(name === "express" ? { fromLocation: "", toLocation: "", date: null, time: "" } : {}),
      ...(name === "fromLocation" ? { toLocation: "", date: null, time: "" } : {}),
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date, time: "" }));
  };

  const generateQRCodeData = (ticket, selectedSchedule, selectedExpress) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "N/A" : `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return `
      Ticket: ${ticket.ticketNumber || "N/A"}
      Express: ${selectedExpress?.expressName || "N/A"}
      Route: ${selectedSchedule?.destination?.fromLocation || "N/A"} - ${selectedSchedule?.destination?.toLocation || "N/A"}
      Time: ${selectedSchedule?.time || "N/A"}
      Date: ${formatDate(ticket.date)}
      Bus: ${ticket.busPlateNo || "N/A"}
      Seat: ${ticket.seatNo || "N/A"}
      Passenger: ${ticket.names || "N/A"}
      Amount: ${ticket.totalAmount || 0} Rwf
      Status: ${ticket.payState || "PENDING"}
      Powered By TEGABUS
    `.trim();
  };

  const generatePDF = async (ticket) => {
    try {
      const selectedSchedule = scheduleList.find((s) => s.id === ticket.schedule?.id);
      const selectedExpress = expressList.find((e) => e.id === ticket.express?.id);

      if (!selectedSchedule || !selectedExpress) {
        setError("Missing schedule or express data for PDF generation.");
        return;
      }

      const logoUrl = `http://localhost:5000/uploads/${selectedExpress.expressLogo}`;
      const doc = new jsPDF();

      doc.setFillColor(74, 107, 136);
      doc.rect(0, 0, 210, 25, "F");
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.text(selectedExpress.expressName || "N/A", 105, 12, { align: "center" });
      doc.setFontSize(10);
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
      doc.text("ELECTRONIC TICKET", 105, 45, { align: "center" });

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(70, 55, 70, 8, 4, 4, "F");
      doc.setFontSize(10);
      doc.setTextColor(74, 107, 136);
      doc.setFont(undefined, "bold");
      doc.text(`Ticket #: ${ticket.ticketNumber || "N/A"}`, 105, 60, { align: "center" });

      try {
        const qrCodeData = generateQRCodeData(ticket, selectedSchedule, selectedExpress);
        const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
          width: 120,
          margin: 1,
          color: { dark: "#2c3e50", light: "#ffffff" },
        });
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
        `Route: ${selectedSchedule.destination?.fromLocation || "N/A"} - ${
          selectedSchedule.destination?.toLocation || "N/A"
        }`,
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

      const statusColor = ticket.payState === "PAID" ? [76, 175, 80] : [244, 67, 54];
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
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
        { align: "center", maxWidth: 200 }
      );
      doc.text("Generated on " + new Date().toLocaleString(), 105, 190, { align: "center" });

      try {
        doc.addImage(logoUrl, "PNG", 175, 3, 25, 20, undefined, "FAST");
      } catch (error) {
        console.error("Error adding logo to PDF:", error);
      }

      doc.save(`ticket_${ticket.ticketNumber || "unknown"}.pdf`);

      try {
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const printWindow = window.open(pdfUrl);

        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            setTimeout(() => {
              URL.revokeObjectURL(pdfUrl);
              printWindow.close();
            }, 500);
          };
        } else {
          console.warn("Popup blocked. Opening PDF in new tab instead.");
          window.open(pdfUrl, "_blank");
        }
      } catch (printError) {
        console.error("Print error:", printError);
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.seatNo) {
      setError("No seats available for the selected schedule.");
      return;
    }

    try {
      const selectedSchedule = scheduleList.find(
        (sch) =>
          sch.express?.id === formData.express &&
          sch.destination?.fromLocation === formData.fromLocation &&
          sch.destination?.toLocation === formData.toLocation &&
          new Date(sch.date).toDateString() === formData.date.toDateString() &&
          sch.time === formData.time
      );

      if (!selectedSchedule) {
        setError("No valid schedule found for the selected options.");
        return;
      }

      const payload = {
        ticketNumber: `TKT-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase(),
        names: formData.names,
        phone: formData.phone,
        express: { id: formData.express },
        schedule: { id: selectedSchedule.id },
        busPlateNo: selectedSchedule.bus?.plateNo || "N/A",
        seatNo: parseInt(formData.seatNo) || 0,
        totalAmount: parseFloat(formData.totalAmount) || 0,
        payState: "PAID",
        date: formData.date || new Date(),
      };

      const response = await fetch("http://localhost:5000/api/tegaTicket/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to book ticket");
      }
      const savedTicket = await response.json();
      alert("Ticket booked successfully!");
      setTicketList([...ticketList, savedTicket]);
      await generatePDF(savedTicket);
      setFormData({
        names: "",
        phone: "",
        express: "",
        fromLocation: "",
        toLocation: "",
        date: null,
        time: "",
        seatNo: "",
        totalAmount: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // Get available destinations
  const { fromLocations, toLocations } = getAvailableDestinations();

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">
            TEGA<span>BUS</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#ftco-nav"
            aria-controls="ftco-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="oi oi-menu"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="/" className="nav-link">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a href="/#about" className="nav-link">
                  About
                </a>
              </li>
              <li className="nav-item">
                <a href="/pricing" className="nav-link">
                  Price
                </a>
              </li>
              <li className="nav-item">
                <a href="/express" className="nav-link">
                  Express
                </a>
              </li>
              <li className="nav-item active">
                <a href="/booking" className="nav-link">
                  Buy Ticket
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero-wrap hero-wrap-2 js-fullheight"
        style={{ backgroundImage: "url('/images/test6.jpg')" }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <a href="/">
                    Home <i className="ion-ios-arrow-forward"></i>
                  </a>
                </span>
                <span>
                  Booking <i className="ion-ios-arrow-forward"></i>
                </span>
              </p>
              <h1 className="mb-3 bread">Buy Ticket</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="ftco-section ftco-no-pt bg-light" id="booking">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-12 featured-top">
              <div className="row no-gutters">
                <div className="col-md-4 d-flex align-items-center">
                  <form onSubmit={handleSubmit} className="request-form ftco-animate bg-primary">
                    <h2>Make your trip</h2>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <div className="form-group">
                      <label className="label">Name</label>
                      <input
                        type="text"
                        name="names"
                        value={formData.names}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Phone</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Phone"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="label">Express</label>
                      <select
                        name="express"
                        value={formData.express}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="">Select Express</option>
                        {expressList.map((exp) => (
                          <option key={exp.id} value={exp.id}>
                            {exp.expressName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="d-flex">
                      <div className="form-group mr-2">
                        <label className="label">From</label>
                        <select
                          name="fromLocation"
                          value={formData.fromLocation}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Location</option>
                          {fromLocations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group ml-2">
                        <label className="label">To</label>
                        <select
                          name="toLocation"
                          value={formData.toLocation}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Location</option>
                          {toLocations
                            .filter((loc) => loc !== formData.fromLocation)
                            .map((loc) => (
                              <option key={loc} value={loc}>
                                {loc}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label">Date</label>
                      <br />
                      <DatePicker
                        selected={formData.date}
                        onChange={handleDateChange}
                        includeDates={availableDates}
                        className="form-control"
                        style={{ width: "100%" }}
                        placeholderText="Select Date"
                        dateFormat="MM/dd/yyyy"
                        required
                      />
                    </div> 
                    
                    <div className="form-group">
                      <label className="label">Time</label>
                      <select name="time" value={formData.time} onChange={handleInputChange} className="form-control" required>
                        <option value="">Select Time</option>
                        {availableTimes.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Number of Seat</label>
                      <input type="number" value={formData.seatNo} readOnly className="form-control" />
                    </div>
                    <div className="form-group">
                      <label className="label">Cost</label>
                      <input type="number" value={formData.totalAmount} readOnly className="form-control" />
                    </div>
                    <div className="form-group">
                      <input
                        type="submit"
                        value="Book Now"
                        className="btn btn-secondary py-3 px-4"
                        disabled={availableSeats === 0}
                      />
                    </div>
                  </form>
                </div>
                <div className="col-md-8 d-flex align-items-center">
                  <div className="services-wrap rounded-right w-100">
                    <h3 className="heading-section mb-4">Better Way to Booking Ticket On TegaBus</h3>
                    <div className="row d-flex mb-4">
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="ion-ios-bus"></span>
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Select Express</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="flaticon-route"></span>
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Choose Destination</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center">
                            <span className="flaticon-handshake"></span>
                          </div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Select the Best</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p>
                      <a href="#" className="btn btn-primary py-3 px-4">
                        Reserve Your Perfect Express
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ftco-footer ftco-bg-dark ftco-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <p>
                Copyright &copy; 2025 <a href="#" className="logo">TEGA<span>BUS</span></a>. All rights reserved || Developed
                by Dujohnson
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BookingPage;