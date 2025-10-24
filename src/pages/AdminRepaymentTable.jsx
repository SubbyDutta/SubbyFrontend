import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";

export default function AdminRepaymentTable() {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchUsername, setSearchUsername] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchRepayments = async (username = "") => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = username
        ? `/repay/admin/repayments?username=${encodeURIComponent(username)}`
        : "/repay/admin/repayments";

      const res = await API.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRepayments(res.data || []);
    } catch (err) {
      console.error("Failed to fetch repayments", err);
      setError("Could not load repayments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepayments();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRepayments(searchUsername.trim());
  };

  return (
    <div className="admin-card" style={{background: "#fce5e5ff"}}>
      <h5 className="" style={{ marginBottom: 16, }}>
        On going loans
      </h5>

      {/* 🔍 Search Bar */}
      <form
        onSubmit={handleSearch}
        className="d-flex mb-3"
        style={{
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Search by username"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          style={{
            borderRadius: "8px",
            border: "1px solid #edbfc3ff",
            padding: "8px 12px",
            flex: 1,
            outline: "none",
          }}
        />
        <motion.button
          type="submit"
          className="primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: "#e63946",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            color: "#fff",
            fontWeight: 500,
          }}
        >
          Search
        </motion.button>
        <motion.button
          type="button"
          className="btn btn-outline-danger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSearchUsername("");
            fetchRepayments();
          }}
          style={{
            border: "1px solid #e63946",
            color: "#e63946",
            borderRadius: "8px",
            padding: "8px 16px",
            fontWeight: 500,
            background: "transparent",
          }}
        >
          Show All
        </motion.button>
      </form>

      {/* ⚙️ Status & Table */}
      {loading ? (
        <div className="alert alert-danger text-center">Loading repayments...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : repayments.length === 0 ? (
        <div className="alert alert-danger text-center">No repayments found.</div>
      ) : (
        <div className="table-responsive">
          <motion.table
            className="admin-table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr
                
              >
                <th className="p-3">Repayment ID</th>
                <th className="p-3">Username</th>
                <th className="p-3">Loan ID</th>
                <th className="p-3">Amount Paid</th>
                <th className="p-3">Remaining Balance</th>
                <th className="p-3">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {repayments.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(230,57,70,0.05)" }}
                  style={{
                    borderBottom: "1px solid #eee",
                    transition: "0.2s ease",
                  }}
                >
                  <td className="p-3">{r.id}</td>
                  <td className="p-3">{r.username}</td>
                  <td className="p-3">{r.loanId}</td>
                  <td className="p-3">₹{r.amountPaid}</td>
                  <td className="p-3">₹{r.remainingBalance}</td>
                  <td className="p-3">
                    {new Date(r.paymentDate).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      )}
    </div>
  );
}
