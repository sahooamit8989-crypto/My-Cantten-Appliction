import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminRewardClaims.css";

const AdminRewardClaims = () => {
  const [list, setList] = useState([]);
  const url = "http://localhost:4000";

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`${url}/api/adminreward/reward-claims`);
      setList(res.data.list);
    } catch (err) {
      alert("Failed to fetch reward claims");
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const updateStatus = async (id, action) => {
    try {
      await axios.put(`${url}/api/adminreward/${action}/${id}`);
      fetchClaims();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="claims-container">
      <h2 className="claims-title">🎁 Reward Claims</h2>

      <div className="claims-table-wrapper">
        <table className="claims-table">
          <thead>
            <tr>
              <th>Reward</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((item) => (
              <tr key={item._id}>
                <td>{item.rewardName}</td>
                <td>{item.status}</td>
                <td className="action-cell">
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus(item._id, "reward-approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="used-btn"
                    onClick={() => updateStatus(item._id, "reward-used")}
                  >
                    Mark Used
                  </button>
                  <button
                    className="invalid-btn"
                    onClick={() => updateStatus(item._id, "reward-invalid")}
                  >
                    Invalid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRewardClaims;


