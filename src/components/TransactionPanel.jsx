import React from "react";
import LoadingInline from "./LoadingInLine";
import { motion } from "framer-motion";

export default function TransactionsPanel({ transactions, loading, onReload }) {
  const rowVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { 
        delay: i * 0.03,
        duration: 0.4,
        ease: "easeOut"
      } 
    }),
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const panelStyle = {
    width: 830,
    
    borderRadius: 24,
    background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
    position: "relative",
    overflow: "hidden",
     top:-30,
     right:-20,
    boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  };

  return (
    <motion.div
      className="card border-0 shadow-lg p-4 p-md-5"
      style={panelStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-light">
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 24,
                boxShadow: "0 6px 16px rgba(230,57,70,0.25)",
              }}
            >
              <i className="bi bi-clock-history"></i>
            </div>
            <div>
              <h4
                className="fw-bold mb-1"
                style={{
                  background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Transaction History
              </h4>
              <p className="text-muted small mb-0">
                <i className="bi bi-activity me-1"></i>
                Complete transaction records
              </p>
            </div>
          </div>

          <motion.button
            className="btn btn-danger px-4"
            onClick={onReload}
            style={{
              fontWeight: 700,
              borderRadius: 12,
              fontSize: "0.95rem",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Reload
          </motion.button>
        </div>

        {/* Table Section */}
        {loading ? (
          <div className="text-center py-5">
            <LoadingInline text="Loading transactions..." />
          </div>
        ) : transactions && transactions.length ? (
          <div
            style={{
              maxHeight: 600,
              overflowY: "auto",
              borderRadius: 16,
              background: "#ffffff",
              border: "1px solid rgba(220,53,69,0.1)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
            }}
            className="services-container"
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                    color: "#fff",
                  }}
                >
                  {[
                    { label: "Timestamp", icon: "bi-clock-fill" },
                    { label: "From", icon: "bi-person-fill" },
                    { label: "To", icon: "bi-person-plus-fill" },
                    { label: "Amount", icon: "bi-currency-rupee" },
                    { label: "Type", icon: "bi-globe" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      style={{
                        padding: "16px 16px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        textAlign: "left",
                        letterSpacing: "0.5px",
                        borderBottom: "none",
                        position: "sticky",
                        top: 0,
                        zIndex: 10,
                      }}
                    >
                      <i className={`bi ${h.icon} me-1`}></i>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {transactions.map((t, i) => (
                  <motion.tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "#f8f9fa",
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      cursor: "pointer",
                    }}
                  

                    variants={rowVariants}
                    custom={i}
                  >
                    <td style={{ padding: "14px 16px", fontSize: "0.9rem" }}>
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-calendar3 text-muted" style={{ fontSize: 14 }}></i>
                        {t.timestamp ? new Date(t.timestamp).toLocaleString() : "—"}
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.9rem" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #ff6b81 0%, #e63946 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                          {String(t.senderAccount || t.from || "—")[0]}
                        </span>
                        <span className="text-muted">{t.senderAccount || t.from || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: "0.9rem" }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: 700,
                        }}>
                          {String(t.receiverAccount || t.to || "—")[0]}
                        </span>
                        <span className="text-muted">{t.receiverAccount || t.to || "—"}</span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, fontSize: "0.95rem" }}>
                      <span style={{
                        color: "#28a745",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}>
                        <i className="bi bi-currency-rupee"></i>
                        {typeof t.amount === "number"
                          ? t.amount.toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })
                          : t.amount}
                      </span>
                    </td>
                    
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "6px 12px",
                          borderRadius: 20,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: t.isForeign 
                            ? "rgba(59,130,246,0.1)" 
                            : "rgba(16,185,129,0.1)",
                          color: t.isForeign ? "#3b82f6" : "#10b981",
                        }}
                      >
                        <i className={`bi ${t.isForeign ? "bi-globe" : "bi-house-fill"}`}></i>
                        {t.isForeign ? "Foreign" : "Domestic"}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <motion.div
            className="text-center py-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: 16,
              background: "#f8f9fa",
              padding: "3rem 2rem",
              border: "2px dashed rgba(220,53,69,0.2)",
            }}
          >
            <div style={{
              width: 80,
              height: 80,
              margin: "0 auto 1.5rem",
              borderRadius: "50%",
              background: "rgba(220,53,69,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              color: "#e63946",
            }}>
              <i className="bi bi-inbox"></i>
            </div>
            <h5 className="fw-bold text-muted mb-2">No Transactions Found</h5>
            <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
              Your transaction history will appear here
            </p>
          </motion.div>
        )}

        {/* Summary Footer */}
        {transactions && transactions.length > 0 && (
          <motion.div
            className="mt-4 pt-3 border-top border-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
          >
            <div className="d-flex align-items-center gap-3 text-muted small">
              <i className="bi bi-info-circle-fill text-primary"></i>
              <span>Total Records: <strong>{transactions.length}</strong></span>
              <span className="mx-2">•</span>
              <i className="bi bi-shield-check-fill text-success"></i>
              <span>Verified Transactions</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
