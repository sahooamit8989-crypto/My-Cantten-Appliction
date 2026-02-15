import React, { useState } from "react";
import "./RewardManager.css";

export default function Reward() {
  const [rewards, setRewards] = useState([
    {
      _id: 1,
      name: "Free Tea",
      type: "free_item",
      value: "1 Samosa",
      probability: 15,
      active: true,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    type: "discount",
    value: "",
    probability: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.name) return;

    setRewards([
      ...rewards,
      {
        ...form,
        _id: Date.now(),
        active: true,
      },
    ]);

    setForm({
      name: "",
      type: "discount",
      value: "",
      probability: "",
    });
  };

  const toggleActive = (reward) => {
    setRewards(
      rewards.map((r) =>
        r._id === reward._id ? { ...r, active: !r.active } : r
      )
    );
  };

  const handleDelete = (id) => {
    setRewards(rewards.filter((r) => r._id !== id));
  };

  return (
    <div className="reward-container">
      <h2 className="title">Reward Management</h2>

      {/* FORM */}
      <div className="reward-form">
        <input
          type="text"
          name="name"
          placeholder="Reward Name"
          value={form.name}
          onChange={handleChange}
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="discount">Discount</option>
          <option value="free_item">Free Item</option>
          <option value="cashback">Cashback</option>
        </select>

        <input
          type="text"
          name="value"
          placeholder="Value"
          value={form.value}
          onChange={handleChange}
        />

        <input
          type="number"
          name="probability"
          placeholder="Probability %"
          value={form.probability}
          onChange={handleChange}
        />

        <button className="add-btn" onClick={handleAdd}>
          Add Reward
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="reward-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Value</th>
              <th>Probability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rewards.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.value}</td>
                <td>{r.probability}%</td>
                <td>
                  <span
                    className={
                      r.active ? "status active" : "status inactive"
                    }
                    onClick={() => toggleActive(r)}
                  >
                    {r.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(r._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
