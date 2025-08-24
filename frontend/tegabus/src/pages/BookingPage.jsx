import React from "react";


const BookingPage = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">TEGA<span>BUS</span></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="/#about" className="nav-link">About</a></li>
              <li className="nav-item"><a href="/pricing" className="nav-link">Price</a></li>
              <li className="nav-item"><a href="/express" className="nav-link">Express</a></li>
              <li className="nav-item active"><a href="/booking" className="nav-link">Buy Ticket</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2 js-fullheight" style={{backgroundImage: "url('/images/test6.jpg')"}} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Booking <i className="ion-ios-arrow-forward"></i></span></p>
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
                  <form action="#" className="request-form ftco-animate bg-primary">
                    <h2>Make your trip</h2>
                    <div className="form-group">
                      <label className="label">Name</label>
                      <input type="text" className="form-control" placeholder="Name" />
                    </div>
                    <div className="form-group">
                      <label className="label">Phone</label>
                      <input type="text" className="form-control" placeholder="Phone" />
                    </div>
                    <div className="form-group">
                      <label className="label">Express</label>
                      <select className="form-control">
                        <option value="">Select Express</option>
                        <option value="">Ritco</option>
                        <option value="">Virunga</option>
                        <option value="">Simba</option>
                      </select>
                    </div>
                    <div className="d-flex">
                      <div className="form-group mr-2">
                        <label className="label">From</label>
                        <select className="form-control">
                          <option value="">Select Location</option>
                          <option value="">Kigali</option>
                          <option value="">Musanze</option>
                          <option value="">Huye</option>
                        </select>
                      </div>
                      <div className="form-group ml-2">
                        <label className="label">To</label>
                        <select className="form-control">
                          <option value="">Select Location</option>
                          <option value="">Kigali</option>
                          <option value="">Musanze</option>
                          <option value="">Huye</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="label">Number of Seat</label>
                      <input type="number" className="form-control" defaultValue={1} />
                    </div>
                    <div className="form-group">
                      <label className="label">Cost</label>
                      <input type="number" className="form-control" defaultValue={10000} readOnly />
                    </div>
                    <div className="form-group">
                      <label className="label">Time</label>
                      <input type="text" className="form-control" placeholder="Time" />
                    </div>
                    <div className="form-group">
                      <label className="label">Date</label>
                      <input type="text" className="form-control" placeholder="Date" />
                    </div>
                    <div className="form-group">
                      <input type="submit" value="Book Now" className="btn btn-secondary py-3 px-4" />
                    </div>
                  </form>
                </div>
                <div className="col-md-8 d-flex align-items-center">
                  <div className="services-wrap rounded-right w-100">
                    <h3 className="heading-section mb-4">Better Way to Booking Ticket On TegaBus</h3>
                    <div className="row d-flex mb-4">
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center"><span className="ion-ios-bus"></span></div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Select Express</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center"><span className="flaticon-route"></span></div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Choose Destination</h3>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 d-flex align-self-stretch ftco-animate">
                        <div className="services w-100 text-center">
                          <div className="icon d-flex align-items-center justify-content-center"><span className="flaticon-handshake"></span></div>
                          <div className="text w-100">
                            <h3 className="heading mb-2">Select the Best</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p><a href="#" className="btn btn-primary py-3 px-4">Reserve Your Perfect Express</a></p>
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
              <p>Copyright &copy; 2025 <a href="#" className="logo">TEGA<span>BUS</span></a>. All rights reserved || Developed by Dujohnson</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default BookingPage;
