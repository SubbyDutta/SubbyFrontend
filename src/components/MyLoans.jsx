import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

const LoanRepaymentPanel = () => {
  const [loans, setLoans] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
      setMessage({ type: "error", text: "Please select a loan and enter an amount." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await API.post(
        `/repay/repay/${selectedLoanId}`,
        { amount: repaymentAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ 
        type: "success", 
        text: `✅ Repayment successful. Remaining balance: ₹${res.data.remainingBalance}` 
      });
      setRepaymentAmount("");
      setSelectedLoanId("");
      const updatedRepayments = await API.get("/repay/repayments", { headers: { Authorization: `Bearer ${token}` } });
      setRepayments(updatedRepayments.data);
    } catch (err) {
      const msg = err?.response?.data?.error || "❌ Repayment failed. Please try again.";
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Motion Variants
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.05, duration: 0.3 } 
    }),
  };

  const panelStyle = {
    width: 800,
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
     top:-30,
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial="hidden"
      animate="visible"
      variants={panelVariants}
    >
      {/* Decorative gradient border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
        
          opacity: 0.8,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <div className="mb-4 text-center">
          <div className="d-inline-block mb-3">
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 28,
                margin: "0 auto",
                boxShadow: "0 8px 20px rgba(230,57,70,0.3)",
              }}
            >
              <i className="bi bi-credit-card-2-front-fill"></i>
            </div>
          </div>
          <h4
            className="fw-bold mb-2"
            style={{
              background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Loan Repayment
          </h4>
          <p className="text-muted small mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Manage and track your loan repayments
          </p>
        </div>

        {/* Repayment Form */}
        <motion.div
          className="card border-0 mb-4 p-4"
          style={{
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid rgba(220,53,69,0.1)",
          }}
          variants={formVariants}
        >
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-wallet2 me-2 text-danger" style={{ fontSize: 20 }}></i>
            <h5 className="fw-bold mb-0">Make a Repayment</h5>
          </div>

          <motion.select
            value={selectedLoanId}
            onChange={(e) => setSelectedLoanId(e.target.value)}
            className="form-select mb-3"
            style={{
              borderColor: "rgba(220,53,69,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: "1rem",
            }}
            initial={{ opacity: 0, x: -10 }}
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
            className="form-control mb-3"
            style={{
              borderColor: "rgba(220,53,69,0.3)",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: "1rem",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          />

          <motion.button
            onClick={handleRepayment}
            className="btn btn-danger w-100"
            style={{
              fontWeight: 600,
              borderRadius: 12,
              padding: "14px",
              fontSize: "1rem",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-down-circle-fill me-2"></i>
                Repay Now
              </>
            )}
          </motion.button>

          {message && (
            <motion.div
              className="mt-3 alert d-flex align-items-center gap-2"
              style={{
                borderRadius: 12,
                border: "none",
                background: message.type === "success" 
                  ? "rgba(16,185,129,0.1)" 
                  : "rgba(239,68,68,0.1)",
                color: message.type === "success" ? "#10b981" : "#ef4444",
                fontWeight: 600,
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <i className={`bi ${message.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}`} style={{ fontSize: 20 }}></i>
              <span>{message.text}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Repayment History Table */}
        <motion.div
          className="card border-0 p-4"
          style={{
            borderRadius: 20,
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            border: "1px solid rgba(220,53,69,0.1)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="d-flex align-items-center mb-3">
            <i className="bi bi-clock-history me-2 text-danger" style={{ fontSize: 20 }}></i>
            <h5 className="fw-bold mb-0">Repayment History</h5>
          </div>

          {repayments.length === 0 ? (
            <div className="text-center py-4">
              <div
                style={{
                  width: 64,
                  height: 64,
                  margin: "0 auto 1rem",
                  borderRadius: "50%",
                  background: "rgba(220,53,69,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  color: "#e63946",
                }}
              >
                <i className="bi bi-inbox"></i>
              </div>
              <p className="text-muted mb-0">No repayments found.</p>
            </div>
          ) : (
            <div style={{ 
              overflowX: "auto", 
              borderRadius: 16,
              border: "1px solid rgba(220,53,69,0.1)",
              maxHeight: 450,
              overflowY: "auto",
            }} className="services-container">
              <table className="table mb-0">
                <thead>
                  <tr style={{
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    color: "#fff",
                  }}>
                    <th style={{ 
                      padding: "14px 16px", 
                      fontWeight: 600, 
                      fontSize: "0.85rem",
                      borderBottom: "none",
                    }}>
                      <i className="bi bi-hash me-1"></i>Loan ID
                    </th>
                    <th style={{ 
                      padding: "14px 16px", 
                      fontWeight: 600, 
                      fontSize: "0.85rem",
                      borderBottom: "none",
                    }}>
                      <i className="bi bi-currency-rupee me-1"></i>Amount Paid
                    </th>
                    <th style={{ 
                      padding: "14px 16px", 
                      fontWeight: 600, 
                      fontSize: "0.85rem",
                      borderBottom: "none",
                    }}>
                      <i className="bi bi-wallet2 me-1"></i>Remaining
                    </th>
                    <th style={{ 
                      padding: "14px 16px", 
                      fontWeight: 600, 
                      fontSize: "0.85rem",
                      borderBottom: "none",
                    }}>
                      <i className="bi bi-calendar3 me-1"></i>Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      style={{
                        background: i % 2 === 0 ? "#fff" : "#f8f9fa",
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                      }}
                      whileHover={{
                        background: "rgba(255,107,129,0.08)",
                        cursor: "pointer",
                      }}
                      initial="hidden"
                      animate="visible"
                      variants={rowVariants}
                      custom={i}
                    >
                      <td style={{ padding: "14px 16px", fontSize: "0.9rem" }}>
                        <span className="badge bg-secondary" style={{ fontSize: "0.8rem" }}>
                          #{r.loanId}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#ef4444" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="bi bi-arrow-down-circle-fill text-danger"></i>
                          ₹{r.amountPaid}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#10b981" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <i className="bi bi-wallet2 text-success"></i>
                          ₹{r.remainingBalance}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: "0.9rem", color: "#6c757d" }}>
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date(r.paymentDate).toLocaleString()}
                      </td>
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

export default LoanRepaymentPanel;
