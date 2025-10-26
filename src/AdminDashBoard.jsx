import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import { jwtDecode } from "jwt-decode";
import "./AdminDashboard.css";
import AdminRepaymentTable from "./pages/AdminRepaymentTable";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CreditCard,
  Users,
  Wallet,
  UserCog,
  LogOut,
  Search,
  Download,
  RefreshCw,
  Edit,
  Trash2,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Activity,
} from "lucide-react";

const PAGE_SIZE = 12;

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // UI & state
  const [view, setView] = useState("home");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // data
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [editForm, setEditForm] = useState(null);
  
  // search / filters / pages
  const [searchId, setSearchId] = useState("");
  const [userQuery, setUserQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [transQuery, setTransQuery] = useState("");
  const [transPage, setTransPage] = useState(1);
  const [accQuery, setAccQuery] = useState("");
  const [accPage, setAccPage] = useState(1);
  
  // loans (admin)
  const [loans, setLoans] = useState([]);
  const [loanLoading, setLoanLoading] = useState(false);
  const [loanQuery, setLoanQuery] = useState("");
  const [loanPage, setLoanPage] = useState(1);
  const [popup, setPopup] = useState(null);

  // Stats for dashboard
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    fraudCount: 0,
    totalBalance: 0,
  });

  // load admin identity, redirect if no token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const payload = jwtDecode(token);
      const role = (payload.role || payload?.roles || "").toString().toUpperCase();
      if (!role.includes("ADMIN")) {
        navigate("/user");
      }
    } catch (e) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  // Calculate stats when data changes
  useEffect(() => {
    const fraudCount = transactions.filter((t) => isFraudFlag(t)).length;
    const totalBalance = users.reduce((sum, u) => sum + (Number(u.balance) || 0), 0);
    
    setStats({
      totalUsers: users.length,
      totalTransactions: transactions.length,
      fraudCount,
      totalBalance,
    });
  }, [transactions, users]);

  // alerts
  const showPopup = (type, message) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 3000);
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // logout
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // helpers
  const isFraudFlag = (t) => {
    return t?.is_fraud === 1 || t?.is_fraud === true || t?.isFraud === 1 || t?.fraud === true;
  };

  const scalarize = (v) => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join("-");
    if (typeof v === "object") {
      if ("id" in v && (typeof v.id === "string" || typeof v.id === "number")) return String(v.id);
      if ("userId" in v && (typeof v.userId === "string" || typeof v.userId === "number")) return String(v.userId);
      if ("user_id" in v && (typeof v.user_id === "string" || typeof v.user_id === "number")) return String(v.user_id);
      if ("accountId" in v && (typeof v.accountId === "string" || typeof v.accountId === "number")) return String(v.accountId);
      const primitive = Object.values(v).find((x) => typeof x === "string" || typeof x === "number");
      if (primitive !== undefined) return String(primitive);
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
    return String(v);
  };

  const maskValue = (k, v) => {
    if (k === "password") return "••••••••";
    return scalarize(v);
  };

  // Transactions
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/transactions/check");
      setTransactions(res.data || []);
      setView("transactions");
      showAlert("success", "Transactions loaded successfully");
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // export CSV
  const exportTransactionsCSV = () => {
    if (!transactions || transactions.length === 0) {
      showAlert("info", "No transactions to export");
      return;
    }
    const rows = transactions.map((t) => {
      const copy = { ...t };
      delete copy.password;
      return copy;
    });
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(",")]
      .concat(rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().slice(0, 19)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showAlert("success", "CSV exported successfully");
  };

  // Users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data || []);
      setView("users");
      showAlert("success", "Users loaded successfully");
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const resolveId = (maybe) => {
    if (maybe == null) return null;
    if (typeof maybe === "number" || typeof maybe === "string") return String(maybe);
    if (typeof maybe === "object") {
      if ("id" in maybe) return String(maybe.id);
      if ("userId" in maybe) return String(maybe.userId);
      if ("user_id" in maybe) return String(maybe.user_id);
    }
    return String(maybe);
  };

  // search single user and balance
  const searchUser = async (idOverride) => {
    const raw = idOverride ?? searchId;
    const id = resolveId(raw);
    if (!id) {
      showAlert("danger", "Enter a user ID");
      return;
    }
    setLoading(true);
    try {
      const userRes = await API.get(`/admin/user/${id}`);
      const user = userRes.data;
      let balance = null;
      
      try {
        const balRes = await API.get(`/admin/balance/${id}`);
        const bData = balRes.data;
        if (typeof bData === "number") balance = bData;
        else if (bData && typeof bData === "object" && ("balance" in bData || "amount" in bData))
          balance = bData.balance ?? bData.amount ?? null;
        else balance = bData;
      } catch (err) {
        balance = user.balance ?? null;
      }
      
      const merged = {
        id: user.id ?? user.userId ?? user.user_id ?? user.accountId ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
        role: user.role ?? "",
        balance: typeof balance === "number" ? balance : user.balance ?? "",
        ...user,
      };
      
      merged.balance = merged.balance === null || merged.balance === undefined ? "" : merged.balance;
      setEditForm(merged);
      setView("editUser");
      showAlert("success", "User loaded successfully");
    } catch (err) {
      console.error(err);
      setEditForm(null);
      showAlert("danger", "User not found");
    } finally {
      setLoading(false);
    }
  };

  // save user details
  const saveUserDetails = async () => {
    if (!editForm || !editForm.id) return;
    setLoading(true);
    try {
      const payload = {
        username: editForm.username,
        email: editForm.email,
        mobile: editForm.mobile,
        role: editForm.role,
      };
      await API.put(`/admin/user/${resolveId(editForm.id)}`, payload);
      showAlert("success", "User details updated successfully");
      await searchUser(editForm.id);
      if (view === "users") await fetchUsers();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to update user details");
    } finally {
      setLoading(false);
    }
  };

  // save balance
  const saveBalance = async () => {
    if (!editForm || !editForm.id) return;
    const parsed = parseFloat(String(editForm.balance));
    if (Number.isNaN(parsed)) {
      showAlert("danger", "Enter a valid balance");
      return;
    }
    setLoading(true);
    try {
      await API.patch("/admin/balance/", { userId: resolveId(editForm.id), amount: parsed });
      showAlert("success", "Balance updated successfully");
      await searchUser(editForm.id);
      if (view === "users") await fetchUsers();
      if (view === "accounts") await fetchAccounts();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to update balance");
    } finally {
      setLoading(false);
    }
  };

  // delete user
  const deleteUser = async (id) => {
    const resolved = resolveId(id);
    if (!resolved) return;
    if (!window.confirm(`Delete user with ID ${resolved}? This is irreversible.`)) return;
    setLoading(true);
    try {
      await API.delete(`admin/user/${resolved}`);
      showAlert("success", "User deleted successfully");
      setEditForm(null);
      setSearchId("");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  // Accounts
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/accounts");
      setAccounts(res.data || []);
      setView("accounts");
      showAlert("success", "Accounts loaded successfully");
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const searchAccountByUserId = async (idOverride) => {
    const raw = idOverride ?? searchId;
    const id = resolveId(raw);
    if (!id) {
      showAlert("danger", "Enter a user ID for account search");
      return;
    }
    setLoading(true);
    try {
      const res = await API.get(`/admin/accounts/${id}`);
      const account = res.data;
      setAccounts([account]);
      setView("accounts");
      showAlert("success", "Account found");
    } catch (err) {
      console.error(err);
      showAlert("danger", "Account not found for that user ID");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async (id) => {
    const resolved = resolveId(id);
    if (!resolved) return;
    if (!window.confirm(`Delete bank account with ID ${resolved}? This is irreversible.`)) return;
    setLoading(true);
    try {
      await API.delete(`/admin/accounts/${resolved}`);
      showAlert("success", "Bank account deleted successfully");
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockAccount = async (userId) => {
    const resolvedUserId = resolveId(userId);
    if (!resolvedUserId) return;
    setLoading(true);
    try {
      const res = await API.patch(`/admin/block/${resolvedUserId}`);
      showAlert("success", res.data || "Toggled block state");
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to toggle block state");
    } finally {
      setLoading(false);
    }
  };

  // Loans (admin)
  const fetchPendingLoans = async () => {
    setLoanLoading(true);
    try {
      const res = await API.get("/loan/pending");
      setLoans(res.data || []);
      setView("loans");
      showAlert("success", "Pending loans loaded successfully");
    } catch (err) {
      console.error(err);
      showAlert("danger", "Failed to load pending loans");
    } finally {
      setLoanLoading(false);
    }
  };

  const approveLoan = async (loanId) => {
    if (!window.confirm(`Approve loan #${loanId}? This will credit the user's account.`)) return;
    setLoanLoading(true);
    try {
      await API.post(`/loan/approve/${loanId}`);
      showPopup("success", `Loan #${loanId} approved successfully!`);
      await fetchPendingLoans();
    } catch (err) {
      console.error(err);
      showPopup("danger", `Failed to approve loan #${loanId}`);
    } finally {
      setLoanLoading(false);
    }
  };

  // Derived lists & pagination
  const filteredUsers = useMemo(() => {
    if (!userQuery) return users;
    const q = userQuery.toLowerCase();
    return users.filter((u) =>
      Object.entries(u).some(([k, v]) => k !== "password" && scalarize(v).toLowerCase().includes(q))
    );
  }, [users, userQuery]);

  const pagedUsers = useMemo(() => {
    const start = (userPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, userPage]);

  const filteredTrans = useMemo(() => {
    if (!transQuery) return transactions;
    const q = transQuery.toLowerCase();
    return transactions.filter((t) =>
      Object.entries(t).some(([k, v]) => k !== "password" && scalarize(v).toLowerCase().includes(q))
    );
  }, [transactions, transQuery]);

  const pagedTrans = useMemo(() => {
    const start = (transPage - 1) * PAGE_SIZE;
    return filteredTrans.slice(start, start + PAGE_SIZE);
  }, [filteredTrans, transPage]);

  const filteredAccounts = useMemo(() => {
    if (!accQuery) return accounts;
    const q = accQuery.toLowerCase();
    return accounts.filter((a) =>
      Object.entries(a).some(([k, v]) => scalarize(v).toLowerCase().includes(q))
    );
  }, [accounts, accQuery]);

  const pagedAccounts = useMemo(() => {
    const start = (accPage - 1) * PAGE_SIZE;
    return filteredAccounts.slice(start, start + PAGE_SIZE);
  }, [filteredAccounts, accPage]);

  // Render helpers
  const renderTableHeader = (obj, extra) => {
    if (!obj) return null;
    return (
      <tr>
        {Object.keys(obj)
          .filter((k) => k !== "password")
          .map((k) => (
            <th key={k} className="text-capitalize">
              {k.replace(/_/g, " ")}
            </th>
          ))}
        {extra && <th>Actions</th>}
      </tr>
    );
  };

  const renderTransactionRow = (t, i) => {
    const fraud = isFraudFlag(t);
    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
        className={fraud ? "fraud-row" : "row-regular"}
      >
        {Object.entries(t)
          .filter(([k]) => k !== "password")
          .map(([k, v]) => {
            if (k === "is_fraud" || k === "isFraud") {
              return (
                <td key={k}>
                  {fraud ? (
                    <span className="badge-fraud">
                      <AlertTriangle size={14} />
                      Fraud
                    </span>
                  ) : (
                    <span className="badge-safe">
                      <CheckCircle size={14} />
                      Safe
                    </span>
                  )}
                </td>
              );
            }
            const display = scalarize(v);
            return <td key={k}>{display}</td>;
          })}
      </motion.tr>
    );
  };

  const renderUserRow = (u, i) => {
    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
        className="row-regular"
      >
        {Object.entries(u)
          .filter(([k]) => k !== "password")
          .map(([k, v]) => {
            if (k === "balance") {
              return (
                <td key={k}>
                  <strong style={{ color: "#e63946" }}>₹ {Number(v ?? 0).toLocaleString()}</strong>
                </td>
              );
            }
            return <td key={k}>{maskValue(k, v)}</td>;
          })}
        <td>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary-lg"
              onClick={() => searchUser(u.id ?? u.userId ?? u.user_id ?? u)}
              title="Edit user"
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              <Edit size={14} style={{ marginRight: 4 }} />
              Edit
            </button>
            <button
              className="btn-ghost"
              onClick={() => deleteUser(u.id ?? u.userId ?? u.user_id ?? u)}
              title="Delete user"
              style={{
                borderColor: "rgba(255,90,90,0.3)",
                color: "#ff5a5a",
                padding: "6px 12px",
                fontSize: "13px",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </motion.tr>
    );
  };

  const renderAccountRow = (a, i) => {
    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
        className="row-regular"
      >
        {Object.entries(a)
          .filter(([k]) => k !== "password")
          .map(([k, v]) => {
            if (k === "blocked" || k === "isBlocked") {
              return (
                <td key={k}>
                  {v ? (
                    <span className="badge-fraud">
                      <XCircle size={14} />
                      Blocked
                    </span>
                  ) : (
                    <span className="badge-safe">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  )}
                </td>
              );
            }
            return <td key={k}>{scalarize(v)}</td>;
          })}
        <td>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-classic"
              onClick={() => toggleBlockAccount(a.userId ?? a.id ?? a.user_id)}
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              <Shield size={14} style={{ marginRight: 4 }} />
              Toggle Block
            </button>
            <button
              className="btn-ghost"
              onClick={() => deleteAccount(a.id ?? a.accountId ?? a.userId)}
              style={{
                borderColor: "rgba(255,90,90,0.3)",
                color: "#ff5a5a",
                padding: "6px 12px",
                fontSize: "13px",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </motion.tr>
    );
  };

  const renderLoanRow = (loan, i) => {
    const loanId = loan.id ?? loan.loanId ?? i;
    const approved = loan.approved === true || loan.approved === "true";
    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.02 }}
        className={approved ? "row-approved" : "row-regular"}
      >
        <td>{loan.id ?? "-"}</td>
        <td>{loan.username ?? "—"}</td>
        <td>
          <strong style={{ color: "#e63946" }}>₹ {Number(loan.amount ?? 0).toLocaleString()}</strong>
        </td>
        <td>
          {approved ? (
            <span className="badge-safe">
              <CheckCircle size={14} />
              Approved
            </span>
          ) : (
            <span className="badge-fraud">
              <AlertTriangle size={14} />
              Pending
            </span>
          )}
        </td>
        <td>
          <div style={{ display: "flex", gap: 8 }}>
            {!approved && (
              <button
                className="btn-primary-lg"
                onClick={() => approveLoan(loanId)}
                style={{ padding: "6px 12px", fontSize: "13px" }}
              >
                <CheckCircle size={14} style={{ marginRight: 4 }} />
                Approve
              </button>
            )}
            <button
              className="btn-ghost"
              onClick={() => {
                if (loan.username) searchUser(loan.username);
                else showAlert("info", "No username available for details");
              }}
              style={{ padding: "6px 12px", fontSize: "13px" }}
            >
              <UserCog size={14} style={{ marginRight: 4 }} />
              View User
            </button>
          </div>
        </td>
      </motion.tr>
    );
  };

  // handlers for edit form updates
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  // reset pages when queries change
  useEffect(() => {
    setUserPage(1);
    setTransPage(1);
    setAccPage(1);
  }, [userQuery, transQuery, accQuery]);

  return (
    <div className="admin-root">
      {/* Header */}
      <motion.header
        className="admin-header"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #e63946, #ff6b81)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 900,
              fontSize: 20,
              boxShadow: "0 4px 12px rgba(230, 57, 70, 0.3)",
            }}
          >
            <Shield size={24} />
          </div>
          <div>
            <div className="brand-title">Subby Bank Admin Console</div>
            <div className="brand-sub">Operations & Fraud Monitoring Dashboard</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <motion.button
            className="btn-classic"
            onClick={fetchTransactions}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CreditCard size={16} style={{ marginRight: 6 }} />
            Transactions
          </motion.button>
          <motion.button
            className="btn-ghost"
            onClick={fetchUsers}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Users size={16} style={{ marginRight: 6 }} />
            Users
          </motion.button>
          <motion.button
            className="btn-ghost"
            onClick={fetchAccounts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Wallet size={16} style={{ marginRight: 6 }} />
            Accounts
          </motion.button>
          <motion.button
            className="btn-ghost"
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ borderColor: "rgba(255,90,90,0.3)", color: "#ff5a5a" }}
          >
            <LogOut size={16} style={{ marginRight: 6 }} />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <div className="admin-body">
        {/* Sidebar */}
        <motion.aside
          className="admin-sidebar admin-card"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
            <div className="avatar">
              <Shield size={28} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Administrator</div>
              <div className="small-muted">Full System Access</div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ marginBottom: 20 }}>
            <div className="small-muted" style={{ marginBottom: 12, fontWeight: 600 }}>
              Navigation
            </div>
            <button
              className={`nav-btn ${view === "home" ? "active" : ""}`}
              onClick={() => setView("home")}
            >
              <Home size={16} style={{ marginRight: 8, display: "inline" }} />
              Dashboard Home
            </button>
            <button
              className={`nav-btn ${view === "transactions" ? "active" : ""}`}
              onClick={fetchTransactions}
            >
              <CreditCard size={16} style={{ marginRight: 8, display: "inline" }} />
              Transactions
            </button>
            <button
              className={`nav-btn ${view === "loans" ? "active" : ""}`}
              onClick={fetchPendingLoans}
            >
              <DollarSign size={16} style={{ marginRight: 8, display: "inline" }} />
              Loan Applications
            </button>
            <button
              className={`nav-btn ${view === "admin-repayments" ? "active" : ""}`}
              onClick={() => setView("admin-repayments")}
            >
              <FileText size={16} style={{ marginRight: 8, display: "inline" }} />
              View Repayments
            </button>
            <button
              className={`nav-btn ${view === "users" ? "active" : ""}`}
              onClick={fetchUsers}
            >
              <Users size={16} style={{ marginRight: 8, display: "inline" }} />
              All Users
            </button>
            <button
              className={`nav-btn ${view === "accounts" ? "active" : ""}`}
              onClick={fetchAccounts}
            >
              <Wallet size={16} style={{ marginRight: 8, display: "inline" }} />
              Bank Accounts
            </button>
            <button
              className={`nav-btn ${view === "editUser" ? "active" : ""}`}
              onClick={() => setView("editUser")}
            >
              <UserCog size={16} style={{ marginRight: 8, display: "inline" }} />
              Edit User
            </button>
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: 20 }}>
            <div className="small-muted" style={{ marginBottom: 12, fontWeight: 600 }}>
              Quick Actions
            </div>
            <button
              className="btn-primary-lg"
              onClick={fetchTransactions}
              disabled={loading}
              style={{ width: "100%", marginBottom: 10 }}
            >
              <Activity size={16} style={{ marginRight: 8 }} />
              Check All Transactions
            </button>
            <button
              className="btn-ghost"
              onClick={fetchUsers}
              disabled={loading}
              style={{ width: "100%" }}
            >
              <Users size={16} style={{ marginRight: 8 }} />
              View All Users
            </button>
          </div>

          {/* Search */}
          <div>
            <div className="small-muted" style={{ marginBottom: 8, fontWeight: 600 }}>
              Search User by ID
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="form-control"
                placeholder="User ID"
                value={searchId}
                onChange={(e) => setSearchId(String(e.target.value))}
                type="text"
                style={{ flex: 1 }}
              />
              <button className="btn-classic" onClick={() => searchUser()}>
                <Search size={16} />
              </button>
            </div>
            <button
              className="btn-ghost"
              onClick={() => searchAccountByUserId()}
              style={{ width: "100%", fontSize: 13 }}
            >
              Find Account by User ID
            </button>
          </div>

          {/* Tip */}
          <div
            style={{
              marginTop: 20,
              padding: 12,
              background: "rgba(230, 57, 70, 0.08)",
              borderRadius: 10,
              border: "1px solid rgba(230, 57, 70, 0.15)",
            }}
          >
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
              <AlertTriangle size={14} style={{ marginRight: 6, display: "inline" }} />
              <strong>Tip:</strong> Fraudulent transactions are highlighted in red for quick
              identification.
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="content">
          {/* Global Alert */}
          <AnimatePresence>
            {alert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`alert alert-${alert.type === "success" ? "success" : "danger"}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 600,
                }}
              >
                {alert.type === "success" ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
                {alert.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="admin-card"
              style={{ textAlign: "center", padding: 40 }}
            >
              <RefreshCw size={32} className="spin" style={{ color: "#e63946", marginBottom: 12 }} />
              <div className="small-muted">Loading data...</div>
            </motion.div>
          )}

          {/* HOME VIEW */}
          {!loading && view === "home" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Stats Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <motion.div
                  className="admin-card"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "linear-gradient(135deg, #fff5f5, #ffe5e5)",
                    borderColor: "rgba(230, 57, 70, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="small-muted" style={{ marginBottom: 8 }}>
                        Total Users
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#e63946" }}>
                        {stats.totalUsers}
                      </div>
                    </div>
                    <Users size={48} style={{ color: "#e63946", opacity: 0.2 }} />
                  </div>
                </motion.div>

                <motion.div
                  className="admin-card"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "linear-gradient(135deg, #fff5f5, #ffe5e5)",
                    borderColor: "rgba(230, 57, 70, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="small-muted" style={{ marginBottom: 8 }}>
                        Transactions
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#e63946" }}>
                        {stats.totalTransactions}
                      </div>
                    </div>
                    <CreditCard size={48} style={{ color: "#e63946", opacity: 0.2 }} />
                  </div>
                </motion.div>

                <motion.div
                  className="admin-card"
                  whileHover={{ scale: 1.02 }}
                  style={{
                    background: "linear-gradient(135deg, #fff5f5, #ffe5e5)",
                    borderColor: "rgba(230, 57, 70, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="small-muted" style={{ marginBottom: 8 }}>
                        Fraud Detected
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#dc2626" }}>
                        {stats.fraudCount}
                      </div>
                    </div>
                    <AlertTriangle size={48} style={{ color: "#dc2626", opacity: 0.2 }} />
                  </div>
                </motion.div>

               
              </div>

              {/* Welcome Card */}
              <motion.div
                className="admin-card data-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  minHeight: 500,
                  padding: "60px 50px",
                  background: "radial-gradient(circle at top left, #fff6f6, #ffffff 40%, #ffe5e5)",
                }}
              >
                {/* Floating Icons */}
                {[
                  { Icon: Shield, top: 50, right: 70, size: 110 },
                  { Icon: Users, bottom: 60, left: 50, size: 130 },
                  { Icon: Activity, top: 180, left: 260, size: 90 },
                  { Icon: Wallet, bottom: 100, right: 140, size: 100 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 3, 0],
                    }}
                    transition={{
                      duration: 6 + i * 1.5,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }}
                    style={{
                      position: "absolute",
                      top: item.top,
                      right: item.right,
                      bottom: item.bottom,
                      left: item.left,
                      opacity: 0.05,
                      zIndex: 0,
                    }}
                  >
                    <item.Icon size={item.size} color="#e63946" />
                  </motion.div>
                ))}

                {/* Content */}
                <div style={{ position: "relative", zIndex: 2 }}>
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 900,
                      color: "#b30000",
                      marginBottom: 16,
                      textShadow: "0 2px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    Welcome Back, Admin 👋
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    style={{
                      fontSize: "1.15rem",
                      color: "#333",
                      maxWidth: 720,
                      lineHeight: 1.8,
                      marginBottom: 50,
                    }}
                  >
                    Oversee all user operations, transactions, and security activities in one intuitive
                    panel. Maintain compliance, detect fraud, and ensure the platform's stability with
                    ease.
                  </motion.p>

                  {/* Fraud Watch */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: "rgba(255, 255, 255, 0.8)",
                      backdropFilter: "blur(10px)",
                      padding: "35px 30px",
                      borderRadius: 16,
                      border: "1px solid rgba(230, 57, 70, 0.15)",
                      boxShadow: "0 10px 30px rgba(230, 57, 70, 0.08)",
                      maxWidth: 850,
                      marginBottom: 40,
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: 16,
                        color: "#c00000",
                        fontWeight: 700,
                        fontSize: "1.3rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Shield size={24} />
                      Fraud Watch Spotlight
                    </h3>
                    <ul
                      style={{
                        paddingLeft: 24,
                        color: "#333",
                        fontSize: 15,
                        lineHeight: 1.9,
                      }}
                    >
                      <li>Real-time flagging for suspicious transactions</li>
                      <li>AI-based anomaly detection for repayment behavior</li>
                      <li>Audit exports for high-risk user activity</li>
                      <li>System alerts integrated with admin notifications</li>
                    </ul>
                  </motion.div>

                  {/* Pro Tips */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    style={{
                      background: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)",
                      padding: 30,
                      borderRadius: 16,
                      border: "1px solid rgba(230, 57, 70, 0.1)",
                      maxWidth: 700,
                      boxShadow: "0 5px 25px rgba(0,0,0,0.05)",
                    }}
                  >
                    <h4
                      style={{
                        marginBottom: 12,
                        color: "#b30000",
                        fontWeight: 700,
                        fontSize: "1.15rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Activity size={20} />
                      Pro Tips
                    </h4>
                    <ul
                      style={{
                        paddingLeft: 22,
                        fontSize: 14.5,
                        color: "#555",
                        lineHeight: 1.7,
                      }}
                    >
                      <li>Use filters to isolate patterns by user or amount range</li>
                      <li>Schedule periodic exports for audit readiness</li>
                      <li>Focus on flagged repayments each Friday</li>
                      <li>Stay updated — predictive fraud detection coming soon</li>
                    </ul>
                  </motion.div>

                  {/* Footer Quote */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 1 }}
                    style={{
                      marginTop: 70,
                      textAlign: "center",
                      color: "#777",
                      fontSize: 14,
                      fontStyle: "italic",
                    }}
                  >
                    "Precision. Vigilance. Integrity." — Empowering secure digital finance.
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* TRANSACTIONS VIEW */}
          {!loading && view === "transactions" && (
            <motion.div
              className="admin-card data-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ maxWidth: 1400 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#e63946" }}>
                    All Transactions
                  </h5>
                  <div className="small-muted">{filteredTrans.length} total records</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                      }}
                    />
                    <input
                      className="form-control"
                      placeholder="Filter transactions..."
                      value={transQuery}
                      onChange={(e) => setTransQuery(e.target.value)}
                      style={{ paddingLeft: 35, width: 220 }}
                    />
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setTransQuery("");
                      setTransPage(1);
                    }}
                  >
                    <XCircle size={16} style={{ marginRight: 4 }} />
                    Clear
                  </button>
                  <button className="btn-classic" onClick={exportTransactionsCSV}>
                    <Download size={16} style={{ marginRight: 4 }} />
                    Export CSV
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                {transactions.length === 0 ? (
                  <div
                    className="small-muted"
                    style={{ textAlign: "center", padding: 40, fontSize: 16 }}
                  >
                    <CreditCard size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div>No transactions found</div>
                  </div>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>{renderTableHeader(transactions[0])}</thead>
                      <tbody>{pagedTrans.map((t, i) => renderTransactionRow(t, i))}</tbody>
                    </table>
                    <div className="table-footer">
                      <div className="small-muted">
                        Showing {(transPage - 1) * PAGE_SIZE + 1} -{" "}
                        {Math.min(transPage * PAGE_SIZE, filteredTrans.length)} of{" "}
                        {filteredTrans.length}
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="btn-pager"
                          onClick={() => setTransPage((p) => Math.max(1, p - 1))}
                          disabled={transPage === 1}
                        >
                          Previous
                        </button>
                        <div className="small-muted">Page {transPage}</div>
                        <button
                          className="btn-pager"
                          onClick={() =>
                            setTransPage((p) => (p * PAGE_SIZE < filteredTrans.length ? p + 1 : p))
                          }
                          disabled={transPage * PAGE_SIZE >= filteredTrans.length}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* LOANS VIEW */}
          {!loading && view === "loans" && (
            <motion.div
              className="admin-card data-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ position: "relative" }}
            >
              {/* Popup */}
              <AnimatePresence>
                {popup && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    style={{
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background:
                        popup.type === "success"
                          ? "linear-gradient(135deg, #4caf50, #66bb6a)"
                          : "linear-gradient(135deg, #e53935, #ef5350)",
                      color: "#fff",
                      padding: "24px 48px",
                      borderRadius: 16,
                      fontWeight: 600,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.3)",
                      textAlign: "center",
                      zIndex: 9999,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {popup.type === "success" ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                    {popup.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#e63946" }}>
                    Loan Applications
                  </h5>
                  <div className="small-muted">{loans.length} pending applications</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                      }}
                    />
                    <input
                      className="form-control"
                      placeholder="Filter loans..."
                      value={loanQuery}
                      onChange={(e) => {
                        setLoanQuery(e.target.value);
                        setLoanPage(1);
                      }}
                      style={{ paddingLeft: 35, width: 200 }}
                    />
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setLoanQuery("");
                      setLoanPage(1);
                    }}
                  >
                    <XCircle size={16} style={{ marginRight: 4 }} />
                    Clear
                  </button>
                  <button className="btn-classic" onClick={fetchPendingLoans}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                {loans.length === 0 ? (
                  <div
                    className="small-muted"
                    style={{ textAlign: "center", padding: 40, fontSize: 16 }}
                  >
                    <DollarSign size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div>No pending loan applications</div>
                  </div>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loans
                          .filter((l) => {
                            if (!loanQuery) return true;
                            const q = loanQuery.toLowerCase();
                            return (
                              String(l.id).includes(q) ||
                              String(l.username ?? "").toLowerCase().includes(q) ||
                              String(l.amount ?? "").includes(q)
                            );
                          })
                          .slice((loanPage - 1) * PAGE_SIZE, loanPage * PAGE_SIZE)
                          .map(renderLoanRow)}
                      </tbody>
                    </table>
                    <div className="table-footer">
                      <div className="small-muted">
                        Showing {(loanPage - 1) * PAGE_SIZE + 1} -{" "}
                        {Math.min(loanPage * PAGE_SIZE, loans.length)} of {loans.length}
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="btn-pager"
                          onClick={() => setLoanPage((p) => Math.max(1, p - 1))}
                          disabled={loanPage === 1}
                        >
                          Previous
                        </button>
                        <div className="small-muted">Page {loanPage}</div>
                        <button
                          className="btn-pager"
                          onClick={() =>
                            setLoanPage((p) => (p * PAGE_SIZE < loans.length ? p + 1 : p))
                          }
                          disabled={loanPage * PAGE_SIZE >= loans.length}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* REPAYMENTS VIEW */}
          {!loading && view === "admin-repayments" && <AdminRepaymentTable />}

          {/* USERS VIEW */}
          {!loading && view === "users" && (
            <motion.div
              className="admin-card data-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#e63946" }}>
                    All Users
                  </h5>
                  <div className="small-muted">{filteredUsers.length} total users</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                      }}
                    />
                    <input
                      className="form-control"
                      placeholder="Search users..."
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      style={{ paddingLeft: 35, width: 220 }}
                    />
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setUserQuery("");
                      setUserPage(1);
                    }}
                  >
                    <XCircle size={16} style={{ marginRight: 4 }} />
                    Clear
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                {users.length === 0 ? (
                  <div
                    className="small-muted"
                    style={{ textAlign: "center", padding: 40, fontSize: 16 }}
                  >
                    <Users size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div>No users found</div>
                  </div>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>{renderTableHeader(users[0], true)}</thead>
                      <tbody>{pagedUsers.map((u, i) => renderUserRow(u, i))}</tbody>
                    </table>
                    <div className="table-footer">
                      <div className="small-muted">
                        Showing {(userPage - 1) * PAGE_SIZE + 1} -{" "}
                        {Math.min(userPage * PAGE_SIZE, filteredUsers.length)} of{" "}
                        {filteredUsers.length}
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="btn-pager"
                          onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                          disabled={userPage === 1}
                        >
                          Previous
                        </button>
                        <div className="small-muted">Page {userPage}</div>
                        <button
                          className="btn-pager"
                          onClick={() =>
                            setUserPage((p) => (p * PAGE_SIZE < filteredUsers.length ? p + 1 : p))
                          }
                          disabled={userPage * PAGE_SIZE >= filteredUsers.length}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ACCOUNTS VIEW */}
          {!loading && view === "accounts" && (
            <motion.div
              className="admin-card data-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#e63946" }}>
                    Bank Accounts
                  </h5>
                  <div className="small-muted">{filteredAccounts.length} total accounts</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ position: "relative" }}>
                    <Search
                      size={16}
                      style={{
                        position: "absolute",
                        left: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#999",
                      }}
                    />
                    <input
                      className="form-control"
                      placeholder="Filter accounts..."
                      value={accQuery}
                      onChange={(e) => setAccQuery(e.target.value)}
                      style={{ paddingLeft: 35, width: 220 }}
                    />
                  </div>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      setAccQuery("");
                      setAccPage(1);
                    }}
                  >
                    <XCircle size={16} style={{ marginRight: 4 }} />
                    Clear
                  </button>
                  <button className="btn-classic" onClick={fetchAccounts}>
                    <RefreshCw size={16} style={{ marginRight: 4 }} />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                {accounts.length === 0 ? (
                  <div
                    className="small-muted"
                    style={{ textAlign: "center", padding: 40, fontSize: 16 }}
                  >
                    <Wallet size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                    <div>No accounts found</div>
                  </div>
                ) : (
                  <>
                    <table className="admin-table">
                      <thead>{renderTableHeader(accounts[0], true)}</thead>
                      <tbody>{pagedAccounts.map((a, i) => renderAccountRow(a, i))}</tbody>
                    </table>
                    <div className="table-footer">
                      <div className="small-muted">
                        Showing {(accPage - 1) * PAGE_SIZE + 1} -{" "}
                        {Math.min(accPage * PAGE_SIZE, filteredAccounts.length)} of{" "}
                        {filteredAccounts.length}
                      </div>
                      <div className="pagination-controls">
                        <button
                          className="btn-pager"
                          onClick={() => setAccPage((p) => Math.max(1, p - 1))}
                          disabled={accPage === 1}
                        >
                          Previous
                        </button>
                        <div className="small-muted">Page {accPage}</div>
                        <button
                          className="btn-pager"
                          onClick={() =>
                            setAccPage((p) => (p * PAGE_SIZE < filteredAccounts.length ? p + 1 : p))
                          }
                          disabled={accPage * PAGE_SIZE >= filteredAccounts.length}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* EDIT USER VIEW */}
          {!loading && view === "editUser" && (
            <motion.div
              className="admin-card data-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h5 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#e63946" }}>
                    Edit User
                  </h5>
                  <div className="small-muted">Load a user and update details or balance</div>
                </div>
                {editForm && (
                  <div className="small-muted" style={{ fontWeight: 600 }}>
                    User ID: {scalarize(editForm?.id ?? editForm?.userId ?? editForm?.user_id ?? "") || "—"}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20, display: "flex", gap: 8 }}>
                <div style={{ position: "relative", flex: 1 }}>
                  <Search
                    size={16}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#999",
                    }}
                  />
                  <input
                    className="form-control"
                    placeholder="Enter user ID and click Search"
                    value={searchId}
                    onChange={(e) => setSearchId(String(e.target.value))}
                    type="text"
                    style={{ paddingLeft: 35 }}
                  />
                </div>
                <button className="btn-classic" onClick={() => searchUser()}>
                  <Search size={16} style={{ marginRight: 6 }} />
                  Search
                </button>
              </div>

              {!editForm && (
                <div
                  className="small-muted"
                  style={{ textAlign: "center", padding: 40, fontSize: 16 }}
                >
                  <UserCog size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
                  <div>Search for a user to edit details and balance</div>
                </div>
              )}

              {editForm && (
                <>
                  <div style={{ overflow: "auto", borderRadius: 12, marginBottom: 20 }}>
                    <table className="admin-table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th style={{ width: 220 }}>Field</th>
                          <th>Value (editable)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th className="small-muted">ID</th>
                          <td>
                            {scalarize(
                              editForm.id ?? editForm.userId ?? editForm.user_id ?? editForm.accountId
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th className="small-muted">Username</th>
                          <td>
                            <input
                              name="username"
                              value={editForm.username ?? ""}
                              onChange={handleEditChange}
                              className="form-control"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="small-muted">Email</th>
                          <td>
                            <input
                              name="email"
                              type="email"
                              value={editForm.email ?? ""}
                              onChange={handleEditChange}
                              className="form-control"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="small-muted">Mobile</th>
                          <td>
                            <input
                              name="mobile"
                              value={editForm.mobile ?? ""}
                              onChange={handleEditChange}
                              className="form-control"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="small-muted">Role</th>
                          <td>
                            <input
                              name="role"
                              value={editForm.role ?? ""}
                              onChange={handleEditChange}
                              className="form-control"
                            />
                          </td>
                        </tr>
                        <tr>
                          <th className="small-muted">Balance (INR)</th>
                          <td>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input
                                name="balance"
                                value={editForm.balance ?? ""}
                                onChange={handleEditChange}
                                className="form-control"
                                type="number"
                                step="0.01"
                                style={{ flex: 1 }}
                              />
                              <button className="btn-classic" onClick={saveBalance}>
                                <DollarSign size={14} style={{ marginRight: 4 }} />
                                Save Balance
                              </button>
                              <button
                                className="btn-ghost"
                                onClick={async () => {
                                  if (editForm?.id) {
                                    setLoading(true);
                                    try {
                                      await searchUser(editForm.id);
                                      showAlert("success", "Balance refreshed");
                                    } catch {
                                      showAlert("danger", "Failed to refresh balance");
                                    } finally {
                                      setLoading(false);
                                    }
                                  }
                                }}
                              >
                                <RefreshCw size={14} />
                              </button>
                            </div>
                            <div className="small-muted" style={{ marginTop: 6 }}>
                              Balance updated via the balance endpoint
                            </div>
                          </td>
                        </tr>
                        {Object.entries(editForm)
                          .filter(
                            ([k]) =>
                              !["id", "username", "email", "mobile", "role", "balance", "password"].includes(
                                k
                              )
                          )
                          .map(([k, v]) => (
                            <tr key={k}>
                              <th className="small-muted text-capitalize">{k.replace(/_/g, " ")}</th>
                              <td>{scalarize(v)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button className="btn-classic" onClick={saveUserDetails}>
                      <CheckCircle size={16} style={{ marginRight: 6 }} />
                      Save Details
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        setEditForm(null);
                        setSearchId("");
                      }}
                    >
                      <XCircle size={16} style={{ marginRight: 6 }} />
                      Cancel
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => {
                        if (editForm?.id) deleteUser(editForm.id);
                      }}
                      style={{ borderColor: "rgba(255,90,90,0.3)", color: "#ff5a5a" }}
                    >
                      <Trash2 size={16} style={{ marginRight: 6 }} />
                      Delete User
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </main>
      </div>

      {/* Add spinning animation for loading icon */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}