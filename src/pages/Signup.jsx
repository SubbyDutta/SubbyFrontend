import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null); // { type: "success"|"error", text }
  const navigate = useNavigate();

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .signup-bg {
        background: linear-gradient(135deg, #ffcccc, #ff6666);
        background-size: cover;
        background-position: center;
        background-blend-mode: overlay;
        animation: fadeInBg 1.2s ease-in-out;
      }

      @keyframes fadeInBg {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .card {
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(10px);
        border: none;
        border-radius: 18px;
        box-shadow: 0 8px 26px rgba(0, 0, 0, 0.15);
        animation: fadeUp 0.6s ease-in-out;
      }

      @keyframes fadeUp {
        from { transform: translateY(25px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }

      .btn-primary {
        background: linear-gradient(90deg, #ff6b81, #e63946);
        border: none;
        transition: all 0.3s ease;
      }

      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 10px rgba(230,57,70,0.4);
      }

      .form-control {
        border-radius: 10px;
        border: 1px solid #d1d5db;
        transition: all 0.2s ease;
      }

      .form-control:focus {
        border-color: #eb2525ff;
        box-shadow: 0 0 0 0.2rem rgba(235,37,37,0.25);
      }

      /* Popup Animation */
      .popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: white;
        color: black;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        padding: 25px 40px;
        z-index: 1000;
        text-align: center;
        animation: popupFadeIn 0.4s ease forwards;
      }

      @keyframes popupFadeIn {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }

      .popup-success {
        border-top: 6px solid #28a745;
      }

      .popup-error {
        border-top: 6px solid #dc3545;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPopup(null);
    setLoading(true);
    try {
      const res = await API.post("/auth/signup", form);
      setPopup({ type: "success", text: "Signup successful! Redirecting..." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setPopup({
        type: "error",
        text: "Signup failed. Please check your input or try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 signup-bg">
      <div className="card shadow-sm" style={{ width: 500 }}>
        <div className="card-body p-4">
          <h4 className="mb-3 text-center fw-semibold text-danger">Create Account</h4>
          <p className="text-center text-muted mb-3">
            Join our secure banking platform
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-medium">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-medium">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              className="btn btn-primary w-100 mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-decoration-none fw-semibold text-danger"
                >
                  Login
                </a>
              </small>
            </div>
          </form>
        </div>
      </div>

      {popup && (
        <div
          className={`popup ${
            popup.type === "success" ? "popup-success" : "popup-error"
          }`}
        >
          <h5 className="mb-2">
            {popup.type === "success" ? "✅ Success!" : "❌ Error!"}
          </h5>
          <p className="m-0">{popup.text}</p>
        </div>
      )}
    </div>
  );
}
