import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Route, Routes} from "react-router-dom";
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import { ToastContainer} from 'react-toastify';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import AdminAddOffer from './pages/Coupon/AdminAddOffer';
import AdminSendOfferMail from './pages/AdminSendOfferMail/AdminSendOfferMail';
import RewardManager from './pages/RewardManager/RewardManager';
import AdminRewardClaims from './pages/AdminRewardClaims/AdminRewardClaims';


const App = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <hr />
      <div className="app-components">
        <Sidebar/>
             <Routes>
               <Route path='/' element={<Home/>}/>
               <Route path='/add' element={<Add url={url}/>}/>
                <Route path='/list' element={<List url={url}/>}/>
                 <Route path='/orders' element={<Orders url={url}/>}/>
                 <Route path="/dashboard" element={<Dashboard url={url}/>}/>
                 <Route path="/coupon" element={<AdminAddOffer/>}/>
                 <Route path="/update" element={<AdminSendOfferMail url={url}/>}/>
                  <Route path="/reward" element={<RewardManager/>}/>
                  <Route path="/Approve" element={<AdminRewardClaims url={url}/>}/>
             </Routes>
      </div>
    </div>
  )
}

export default App
