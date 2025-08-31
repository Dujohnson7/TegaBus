
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BookingPage from "./pages/BookingPage";
import PricingPage from "./pages/PricingPage";
import ExpressPage from "./pages/ExpressPage";
import ExpressSinglePage from "./pages/ExpressSinglePage"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/express" element={<ExpressPage />} />
        <Route path="/express/:id" element={<ExpressSinglePage />} />
      </Routes>
    </Router>
  );
}

export default App;
