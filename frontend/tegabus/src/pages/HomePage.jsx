import React from "react";

const HomePage = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light" id="ftco-navbar">
        <div className="container">
          <a className="navbar-brand" href="/">Tega<span>Bus</span></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="oi oi-menu"></span> Menu
          </button>
          <div className="collapse navbar-collapse" id="ftco-nav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item"><a href="#about" className="nav-link">About</a></li>
              <li className="nav-item"><a href="/pricing" className="nav-link">Price</a></li>
              <li className="nav-item"><a href="/express" className="nav-link">Express</a></li>
              <li className="nav-item active"><a href="/booking" className="nav-link">Buy Ticket</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-wrap ftco-degree-bg" style={{ backgroundImage: "url('/images/test8.jpeg')" }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text justify-content-start align-items-center justify-content-center">
            <div className="col-lg-8 ftco-animate">
              <div className="text w-100 text-center mb-md-5 pb-md-5">
                <h1 className="mb-4">Fast &amp; Easy Way To Book Ticket</h1>
                <p style={{ fontSize: 18 }}><b>Welcome to TegaBus</b> – the easy way to book your bus tickets! Find, choose, and travel with speed, reliability, and convenience.</p>
                <a href="/images/booking.mp4" className="icon-wrap popup-vimeo d-flex align-items-center mt-4 justify-content-center">
                  <div className="icon d-flex align-items-center justify-content-center">
                    <span className="ion-ios-play"></span>
                  </div>
                  <div className="heading-title ml-5">
                    <span>Easy steps for Booking Ticket</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section (reused from BookingPage) */}
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
                    <p><a href="/express" className="btn btn-primary py-3 px-4">Reserve Your Perfect Express</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Express Carousel */}
      <section className="ftco-section ftco-no-pt bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12 heading-section text-center ftco-animate mb-5">
              <span className="subheading">TegaBus</span>
              <h2 className="mb-2">Express</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="carousel-car owl-carousel">
                <div className="item">
                  <div className="car-wrap rounded ftco-animate">
                    <div className="img rounded d-flex align-items-end" style={{ backgroundImage: "url('/images/ritcobus.jpg')" }} />
                    <div className="text">
                      <h2 className="mb-0"><a href="#">Ritco</a></h2>
                      <div className="d-flex mb-3">
                        <span className="cat">Saa 12:30</span>
                        <p className="price ml-auto">1890 RWF </p>
                      </div>
                      <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="#" className="btn btn-secondary py-2 ml-1">Details</a></p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="car-wrap rounded ftco-animate">
                    <div className="img rounded d-flex align-items-end" style={{ backgroundImage: "url('/images/royalbus.avif')" }} />
                    <div className="text">
                      <h2 className="mb-0"><a href="#">Royal Express</a></h2>
                      <div className="d-flex mb-3">
                        <span className="cat">Saa 12:30</span>
                        <p className="price ml-auto">1890 RWF </p>
                      </div>
                      <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="#" className="btn btn-secondary py-2 ml-1">Details</a></p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="car-wrap rounded ftco-animate">
                    <div className="img rounded d-flex align-items-end" style={{ backgroundImage: "url('/images/vilcono bus.jpg')" }} />
                    <div className="text">
                      <h2 className="mb-0"><a href="#">Virunga Express</a></h2>
                      <div className="d-flex mb-3">
                        <span className="cat">Saa 12:30</span>
                        <p className="price ml-auto">1890 RWF </p>
                      </div>
                      <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="#" className="btn btn-secondary py-2 ml-1">Details</a></p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="car-wrap rounded ftco-animate">
                    <div className="img rounded d-flex align-items-end" style={{ backgroundImage: "url('/images/horizonBus.jpg')" }} />
                    <div className="text">
                      <h2 className="mb-0"><a href="#">Horizon Express</a></h2>
                      <div className="d-flex mb-3">
                        <span className="cat">Saa 12:30</span>
                        <p className="price ml-auto">1890 RWF </p>
                      </div>
                      <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="#" className="btn btn-secondary py-2 ml-1">Details</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="ftco-section ftco-about" id="about">
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-6 p-md-5 img img-2 d-flex justify-content-center align-items-center" style={{ backgroundImage: "url('/images/test6.jpg')" }} />
            <div className="col-md-6 wrap-about ftco-animate">
              <div className="heading-section heading-section-white pl-md-5">
                <span className="subheading">About us</span>
                <h2 className="mb-4">Welcome to TEGABUS</h2>
                <p>Welcome to Tega Bus — your reliable platform for booking express bus tickets with ease and convenience. Here, you can quickly search, compare, and reserve seats according to your preferred bus company and travel schedule.</p>
                <p>Our system is designed to make your journey smoother. With just a few clicks, passengers can choose their express bus, secure their seats, and travel across cities and provinces comfortably. Book anytime, anywhere — and enjoy a fast, safe, and affordable travel experience.</p>
                <p><a href="/booking" className="btn btn-primary py-3 px-4">Book Ticket Now</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="ftco-section testimony-section bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-7 text-center heading-section ftco-animate">
              <span className="subheading">Express</span>
              <h2 className="mb-3">Our Express</h2>
            </div>
          </div>
          <div className="row ftco-animate">
            <div className="col-md-12">
              <div className="carousel-testimony owl-carousel ftco-owl">
                <div className="item">
                  <div className="testimony-wrap rounded text-center py-4 pb-5">
                    <div className="user-img mb-2" style={{ backgroundImage: "url('/images/ritcologo2.jpeg')" }} />
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap rounded text-center py-4 pb-5">
                    <div className="user-img mb-2" style={{ backgroundImage: "url('/images/royalexpress.jpg')" }} />
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap rounded text-center py-4 pb-5">
                    <div className="user-img mb-2" style={{ backgroundImage: "url('/images/virungal.jpg')" }} />
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap rounded text-center py-4 pb-5">
                    <div className="user-img mb-2" style={{ backgroundImage: "url('/images/horizon.png')" }} />
                  </div>
                </div>
                <div className="item">
                  <div className="testimony-wrap rounded text-center py-4 pb-5">
                    <div className="user-img mb-2" style={{ backgroundImage: "url('/images/volcano.png')" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
      <section className="ftco-counter ftco-section img bg-light" id="section-counter">
        <div className="overlay" />
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-4 justify-content-center counter-wrap ftco-animate">
              <div className="block-18">
                <div className="text text-border d-flex align-items-center">
                  <strong className="number" data-number="10">0</strong>
                  <span>Express</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 justify-content-center counter-wrap ftco-animate">
              <div className="block-18">
                <div className="text text-border d-flex align-items-center">
                  <strong className="number" data-number="30">0</strong>
                  <span>Total <br />Route</span>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4 justify-content-center counter-wrap ftco-animate">
              <div className="block-18">
                <div className="text text-border d-flex align-items-center">
                  <strong className="number" data-number="1000">0</strong>
                  <span>Booking <br />Times</span>
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

export default HomePage;
