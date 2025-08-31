import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExpressPage = () => {
  const [expresses, setExpresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tegaTicket/express")
      .then((response) => {
        if (!Array.isArray(response.data)) {
          console.error("Invalid API response: Expected an array");
          setError("Invalid express data received from server");
          setLoading(false);
          return;
        }
        setExpresses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expresses:", error);
        setError("Failed to fetch expresses. Please try again later.");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(expresses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentExpresses = expresses.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

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
                <span>Express <i className="ion-ios-arrow-forward"></i></span>
              </p>
              <h1 className="mb-3 bread">Choose Your Express</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 heading-section text-center ftco-animate mb-5">
              <span className="subheading">TegaBus</span>
              <h2 className="mb-2">Available Expresses</h2>
            </div>
          </div>
          {loading ? (
            <div className="text-center">
              <p>Loading available expresses...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p>{error}</p>
            </div>
          ) : expresses.length === 0 ? (
            <div className="text-center">
              <p>No available expresses found.</p>
            </div>
          ) : (
            <div className="row">
              {currentExpresses.map((express) => (
                <div className="col-md-4" key={express.id}>
                  <div className="car-wrap rounded ftco-animate">
                    <div
                      className="img rounded d-flex align-items-end"
                      style={{
                        backgroundImage: `url(http://localhost:5000/uploads/${express.expressProfile || 'default.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '200px'
                      }}
                    ></div>
                    <div className="text">
                      <h2 className="mb-0"><Link to={`/express/${express.id}`}>{express.expressName || 'Unknown Express'}</Link></h2>
                      <div className="d-flex mb-3"></div>
                      <p className="d-flex mb-0 d-block">
                        <a href={`/booking?expressId=${express.id}`} className="btn btn-primary py-2 mr-1">Book now</a>
                        <Link to={`/express/${express.id}`} className="btn btn-secondary py-2 ml-1">Details</Link>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {expresses.length > 0 && (
            <div className="row mt-5">
              <div className="col text-center">
                <div className="block-27">
                  <ul>
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'disabled' : ''}
                      >
                        &lt;
                      </a>
                    </li>
                    {pageNumbers.map((number) => (
                      <li key={number} className={currentPage === number ? 'active' : ''}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(number);
                          }}
                        >
                          {number}
                        </a>
                      </li>
                    ))}
                    <li>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'disabled' : ''}
                      >
                        &gt;
                      </a>
                    </li>
                  </ul>
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

export default ExpressPage;