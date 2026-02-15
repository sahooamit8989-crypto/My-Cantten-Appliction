


import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import LoginPop from "./components/LoginPop/LoginPop";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/Myorders/MyOrders";
import FoodDisplay from "./components/FoodDisplay/FoodDisplay";
import { ToastContainer } from "react-toastify";
import MyProfile from "./pages/MyProfile/MyProfile";
import SpinWheel from "./components/SpinWheel/SpinWheel";
import About from "./pages/About/About";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";

// Seat Reservation Imports


const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPop setShowLogin={setShowLogin} />}

      <div className="app">
        <Navbar setShowLogin={setShowLogin} />

        {/* 80% CENTERED CONTENT */}
        <div className="page-content container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/topDishes" element={<FoodDisplay />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/myprofile" element={<MyProfile/>} />
             <Route path="/rewards" element={<SpinWheel/>} />
              <Route path="/about" element={<About/>} />
              

            {/* New Seat Reservation Page */}
            
          </Routes>
        </div>

        {/* FULL WIDTH FOOTER */}
        <Footer />
        <WhatsAppButton/>
      </div>
    </>
  );
};

export default App;














