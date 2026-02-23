import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getResources, getWorkshops } from "../services/api";

function AdminResources() {
  const [resources, setResources] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    getResources().then(setResources);
    getWorkshops().then(setWorkshops);
  }, []);

  const getWorkshopTitle = (id) => workshops.find(w => w.id === id)?.title || "Unknown";

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>View Resources</h2>
        <p style={styles.subtitle}>All uploaded training resources</p>
        
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Resource Title</th>
                <th style={styles.th}>Workshop</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>URL</th>
              </tr>
            </thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id} style={styles.tr}>
                  <td style={styles.td}>{r.title}</td>
                  <td style={styles.td}>{getWorkshopTitle(r.workshopId)}</td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{r.type}</span>
                  </td>
                  <td style={styles.td}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      View Link
                    </a>
                  </td>
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
  container: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0 0 6px 0" },
  subtitle: { color: "#666", fontSize: "18px", marginBottom: "24px" },
  tableCard: { background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "16px", textAlign: "left", background: "#1976d2", color: "white", fontSize: "16px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "16px", fontSize: "16px", color: "#333" },
  typeBadge: { background: "#e3f2fd", color: "#1976d2", padding: "5px 12px", borderRadius: "10px", fontSize: "14px", fontWeight: "600" },
  link: { color: "#1976d2", textDecoration: "none", fontWeight: "600", fontSize: "16px" }
};

export default AdminResources;
