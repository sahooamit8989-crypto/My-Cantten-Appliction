


import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    getTotalCartAmount,
    getFinalAmount,
    discountAmount,
    applyCoupon,
    token,
    food_list,
    cartItems,
    url,
  } = useContext(StoreContext);

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Apply Coupon with Toast
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error("Enter coupon code");
      return;
    }

    try {
      const res = await applyCoupon(couponCode);

      if (res.success) {
        toast.success("Coupon Applied Successfully 🎉");
      } else {
        toast.error(res.message || "Invalid coupon");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  // 🔥 Place Order with Loading + Toast
  const placeorder = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          name: item.name,
          price: item.price,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      items: orderItems,
      couponCode: couponCode || null,
    };

    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.session_url) {
        toast.loading("Redirecting to secure payment...");
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message || "Order failed");
      }
    } catch (err) {
      console.error("Order failed:", err.response?.data || err.message);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-total">
      <h2>Order Summary</h2>

      <div className="cart-total-details">
        <p>Subtotal</p>
        <p>₹{getTotalCartAmount()}</p>
      </div>

      <div className="cart-total-details">
        <p>Service Fee</p>
        <p>₹1</p>
      </div>

      <div className="coupon-box">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <button type="button" onClick={handleApplyCoupon}>
          Apply
        </button>
      </div>

      {discountAmount > 0 && (
        <div className="cart-total-details discount">
          <p>Discount</p>
          <p>- ₹{discountAmount}</p>
        </div>
      )}

      <hr />

      <div className="cart-total-details">
        <b>Total</b>
        <b>₹{getFinalAmount() + 1}</b>
      </div>

      <button
        className="proceed-btn"
        onClick={placeorder}
        disabled={loading}
      >
        {loading ? <span className="spinner"></span> : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default PlaceOrder;
