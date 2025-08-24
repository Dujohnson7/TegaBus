import React from "react";


const ExpressPage = () => {
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
              <li className="nav-item active"><a href="/express" className="nav-link">Express</a></li>
              <li className="nav-item active"><a href="/booking" className="nav-link">Buy Ticket</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2 js-fullheight" style={{backgroundImage: "url('/images/test7.jpeg')"}} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Express <i className="ion-ios-arrow-forward"></i></span></p>
              <h1 className="mb-3 bread">Choose Your Express</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Express List Section */}
      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="car-wrap rounded ftco-animate">
                <div className="img rounded d-flex align-items-end" style={{backgroundImage: "url('/images/ritcoLogo.png')"}}></div>
                <div className="text">
                  <h2 className="mb-0"><a href="/express-single">RITCO LTD</a></h2>
                  <div className="d-flex mb-3"></div>
                  <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="/express-single" className="btn btn-secondary py-2 ml-1">Details</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="car-wrap rounded ftco-animate">
                <div className="img rounded d-flex align-items-end" style={{backgroundImage: "url('/images/royalexpress.jpg')"}}></div>
                <div className="text">
                  <h2 className="mb-0"><a href="/express-single">Royality Express</a></h2>
                  <div className="d-flex mb-3"></div>
                  <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="/express-single" className="btn btn-secondary py-2 ml-1">Details</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="car-wrap rounded ftco-animate">
                <div className="img rounded d-flex align-items-end" style={{backgroundImage: "url('/images/virungal.jpg')"}}></div>
                <div className="text">
                  <h2 className="mb-0"><a href="/express-single">Virunga Express</a></h2>
                  <div className="d-flex mb-3"></div>
                  <p className="d-flex mb-0 d-block"><a href="#" className="btn btn-primary py-2 mr-1">Book now</a> <a href="/express-single" className="btn btn-secondary py-2 ml-1">Details</a></p>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col text-center">
              <div className="block-27">
                <ul>
                  <li><a href="#">&lt;</a></li>
                  <li className="active"><span>1</span></li>
                  <li><a href="#">2</a></li>
                  <li><a href="#">3</a></li>
                  <li><a href="#">4</a></li>
                  <li><a href="#">5</a></li>
                  <li><a href="#">&gt;</a></li>
                </ul>
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

export default ExpressPage;
