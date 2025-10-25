// src/pages/Signup.jsx
import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    mobile: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await API.post("/auth/signup", {
        username: form.username,
        password: form.password,
        email: form.email,
        mobile: form.mobile,
      });

      const message = res.data;
      if (message.includes("already exists")) {
        setError(message);
      } else {
        setSuccessMsg("🎉 Signup Successful! Redirecting to login...");
        setTimeout(() => {
          setSuccessMsg("");
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="signup-root"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #b30000 0%, #cc0000 35%, #ff6666 80%, #ffffff 100%)",
        backgroundSize: "200% 200%",
        animation: "bgMove 10s ease infinite",
      }}
    >
      <motion.div
        className="signup-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "420px",
          padding: "35px 30px",
          borderRadius: "18px",
          boxShadow: "0 12px 35px rgba(179, 0, 0, 0.3)",
          background: "rgba(255, 255, 255, 0.97)",
          backdropFilter: "blur(8px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <motion.h4
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            textAlign: "center",
            color: "#b30000",
            marginBottom: "5px",
            fontWeight: 700,
          }}
        >
          register 
        </motion.h4>
        <p
          style={{
            textAlign: "center",
            color: "#555",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          Join our secure banking platform today
        </p>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              color: "#cc0000",
              textAlign: "center",
              marginBottom: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          {[
            { placeholder: "Username", key: "username" },
            { placeholder: "Email", key: "email", type: "email" },
            { placeholder: "Mobile Number", key: "mobile", type: "tel" },
            { placeholder: "Password", key: "password", type: "password" },
            {
              placeholder: "Confirm Password",
              key: "confirmPassword",
              type: "password",
            },
          ].map((field, index) => (
            <motion.input
              key={field.key}
              whileFocus={{ scale: 1.02, borderColor: "#b30000" }}
              transition={{ duration: 0.2 }}
              type={field.type || "text"}
              placeholder={field.placeholder}
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              required
              style={{
                border: "1.5px solid #ff9999",
                padding: "11px 14px",
                borderRadius: "8px",
                outline: "none",
                fontSize: "14px",
              }}
            />
          ))}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "linear-gradient(90deg, #ff4d4d, #cc0000)",
              color: "#fff",
              border: "none",
              padding: "12px 0",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "15px",
              boxShadow: "0 5px 15px rgba(255, 0, 0, 0.25)",
              cursor: "pointer",
            }}
          >
            Sign Up
          </motion.button>
        </form>

        {/* Login link */}
        <div className="text-center mt-3 small-muted">
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#b30000",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login
          </a>
        </div>

        {/* ✅ Success Popup */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(255, 0, 0, 0.15)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <motion.div
                key="popup"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{
                  background: "#fff",
                  borderRadius: "18px",
                  border: "2px solid #ffb3b3",
                  boxShadow: "0 10px 35px rgba(255, 0, 0, 0.3)",
                  padding: "30px 50px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "#b30000",
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{
                    duration: 0.6,
                    type: "spring",
                    stiffness: 120,
                    damping: 8,
                  }}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    background: "#ffcccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0 0 25px rgba(255,0,0,0.3)",
                    marginBottom: "10px",
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{ fontSize: "34px" }}
                  >
                    ✅
                  </motion.span>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#a60000",
                    marginTop: "5px",
                  }}
                >
                  {successMsg}
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background animation */}
      <style>
        {`
          @keyframes bgMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Signup;
