import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops, getRegistrations, deleteWorkshop } from "../services/api";

function AdminDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [w, r] = await Promise.all([getWorkshops(), getRegistrations()]);
    setWorkshops(w);
    setRegistrations(r);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This will remove all registrations and resources.`)) {
      try {
        await deleteWorkshop(id);
        alert("✓ Workshop deleted successfully");
        loadData();
      } catch (err) {
        alert("Failed to delete workshop");
      }
    }
  };

  const isPast = (date) => new Date(date) < new Date();

  const filteredWorkshops = workshops
    .filter(w => {
      const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || 
                         w.instructor.toLowerCase().includes(search.toLowerCase());
      if (filter === "upcoming") return matchSearch && !isPast(w.date);
      if (filter === "past") return matchSearch && isPast(w.date);
      if (filter === "full") return matchSearch && w.registered >= w.seats;
      return matchSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingCount = workshops.filter(w => !isPast(w.date)).length;
  const pastCount = workshops.filter(w => isPast(w.date)).length;

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Admin Dashboard</h2>
        <p style={styles.subtitle}>Manage your workshops and training platform</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Workshops</div>
                <div style={styles.statNumber}>{workshops.length}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Upcoming</div>
                <div style={styles.statNumber}>{upcomingCount}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Past</div>
                <div style={styles.statNumber}>{pastCount}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Total Registrations</div>
                <div style={styles.statNumber}>{registrations.length}</div>
              </div>
            </div>

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

            <div style={styles.section}>
              <div style={styles.headerRow}>
                <h3 style={styles.sectionTitle}>All Workshops</h3>
                <div style={styles.controls}>
                  <input
                    type="text"
                    placeholder="Search workshops..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
                    <option value="all">All Workshops</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                    <option value="full">Full</option>
                  </select>
                </div>
              </div>
              
              {filteredWorkshops.length === 0 ? (
                <div style={styles.empty}>No workshops found</div>
              ) : (
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
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkshops.map(w => (
                        <tr key={w.id} style={styles.tr}>
                          <td style={styles.td}>{w.title}</td>
                          <td style={styles.td}>{formatDate(w.date)}</td>
                          <td style={styles.td}>{w.time}</td>
                          <td style={styles.td}>{w.instructor}</td>
                          <td style={styles.td}>{w.registered}/{w.seats}</td>
                          <td style={styles.td}>
                            <span style={w.registered >= w.seats ? styles.statusFull : styles.statusAvailable}>
                              {w.registered >= w.seats ? "Full" : "Available"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <Link to={`/admin/edit-workshop/${w.id}`} style={styles.editBtn}>Edit</Link>
                            <button onClick={() => handleDelete(w.id, w.title)} style={styles.deleteBtn}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f5f5" },
  container: { padding: "32px", maxWidth: "1300px", margin: "0 auto" },
  title: { color: "#000", fontSize: "24px", fontWeight: "700", margin: "0" },
  subtitle: { color: "#000", fontSize: "16px", marginBottom: "28px", marginTop: "6px" },
  loading: { textAlign: "center", padding: "40px", fontSize: "16px", color: "#000" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" },
  statCard: { background: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderLeft: "4px solid #333" },
  statLabel: { fontSize: "15px", color: "#000", fontWeight: "500", marginBottom: "8px" },
  statNumber: { fontSize: "32px", fontWeight: "700", color: "#000" },
  section: { marginBottom: "32px" },
  sectionTitle: { color: "#000", fontSize: "18px", fontWeight: "600", marginBottom: "16px" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" },
  actionCard: { background: "white", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", textDecoration: "none", color: "inherit", border: "1px solid #e0e0e0", transition: "transform 0.2s", textAlign: "center" },
  actionTitle: { fontSize: "17px", fontWeight: "600", color: "#000", marginBottom: "6px", marginTop: "0" },
  actionDesc: { fontSize: "14px", color: "#000", margin: 0 },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
  controls: { display: "flex", gap: "12px", flexWrap: "wrap" },
  searchInput: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", width: "200px", color: "#000" },
  filterSelect: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", background: "white", cursor: "pointer", color: "#000" },
  empty: { background: "white", padding: "40px", textAlign: "center", borderRadius: "8px", color: "#000", fontSize: "15px" },
  tableWrapper: { background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px", textAlign: "left", background: "#333", color: "white", fontSize: "14px", fontWeight: "600" },
  tr: { borderBottom: "1px solid #f0f0f0" },
  td: { padding: "14px", fontSize: "14px", color: "#000" },
  statusAvailable: { padding: "5px 12px", background: "#f0f0f0", color: "#000", borderRadius: "10px", fontSize: "13px", fontWeight: "600" },
  statusFull: { padding: "5px 12px", background: "#333", color: "white", borderRadius: "10px", fontSize: "13px", fontWeight: "600" },
  editBtn: { padding: "6px 12px", background: "#333", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", marginRight: "8px", textDecoration: "none", display: "inline-block" },
  deleteBtn: { padding: "6px 12px", background: "#999", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }
};

export default AdminDashboard;
