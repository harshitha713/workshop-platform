import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops, getRegistrations } from "../services/api";

function AdminDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    getWorkshops().then(setWorkshops);
    getRegistrations().then(setRegistrations);
  }, []);

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.subtitle}>Manage your workshops and training platform</p>

        {/* Statistics Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Workshops</div>
            <div style={styles.statNumber}>{workshops.length}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Registrations</div>
            <div style={styles.statNumber}>{registrations.length}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionGrid}>
            <Link to="/admin/add-workshop" style={styles.actionCard}>
              <h4 style={styles.actionTitle}>Add Workshop</h4>
              <p style={styles.actionDesc}>Create a new training session</p>
            </Link>
            <Link to="/admin/registrations" style={styles.actionCard}>
              <h4 style={styles.actionTitle}>View Registrations</h4>
              <p style={styles.actionDesc}>See all user registrations</p>
            </Link>
            <Link to="/admin/upload-resources" style={styles.actionCard}>
              <h4 style={styles.actionTitle}>Upload Resources</h4>
              <p style={styles.actionDesc}>Add training materials</p>
            </Link>
            <Link to="/admin/resources" style={styles.actionCard}>
              <h4 style={styles.actionTitle}>View Resources</h4>
              <p style={styles.actionDesc}>See uploaded resources</p>
            </Link>
          </div>
        </div>

        {/* Workshops List */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>All Workshops</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Instructor</th>
                  <th style={styles.th}>Seats</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {workshops.map(w => (
                  <tr key={w.id} style={styles.tr}>
                    <td style={styles.td}>{w.title}</td>
                    <td style={styles.td}>{w.date}</td>
                    <td style={styles.td}>{w.time}</td>
                    <td style={styles.td}>{w.instructor}</td>
                    <td style={styles.td}>{w.registered}/{w.seats}</td>
                    <td style={styles.td}>
                      <span style={w.registered >= w.seats ? styles.statusFull : styles.statusAvailable}>
                        {w.registered >= w.seats ? "Full" : "Available"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "1300px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0" },
  subtitle: { color: "#000", fontSize: "18px", marginBottom: "28px", marginTop: "6px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" },
  statCard: { background: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: "4px solid #1976d2" },
  statLabel: { fontSize: "17px", color: "#000", fontWeight: "500", marginBottom: "8px" },
  statNumber: { fontSize: "36px", fontWeight: "700", color: "#1976d2" },
  section: { marginBottom: "32px" },
  sectionTitle: { color: "#333", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" },
  actionCard: { background: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", border: "1px solid #e8eef5", transition: "transform 0.2s" },
  actionTitle: { fontSize: "18px", fontWeight: "600", color: "#333", marginBottom: "6px", marginTop: "0" },
  actionDesc: { fontSize: "16px", color: "#000", margin: 0 },
  tableWrapper: { background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left", background: "#1976d2", color: "white", fontSize: "16px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "16px", fontSize: "16px", color: "#333" },
  statusAvailable: { padding: "5px 12px", background: "#e8f5e9", color: "#4caf50", borderRadius: "10px", fontSize: "14px", fontWeight: "600" },
  statusFull: { padding: "5px 12px", background: "#ffebee", color: "#f44336", borderRadius: "10px", fontSize: "14px", fontWeight: "600" }
};

export default AdminDashboard;
