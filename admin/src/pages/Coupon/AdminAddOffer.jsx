import React, { useState } from "react";
import axios from "axios";
import "./AdminAddOffer.css";

const AdminAddOffer = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("adminToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    couponCode: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscountAmount: "",
    isFirstOrderOnly: false,
    isFestivalOffer: false,
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${url}/api/offers/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Offer Created Successfully ✅");
      } else {
        alert("Error creating offer");
      }
    } catch (error) {
      alert("Server Error");
    }
  };

  return (
    <div className="admin-offer-container">
      <div className="admin-offer-card">
        <h2>Create New Offer 🎁</h2>

        <form onSubmit={handleSubmit} className="admin-offer-form">

          <div className="form-group">
            <label>Title</label>
            <input name="title" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input name="description" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Coupon Code</label>
            <input name="couponCode" placeholder="SAVE20" onChange={handleChange} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Discount Type</label>
              <select name="discountType" onChange={handleChange}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <div className="form-group">
              <label>Discount Value</label>
              <input name="discountValue" type="number" onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Minimum Order</label>
              <input name="minOrderAmount" type="number" onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Max Discount</label>
              <input name="maxDiscountAmount" type="number" onChange={handleChange} />
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input type="checkbox" name="isFirstOrderOnly" onChange={handleChange} />
              First Order Only
            </label>

            <label>
              <input type="checkbox" name="isFestivalOffer" onChange={handleChange} />
              Festival Offer
            </label>

            <label>
              <input type="checkbox" name="isActive" defaultChecked onChange={handleChange} />
              Active
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input name="startDate" type="datetime-local" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input name="endDate" type="datetime-local" onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Offer
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddOffer;
