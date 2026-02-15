import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminSendOfferMail.css"
const AdminSendOfferMail = ({ url, token }) => {
  const [form, setForm] = useState({
    subject: "",
    title: "",
    messageBody: "",
    couponCode: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendMail = async () => {
    try {
      const res = await axios.post(
        `${url}/api/offer-mail/send`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) toast.success(res.data.message);
      else toast.error(res.data.message);
    } catch (err) {
      toast.error("Failed to send offer mail");
    }
  };

  return (
    <div className="offer-mail-panel">
      <h2>Send Offer Mail</h2>

      <input name="subject" placeholder="Mail Subject" onChange={handleChange} />
      <input name="title" placeholder="Offer Title" onChange={handleChange} />

      <textarea
        name="messageBody"
        placeholder="Write Offer Message..."
        onChange={handleChange}
      />

      <input name="couponCode" placeholder="Coupon Code (Optional)" onChange={handleChange} />
      <input name="expiryDate" placeholder="Expiry Date (Optional)" onChange={handleChange} />

      <button onClick={sendMail}>Send Offer Mail</button>
    </div>
  );
};

export default AdminSendOfferMail;
