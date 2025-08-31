import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ExpressSinglePage = () => {
  const { id } = useParams();
  const [express, setExpress] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch express details
    axios
      .get(`http://localhost:5000/api/tegaTicket/express/${id}`)
      .then((response) => {
        setExpress(response.data);
      })
      .catch((error) => {
        console.error("Error fetching express details:", error);
        setError(
          error.response?.data || "Failed to fetch express details. Please try again later."
        );
      });

    // Fetch routes for the express
    axios
      .get(`http://localhost:5000/api/tegaTicket/expressRoute/${id}`)
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("Invalid API response: Expected an array for routes");
          setError("Invalid route data received from server");
          setLoading(false);
          return;
        }
        setRoutes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching routes:", error);
        setError(
          error.response?.data || "Failed to fetch routes. Please try again later."
        );
        setLoading(false);
      });
  }, [id]);

  // Split routes into three columns for display
  const routesPerColumn = Math.ceil(routes.length / 3);
  const column1 = routes.slice(0, routesPerColumn);
  const column2 = routes.slice(routesPerColumn, routesPerColumn * 2);
  const column3 = routes.slice(routesPerColumn * 2);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">TEGA<span>BUS</span></a>
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
              <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="/#about" className="nav-link">About</a></li>
              <li className="nav-item"><a href="/pricing" className="nav-link">Price</a></li>
              <li className="nav-item active"><a href="/express" className="nav-link">Express</a></li>
              <li className="nav-item"><a href="/booking" className="nav-link">Buy Ticket</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <section
        className="hero-wrap hero-wrap-2 js-fullheight"
        style={{ backgroundImage: "url('/images/test7.jpeg')" }}
        data-stellar-background-ratio="0.5"
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs">
                <span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span>
                <span>Express details <i className="ion-ios-arrow-forward"></i></span>
              </p>
              <h1 className="mb-3 bread">Express Details</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-car-details">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              {loading ? (
                <div className="text-center">
                  <p>Loading express details...</p>
                </div>
              ) : error ? (
                <div className="text-center">
                  <p>{error}</p>
                </div>
              ) : !express ? (
                <div className="text-center">
                  <p>No express details found.</p>
                </div>
              ) : (
                <div className="car-details">
                  <div
                    className="img rounded"
                    style={{
                      backgroundImage: `url(http://localhost:5000/uploads/${express.expressProfile || 'default.jpg'})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '400px'
                    }}
                  ></div>
                  <div className="text text-center">
                    <span className="subheading">Express</span>
                    <h2>{express.expressName || 'Unknown Express'}</h2>
                  </div>
                </div>
              )}
            </div>
          </div>
          {!loading && !error && express && (
            <div className="row">
              <div className="col-md-12 pills">
                <div className="bd-example bd-example-tabs">
                  <div className="d-flex justify-content-center">
                    <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          id="pills-description-tab"
                          data-toggle="pill"
                          href="#pills-description"
                          role="tab"
                          aria-controls="pills-description"
                          aria-expanded="true"
                        >
                          Our Route
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="pills-manufacturer-tab"
                          data-toggle="pill"
                          href="#pills-manufacturer"
                          role="tab"
                          aria-controls="pills-manufacturer"
                          aria-expanded="true"
                        >
                          Description
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-description"
                      role="tabpanel"
                      aria-labelledby="pills-description-tab"
                    >
                      <div className="row">
                        <div className="col-md-4">
                          <ul className="features">
                            {column1.map((route, index) => (
                              <li className="check" key={index}>
                                <span className="ion-ios-checkmark"></span>
                                {route.fromLocation} - {route.toLocation}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <ul className="features">
                            {column2.map((route, index) => (
                              <li className="check" key={index}>
                                <span className="ion-ios-checkmark"></span>
                                {route.fromLocation} - {route.toLocation}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="col-md-4">
                          <ul className="features">
                            {column3.map((route, index) => (
                              <li className="check" key={index}>
                                <span className="ion-ios-checkmark"></span>
                                {route.fromLocation} - {route.toLocation}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-manufacturer"
                      role="tabpanel"
                      aria-labelledby="pills-manufacturer-tab"
                    >
                      <p>{express.expressDescription || 'No description available for this express.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="ftco-footer ftco-bg-dark ftco-section">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center">
              <p>
                Copyright &copy; 2025 <a href="#" className="logo">TEGA<span>BUS</span></a>. All rights reserved || Developed by Dujohnson
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ExpressSinglePage;