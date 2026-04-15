import { useState, useEffect } from "react";
import "./Suggestions.css";
import { useNavigate } from "react-router-dom";
import { getAdminToken } from "../utils/adminAuth";

export default function Suggestions() {
  const [expandedId, setExpandedId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const token = getAdminToken();
      const res = await fetch("http://localhost:8000/api/admin/suggestions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Failed to load suggestions from backend");
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const updateStatus = async (e, id, status) => {
    e.stopPropagation();
    let reason = null;
    if (status === "rejected") {
      reason = prompt("Please enter a reason for rejecting this suggestion:");
      if (reason === null) return; // User cancelled
    }
    
    try {
      const token = getAdminToken();
      const res = await fetch(`http://localhost:8000/api/admin/suggestions/${id}/status`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status, reason })
      });
      if (!res.ok) throw new Error("Update failed");
      
      // Update local state without reloading
      setSuggestions(prev => 
        prev.map(s => s.id === id ? { ...s, status } : s)
      );
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  return (
    <div className="container">

      {/* Header */}
      <div className="header" style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1>💡 User Suggestions</h1>

        {/* ✅ Navigate Button */}
        <button
          className="button button-ghost"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Loading & Errors */}
      {loading && <p style={{ textAlign: "center" }}>Loading suggestions...</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && suggestions.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>No suggestions found.</p>
      )}

      {/* Cards */}
      <div className="card-container">
        {suggestions.map((user) => (
          <div
            key={user.id}
            className={`card ${expandedId === user.id ? "expanded" : ""}`}
            onClick={() => handleClick(user.id)}
            style={{
              borderLeft: user.status === "approved" ? "4px solid #4CAF50" : user.status === "rejected" ? "4px solid #F44336" : ""
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3>{user.name}</h3>
              <span style={{
                fontSize: "0.8rem", 
                padding: "4px 8px", 
                borderRadius: "12px",
                background: user.status === 'pending' ? '#ff9800' : 'transparent',
                color: user.status === 'pending' ? 'white' : 'inherit'
              }}>
                {user.status.toUpperCase()}
              </span>
            </div>

            {/* Hover Details */}
            <div className="hover-content">
              <p>Email: {user.email}</p>
              <p>Suggestions: {user.suggestions.length}</p>
            </div>

            {/* Expanded Content */}
            {expandedId === user.id && (
              <div 
                className="expanded-content"
                onClick={(e) => e.stopPropagation()} 
              >
                <h4>Suggestions:</h4>
                <ul>
                  {user.suggestions.map((s, index) => (
                    <li key={index}>{s}</li>
                  ))}
                </ul>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button 
                    className="button button-primary"
                    style={{ background: "#4CAF50", borderColor: "#4CAF50" }}
                    onClick={(e) => updateStatus(e, user.id, "approved")}
                  >
                    Approve
                  </button>
                  <button 
                    className="button"
                    style={{ background: "#F44336", borderColor: "#F44336", color: "white" }}
                    onClick={(e) => updateStatus(e, user.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}