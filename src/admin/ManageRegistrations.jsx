import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getRegistrations, getWorkshops } from "../services/api";

function ManageRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    getRegistrations().then(setRegistrations);
    getWorkshops().then(setWorkshops);
  }, []);

  const getWorkshopTitle = (id) => workshops.find(w => w.id === id)?.title || "Unknown";

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Manage Registrations</h2>
        <p style={styles.subtitle}>Total: {registrations.length} registrations</p>
        
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Workshop</th>
                <th style={styles.th}>User Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{getWorkshopTitle(r.workshopId)}</td>
                  <td style={styles.td}>{r.userName}</td>
                  <td style={styles.tdEmail}>{r.email}</td>
                  <td style={styles.td}>{r.registeredAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0" },
  subtitle: { color: "#666", fontSize: "18px", marginBottom: "24px", marginTop: "6px" },
  tableCard: { background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left", background: "#1976d2", color: "white", fontSize: "16px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "16px", fontSize: "16px", color: "#333" },
  tdEmail: { padding: "16px", fontSize: "16px", color: "#1976d2", fontWeight: "500" }
};

export default ManageRegistrations;
