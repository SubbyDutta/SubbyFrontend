
import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

const LoanRepaymentPanel = () => {
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const [loanRes, repaymentRes] = await Promise.all([
          API.get("/repay/user/approved", { headers: { Authorization: `Bearer ${token}` } }),
          API.get("/repay/repayments", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setLoans(loanRes.data);
        setRepayments(repaymentRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    }
    fetchData();
  }, [token]);

  const handleRepayment = async () => {
    if (!selectedLoanId || !repaymentAmount) {
      setMessage("Please select a loan and enter an amount.");
      return;
    }
    try {
      const res = await API.post(
        `/repay/repay/${selectedLoanId}`,
        { amount: repaymentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ Repayment successful. Remaining balance: ₹${res.data.remainingBalance}`);
      setRepaymentAmount("");
      setSelectedLoanId("");
      const updatedRepayments = await API.get("/repay/repayments", { headers: { Authorization: `Bearer ${token}` } });
      setRepayments(updatedRepayments.data);
    } catch (err) {
      const msg = err?.response?.data?.error || "❌ Repayment failed. Please try again.";
      setMessage(msg);
    }
  };

  // Motion Variants
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.3 } }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
  };

  return (
    <motion.div
      style={{
      
        backgroundPosition: "center",
        width: 800,
        padding: "30px 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      <div
        className="panel card shadow-lg"
        style={{
          width: "85%",
          maxWidth: 900,
          borderRadius: 20,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          padding: 40,
          boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <h5 className="text-danger" style={{ fontWeight: 800, marginBottom: 30, textAlign: "center" }}>
          Loan Repayment
        </h5>

        {/* Repayment Form */}
        <motion.div
          style={{
            padding: 24,
            borderRadius: 16,
            background: "#ffffff",
            boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
            marginBottom: 40,
          }}
          initial="hidden"
          animate="visible"
          variants={formVariants}
          custom={0}
        >
          <h4 style={{ fontWeight: 700, color: "#444", marginBottom: 16 }}>Make a Repayment</h4>

          <motion.select
            value={selectedLoanId}
            onChange={(e) => setSelectedLoanId(e.target.value)}
            style={selectStyle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <option value="">-- Choose a loan --</option>
            {loans.map((loan) => (
              <option key={loan.id} value={loan.id}>
                Loan #{loan.id} - ₹{loan.amount}
              </option>
            ))}
          </motion.select>

          <motion.input
            type="number"
            value={repaymentAmount}
            onChange={(e) => setRepaymentAmount(e.target.value)}
            placeholder="Enter repayment amount"
            style={inputStyle}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          />

          <motion.button
            onClick={handleRepayment}
            style={primaryButtonStyle}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Repay Now
          </motion.button>

          {message && (
            <motion.div
              style={{
                marginTop: 16,
                padding: 12,
                borderRadius: 10,
                background: message.includes("✅") ? "#e8f9ee" : "rgba(255, 230, 230, 0.9)",
                color: message.includes("✅") ? "#1e7a3d" : "#b91c1c",
                fontWeight: 600,
                textAlign: "center",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {message}
            </motion.div>
          )}
        </motion.div>

        {/* Repayment History Table */}
        <motion.div
          style={{
            padding: 24,
            borderRadius: 16,
            background: "#ffffff",
            boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h4 style={{ fontWeight: 700, color: "#444", marginBottom: 16 }}>Repayment History</h4>

          {repayments.length === 0 ? (
            <p style={{ color: "#777" }}>No repayments found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead style={{ background: "#f3f3f3", color: "#222", textTransform: "uppercase", fontSize: 13 }}>
                  <tr>
                    <th style={thStyle}>Loan ID</th>
                    <th style={thStyle}>Amount Paid</th>
                    <th style={thStyle}>Remaining Balance</th>
                    <th style={thStyle}>Payment Date</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}
                      whileHover={{ backgroundColor: "#e8f0fe", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      custom={i}
                    >
                      <td style={tdStyle}>{r.loanId}</td>
                      <td style={{ ...tdStyle, color: "#d62828", fontWeight: 600 }}>₹{r.amountPaid}</td>
                      <td style={{ ...tdStyle, color: "#2d6a4f", fontWeight: 600 }}>₹{r.remainingBalance}</td>
                      <td style={{ ...tdStyle, color: "#333" }}>{new Date(r.paymentDate).toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ccc",
  marginTop: 12,
  fontSize: 14,
  outline: "none",
};

const selectStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 14,
  outline: "none",
  marginTop: 12,
};

const primaryButtonStyle = {
  marginTop: 16,
  width: "100%",
  padding: "12px 0",
  borderRadius: 16,
  border: "none",
  background: "linear-gradient(90deg, #ff6b81, #e63946)",
  color: "#fff",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: 0.3,
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  boxShadow: "0 4px 10px rgba(230, 57, 70, 0.3)",
};

const thStyle = { padding: "12px 10px", textAlign: "left", fontWeight: 700 };
const tdStyle = { padding: "12px 10px", borderBottom: "1px solid #eee" };

export default LoanRepaymentPanel;
