import React, { useState, useEffect } from "react";
import { getAdminToken } from "../utils/adminAuth";
import { useNavigate } from "react-router-dom";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null); // The raw service JSON string or object

  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/services");
      if (!res.ok) throw new Error("Failed to load services");
      const data = await res.json();
      setServices(data.services || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (service) => {
    // Stringify JSON to let admin cleanly edit entire structure without complex 50-input forms
    setEditingService(JSON.stringify(service, null, 2));
  };

  const handleSave = async () => {
    try {
      const token = getAdminToken();
      const parsedData = JSON.parse(editingService);

      const res = await fetch(`http://localhost:8000/api/admin/services`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(parsedData)
      });
      
      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.detail || "Update failed");
      
      alert("Service saved successfully!");
      setEditingService(null);
      fetchServices();
    } catch (err) {
      alert("Error saving service: " + err.message);
    }
  };

  return (
    <div className="container">
      <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>⚙️ Manage Services</h1>
        <button className="button button-ghost" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {loading && <p>Loading services...</p>}
      {error && <div className="alert alert-error">{error}</div>}

      {!editingService ? (
        <div className="card-container">
          {services.map((s) => (
            <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3>{s.icon} {s.title}</h3>
                <p>{s.subtitle}</p>
                <small>Fee: {s.fee} | Avg: {s.time}</small>
              </div>
              <button className="button button-primary" onClick={() => handleEditClick(s)}>
                Edit Content
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2>Editing Data Object</h2>
          <p className="auth-hint">Advanced Admin Panel Editor. Make sure keys match Database JSON schema.</p>
          <textarea 
            className="input"
            rows="20"
            style={{ fontFamily: 'monospace', height: 'auto', background: "#222", color: "#0f0" }}
            value={editingService}
            onChange={(e) => setEditingService(e.target.value)}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button className="button button-primary" onClick={handleSave}>
              Save to Database
            </button>
            <button className="button" style={{ background: "#ccc", color: "#000" }} onClick={() => setEditingService(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
