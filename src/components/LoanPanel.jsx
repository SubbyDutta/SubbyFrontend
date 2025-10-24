import React, { useState } from "react";
import API from "../api";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";

export default function Loan() {
  const token = localStorage.getItem("token");
  const username = token ? jwtDecode(token).sub : null;

  const [income, setIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const [adhar, setAdhar] = useState("");
  const [pan, setPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [eligibility, setEligibility] = useState(null);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCheckEligibility = async () => {
    if (!income || !creditScore || !requestedAmount || !adhar || !pan) {
      setError("Please fill all fields.");
      return;
    }

    if (Number(requestedAmount) > Number(income) * 2) {
      setError("Requested amount cannot exceed 2× your monthly income.");
      return;
    }

    if (Number(creditScore) > 800) {
      setError("Credit score cannot exceed 800.");
      return;
    }

    if (adhar.length < 12) {
      setError("Aadhar number must be at least 12 characters.");
      return;
    }

    if (pan.length !== 10) {
      setError("PAN number must be exactly 10 characters.");
      return;
    }

    if (!username) {
      setError("Please log in first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await API.post("/loan/check", {
        username,
        income,
        creditScore,
        requestedAmount,
        adhar,
        pan,
      });
      setEligibility(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error checking eligibility");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    if (!eligibility || !eligibility.id) {
      setError("Please check eligibility first");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await API.post(`/loan/apply/${eligibility.id}`);
      setEligibility(res.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1800);
    } catch (err) {
      setError(err.response?.data || "Error applying for loan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="card border-0 shadow-lg p-4 position-relative overflow-hidden"
        style={{
          width: 800,
          borderRadius: "1rem",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(6px)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Icons */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/684/684831.png"
          alt="Loan Icon"
          style={{
            position: "absolute",
            right: "40px",
            top: "30px",
            width: "120px",
            opacity: 0.08,
            zIndex: 0,
          }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/2920/2920277.png"
          alt="Money Background"
          style={{
            position: "absolute",
            left: "-30px",
            bottom: "-20px",
            width: "160px",
            opacity: 0.06,
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div
          className="d-flex justify-content-between align-items-center mb-3"
          style={{ zIndex: 1 }}
        >
          <div>
            <h5 className="fw-bold text-danger">Loan Application</h5>
            <p className="small text-muted mb-0">
              Check your eligibility & apply instantly
            </p>
          </div>
          <motion.button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              setIncome("");
              setCreditScore("");
              setRequestedAmount("");
              setAdhar("");
              setPan("");
              setEligibility(null);
              setError("");
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </motion.button>
        </div>

        {/* Form */}
        <div className="row g-3 position-relative" style={{ zIndex: 2 }}>
          {[
            {
              label: "Monthly Income",
              value: income,
              set: setIncome,
              type: "number",
              placeholder: "Enter monthly income",
            },
            {
              label: "Credit Score",
              value: creditScore,
              set: setCreditScore,
              type: "number",
              placeholder: "Enter credit score",
            },
            {
              label: "Requested Loan Amount (₹)",
              value: requestedAmount,
              set: setRequestedAmount,
              type: "number",
              placeholder: "Enter loan amount",
            },
            {
              label: "Aadhar Number",
              value: adhar,
              set: setAdhar,
              type: "text",
              placeholder: "Enter Aadhar number",
            },
            {
              label: "PAN Number",
              value: pan,
              set: setPan,
              type: "text",
              placeholder: "Enter PAN number",
            },
          ].map((field, idx) => (
            <div className="col-md-6" key={idx}>
              <label className="form-label fw-semibold">{field.label}</label>
              <input
                type={field.type}
                className="form-control border-danger"
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
              />
            </div>
          ))}

          <div className="col-12 mt-3 d-flex gap-3">
            <motion.button
              onClick={handleCheckEligibility}
              className="primary px-4"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "Checking..." : "Check Eligibility"}
            </motion.button>
            <motion.button
              type="button"
              className="ghost"
              onClick={() => {
                setIncome("");
                setCreditScore("");
                setRequestedAmount("");
                setAdhar("");
                setPan("");
                setEligibility(null);
                setError("");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
          </div>

          {error && (
            <div className="alert mt-3 alert-danger fw-semibold">{error}</div>
          )}

          {eligibility && (
            <motion.div
              className="alert mt-4 p-3 rounded bg-light border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="fw-bold mb-1">Eligibility Result:</p>
              <p>
                Status:{" "}
                {eligibility.eligible ? "✅ Eligible" : "❌ Not Eligible"}
              </p>
              <p>Probability: {(eligibility.probability * 100).toFixed(2)}%</p>
              {eligibility.eligible && (
                <motion.button
                  onClick={handleApplyLoan}
                  className="mt-3 w-100 primary fw-semibold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply for Loan
                </motion.button>
              )}
            </motion.div>
          )}
        </div>

        <div className="mt-4 py-3">
          <p className="small text-black fw-semibold mb-0">
            Fast • Secure • Verified by Financial AI System
          </p>
        </div>
      </motion.div>

      {/* ✅ Centered Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.35)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3000,
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              style={{
                background: "#fff",
                color: "#111",
                padding: "28px 42px",
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                textAlign: "center",
                fontWeight: "600",
                letterSpacing: "0.5px",
                backdropFilter: "blur(8px)",
                border: "2px solid #ffbcbc",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                style={{
                  fontSize: "30px",
                  color: "#22c55e",
                  marginBottom: "10px",
                }}
              >
                ✓
              </motion.div>
              Loan Application Submitted Successfully!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
