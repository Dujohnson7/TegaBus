import React from "react";


const ExpressSinglePage = () => {
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
              <p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Express details <i className="ion-ios-arrow-forward"></i></span></p>
              <h1 className="mb-3 bread">Express Details</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Express Details Section */}
      <section className="ftco-section ftco-car-details">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="car-details">
                <div className="img rounded" style={{backgroundImage: "url('/images/test8.jpeg')"}}></div>
                <div className="text text-center">
                  <span className="subheading">Express</span>
                  <h2>Ritco Ltd</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 pills">
              <div className="bd-example bd-example-tabs">
                <div className="d-flex justify-content-center">
                  <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                    <li className="nav-item">
                      <a className="nav-link active" id="pills-description-tab" data-toggle="pill" href="#pills-description" role="tab" aria-controls="pills-description" aria-expanded="true">Our Route</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" id="pills-manufacturer-tab" data-toggle="pill" href="#pills-manufacturer" role="tab" aria-controls="pills-manufacturer" aria-expanded="true">Description</a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-description" role="tabpanel" aria-labelledby="pills-description-tab">
                    <div className="row">
                      <div className="col-md-4">
                        <ul className="features">
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Musanze</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rubavu</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Nyabihu</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rutsiro</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rwamagana</li>
                        </ul>
                      </div>
                      <div className="col-md-4">
                        <ul className="features">
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Nyagatare</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rurindo</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Huye</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Bugesera</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Gatsibo</li>
                        </ul>
                      </div>
                      <div className="col-md-4">
                        <ul className="features">
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Musanze</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rubavu</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Nyabihu</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rutsiro</li>
                          <li className="check"><span className="ion-ios-checkmark"></span>Kigali - Rwamagana</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-manufacturer" role="tabpanel" aria-labelledby="pills-manufacturer-tab">
                    <p>RITCO Ltd (Rwanda Interlink Transport Company) is a public transport company in Rwanda. It was created in 2016 through a partnership between the Government of Rwanda and Toyota Tsusho Corporation (TTC) of Japan after the privatization of the former ONATRACOM.</p>
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

export default ExpressSinglePage;
