import React, { useState } from "react";
import API from "../api";
import { motion } from "framer-motion";

export default function TransferPanel({ onComplete }) {
  const [form, setForm] = useState({
    senderAccount: "",
    receiverAccount: "",
    amount: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (!form.senderAccount || !form.receiverAccount || !form.amount || !form.password) {
      setMsg({ type: "error", text: "Please fill all fields." });
      return;
    }

    setLoading(true);
    try {
      await API.post("/transfer/transfer", {
        senderAccount: form.senderAccount,
        receiverAccount: form.receiverAccount,
        amount: Number(form.amount),
        password: form.password,
      });

      setMsg({ type: "success", text: "Transfer completed successfully!" });
      setForm({ senderAccount: "", receiverAccount: "", amount: "", password: "" });
      onComplete?.();
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        setMsg({ type: "error", text: "Incorrect password. Please try again." });
      } else {
        setMsg({
          type: "error",
          text: err?.response?.data || err?.data || "Transfer failed",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <img
        src="https://cdn-icons-png.flaticon.com/512/2920/2920322.png"
        alt="Transfer Icon"
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
        src="https://cdn-icons-png.flaticon.com/512/2331/2331949.png"
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

      <div className="d-flex justify-content-between align-items-center mb-3" style={{ zIndex: 1 }}>
        <div>
          <h5 className="fw-bold text-danger">Transfer Funds</h5>
          <p className="small text-muted">Send money securely between accounts</p>
        </div>
        <motion.button
          className="btn btn-outline-danger btn-sm"
          onClick={() => setForm({ senderAccount: "", receiverAccount: "", amount: "", password: "" })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
      </div>

      <form onSubmit={submit} className="row g-3 position-relative" style={{ zIndex: 2 }}>
        {[
          { label: "Sender Account", key: "senderAccount", type: "text", placeholder: "Enter sender account no." },
          { label: "Receiver Account", key: "receiverAccount", type: "text", placeholder: "Enter receiver account no." },
          { label: "Amount (₹)", key: "amount", type: "number", placeholder: "Enter amount" },
          { label: "Account Password", key: "password", type: "password", placeholder: "Enter password" },
        ].map((field, idx) => (
          <div className="col-md-6" key={idx}>
            <label className="form-label fw-semibold">{field.label}</label>
            <input
              type={field.type}
              className="form-control border-danger"
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            />
          </div>
        ))}

        <div className="col-12 mt-3 d-flex gap-3">
          <motion.button
            type="submit"
            className="primary px-4"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Processing..." : "Send Money"}
          </motion.button>
          <motion.button
            type="button"
            className="ghost"
            onClick={() => setForm({ senderAccount: "", receiverAccount: "", amount: "", password: "" })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear
          </motion.button>
        </div>

        {msg && (
          <div className={`alert mt-3 ${msg.type === "error" ? "alert-danger" : "alert-success"} fw-semibold`}>
            {msg.text}
          </div>
        )}
      </form>

      <div className="mt-4 py-3">
        <p className="small text-black fw-semibold mt-2 mb-0">
          100% Secure — End-to-End Encrypted Transfers
        </p>
      </div>
    </motion.div>
  );
}