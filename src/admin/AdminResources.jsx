import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getResources, getWorkshops, deleteResource } from "../services/api";

function AdminResources() {
  const [resources, setResources] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [r, w] = await Promise.all([getResources(), getWorkshops()]);
    setResources(r);
    setWorkshops(w);
    setLoading(false);
  };

  const getWorkshopTitle = (id) => workshops.find(w => w.id === id)?.title || "Unknown";

  const handleDownload = (resource) => {
    const content = `
╔════════════════════════════════════════════════════════════╗
║                    WORKSHOP RESOURCE                       ║
║                                                            ║
║  Title: ${resource.title}                                 
║  Workshop: ${getWorkshopTitle(resource.workshopId)}       
║  Type: ${resource.type}                                    
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Uploaded: ${new Date().toLocaleString()}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace('.pdf', '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"?`)) {
      try {
        await deleteResource(id);
        alert("Resource deleted successfully");
        loadData();
      } catch (err) {
        alert("Failed to delete resource");
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>View Resources</h2>
        <p style={styles.subtitle}>All uploaded training resources</p>
        
        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : resources.length === 0 ? (
          <div style={styles.empty}>No resources uploaded yet</div>
        ) : (
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Resource Title</th>
                  <th style={styles.th}>Workshop</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Actions</th>
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
                      <button onClick={() => handleDownload(r)} style={styles.downloadBtn}>
                        Download
                      </button>
                      <button onClick={() => handleDelete(r.id, r.title)} style={styles.deleteBtn}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f5f5" },
  container: { padding: "32px", maxWidth: "1100px", margin: "0 auto" },
  title: { color: "#000", fontSize: "24px", fontWeight: "700", margin: "0 0 6px 0" },
  subtitle: { color: "#000", fontSize: "16px", marginBottom: "24px" },
  loading: { textAlign: "center", padding: "40px", fontSize: "16px", color: "#000" },
  empty: { background: "white", padding: "40px", textAlign: "center", borderRadius: "8px", color: "#000", fontSize: "15px" },
  tableCard: { background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px", textAlign: "left", background: "#333", color: "white", fontSize: "14px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "14px", fontSize: "14px", color: "#000" },
  typeBadge: { background: "#f0f0f0", color: "#000", padding: "5px 12px", borderRadius: "10px", fontSize: "13px", fontWeight: "600" },
  downloadBtn: { padding: "6px 14px", background: "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px", marginRight: "8px" },
  deleteBtn: { padding: "6px 14px", background: "#999", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }
};

export default AdminResources;
