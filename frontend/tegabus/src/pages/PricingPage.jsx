import React from "react";


const PricingPage = () => {
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
              <li className="nav-item active"><a href="/pricing" className="nav-link">Price</a></li>
              <li className="nav-item"><a href="/express" className="nav-link">Express</a></li>
              <li className="nav-item active"><a href="/booking" className="nav-link">Buy Ticket</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2 js-fullheight" style={{backgroundImage: "url('/images/test5.jpeg')"}} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-fullheight align-items-end justify-content-start">
            <div className="col-md-9 ftco-animate pb-5">
              <p className="breadcrumbs"><span className="mr-2"><a href="/">Home <i className="ion-ios-arrow-forward"></i></a></span> <span>Price <i className="ion-ios-arrow-forward"></i></span></p>
              <h1 className="mb-3 bread">Price</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      <section className="ftco-section ftco-cart">
        <div className="container">
          <div className="row">
            <div className="col-md-12 ftco-animate">
              <div className="car-list">
                <table className="table">
                  <thead className="thead-primary">
                    <tr className="text-center">
                      <th>&nbsp;</th>
                      <th className="bg-primary heading">East</th>
                      <th className="bg-secondary heading">West</th>
                      <th className="bg-dark heading">North</th>
                      <th className="bg-black heading">South</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="car-image"><div className="img" style={{backgroundImage: "url('/images/bg_1h.png')"}}></div></td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">1500</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Rwamagana</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">2000</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Rubavu</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">2000</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Musanze</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">2000</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Huye</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="car-image"><div className="img" style={{backgroundImage: "url('/images/bg_1h.png')"}}></div></td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">1200</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Bugesera</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">2500</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Nyabihu</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">1500</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Rurindo</span>
                        </div>
                      </td>
                      <td className="price">
                        <p className="btn-custom"><a href="/#booking">Buy Ticket</a></p>
                        <div className="price-rate">
                          <h3>
                            <span className="per">4000</span>&nbsp;&nbsp;&nbsp;
                            <span className="num"><small className="currency">RWF</small> </span>
                          </h3>
                          <span className="subheading">Kigali - Nyarugura</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

export default PricingPage;
