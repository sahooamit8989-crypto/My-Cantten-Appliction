


import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";

const statusSteps = [
  "Placed",
  "Accepted",
  "Cooking",
  "Ready",
  "Delivered",
  "Cancelled"
];

const Orders = ({ url, token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all orders
  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setOrders(res.data.data);
      else toast.error("Failed to fetch orders");

    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Update status (ANY status from dropdown)
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(`Status updated to "${newStatus}"`);
        fetchAllOrders();
      } else toast.error(res.data.message);

    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
    const interval = setInterval(fetchAllOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Placed": return "status-placed";
      case "Accepted": return "status-accepted";
      case "Cooking": return "status-cooking";
      case "Ready": return "status-ready";
      case "Delivered": return "status-delivered";
      case "Cancelled": return "status-cancelled";
      default: return "";
    }
  };

  return (
    <div className="orders">
      <h1 className="orders-title">All Orders</h1>

      <div className="orders-container">
        {loading ? (
          <p className="orders-empty">Loading orders...</p>

        ) : orders.length === 0 ? (
          <p className="orders-empty">No orders found</p>

        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-card">

              <p><b>Order ID:</b> {order._id}</p>
              <p><b>Amount:</b> ₹{order.amount}</p>

              <p>
                Status:{" "}
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </p>

              {/* Dropdown Status Control */}
              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
              >
                {statusSteps.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <div className="order-items">
                <ul>
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;




