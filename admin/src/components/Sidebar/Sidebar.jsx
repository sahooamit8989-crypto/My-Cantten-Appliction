



import React from 'react'
import "./Sidebar.css"
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to="/list"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>Sales Overview</p>
        </NavLink>

                <NavLink
          to="/coupon"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>Coupon</p>
        </NavLink>

                        <NavLink
          to="/update"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>Updates</p>
        </NavLink>

          <NavLink
          to="/reward"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>RewardManager</p>
        </NavLink>


                  <NavLink
          to="/Approve"
          className={({ isActive }) =>
            `sidebar-option ${isActive ? "active" : ""}`
          }
        >
          <img src={assets.order_icon} alt="" />
          <p>RewardApprove</p>
        </NavLink>


      </div>
    </div>
  )
}

export default Sidebar
