import React, { useContext, useEffect, useState } from "react";
import "./MyProfile.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { url, token } = useContext(StoreContext);

  const [user, setUser] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwordData, setPasswordData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // ================= FETCH PROFILE =================
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.user);
        setPasswordData((prev) => ({
          ...prev,
          email: res.data.user.email,
        }));
      }
    } catch {
      toast.error("Failed to load profile");
    }
  };

  // ================= FETCH REWARDS =================
  const fetchRewards = async () => {
    try {
      const res = await axios.get(`${url}/api/user/my-rewards`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRewards(res.data.rewards || []);
    } catch {
      console.log("Reward fetch failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchRewards();
  }, []);

  // ================= SEND OTP =================
  const sendOTP = async () => {
    try {
      await axios.post(`${url}/api/v1/auth/password/forget`, {
        email: passwordData.email,
      });
      toast.success("OTP sent to email");
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const changePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await axios.post(`${url}/api/v1/auth/password/reset`, passwordData);
      toast.success("Password updated successfully");
      setShowPasswordBox(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  if (loading)
    return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-wrapper">

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <div className="profile-info">
            <div className="info-row">
              <span>Name</span>
              <strong>{user?.name}</strong>
            </div>
            <div className="info-row">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
          </div>

          <button
            className="change-pass-btn"
            onClick={() => setShowPasswordBox(!showPasswordBox)}
          >
            Change / Forgot Password
          </button>

          {showPasswordBox && (
            <div className="password-box">
              <input
                type="number"
                placeholder="Enter OTP"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, otp: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="New Password"
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm Password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <div className="password-actions">
                <button onClick={sendOTP}>Send OTP</button>
                <button onClick={changePassword}>Update</button>
              </div>
            </div>
          )}
        </div>

        {/* REWARDS CARD */}
        <div className="rewards-card">
          <h3>🎁 My Rewards</h3>

          {rewards.length === 0 && (
            <p className="no-reward">No rewards yet</p>
          )}

          {rewards.map((r) => (
            <div key={r._id} className={`reward-item ${r.status}`}>
              <span>{r.rewardName}</span>
              <b>{r.status.toUpperCase()}</b>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyProfile;











