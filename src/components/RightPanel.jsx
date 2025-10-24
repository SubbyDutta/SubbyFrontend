

export default function RightPanel({ balance, accountNumber, onSendClick }) {
  return (
    <aside style={{ display: "flex", flexDirection: "column", gap: 20, width: 300 }}>
      
      {/* 💰 Account Summary */}
      <div
        className="panel card shadow-sm p-3"
        style={{
          borderRadius: 16,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fb 100%)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 16, color: "#e63946" }}>Account Summary</div>
        <div className="small-muted">
          Primary balance:{" "}
          <strong style={{ marginLeft: 6, color: "#28a745" }}>
            {typeof balance === "number"
              ? balance.toLocaleString("en-IN", { style: "currency", currency: "INR" })
              : balance}
          </strong>
        </div>
        <div className="small-muted">
          Account number:{" "}
          <span style={{ fontWeight: 700, marginLeft: 6 }}>{accountNumber || "Not created"}</span>
        </div>
        <button
          className="primary"
          onClick={onSendClick}
          style={{
            marginTop: 12,
            width: "100%",
            fontWeight: 600,
            borderRadius: 12,
            padding: "10px 0",
          }}
        >
          Send Money
        </button>
      </div>

      {/* 🔒 Security Panel */}
      <div
        className="panel card shadow-sm p-3"
        style={{
          borderRadius: 16,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fb 100%)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, color: "#e63946" }}>Security</div>
          <div className="small-muted">2FA recommended</div>
        </div>
        <div className="small-muted">
          Last login:{" "}
          <span style={{ fontWeight: 700, marginLeft: 6 }}>{new Date().toLocaleString()}</span>
        </div>
        <button
          className="ghost"
          style={{ width: "100%", marginTop: 10, borderRadius: 12, padding: "10px 0" }}
          onClick={() => alert("2FA setup flow not implemented")}
        >
          Setup 2FA
        </button>
      </div>

      {/* 🛠 Support Panel */}
      <div
        className="panel card shadow-sm p-3"
        style={{
          borderRadius: 16,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fb 100%)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 800, color: "#e63946" }}>Support</div>
        <div className="small-muted">
          Need help? Contact support from the backend system.
        </div>
        <button
          className="ghost"
          style={{ width: "100%", marginTop: 10, borderRadius: 12, padding: "10px 0" }}
          onClick={() => alert("Open support modal (not implemented)")}
        >
          Contact Support
        </button>
      </div>
    </aside>
  );
}
