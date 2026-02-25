import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops, getRegistrations, getAttendance, registerForWorkshop, cancelRegistration } from "../services/api";

function UserDashboard() {
  const [workshops, setWorkshops] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({ userName: "", email: "" });

  const currentUser = "Current User";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [w, r, a] = await Promise.all([getWorkshops(), getRegistrations(), getAttendance()]);
    setWorkshops(w);
    setRegistrations(r);
    setAttendance(a);
    setLoading(false);
  };

  const myRegistrations = registrations.filter(r => r.userName === currentUser);
  const myAttendance = attendance.filter(a => a.userName === currentUser);
  const registeredIds = myRegistrations.map(r => r.workshopId);
  const attendedIds = myAttendance.map(a => a.workshopId);

  const myWorkshops = workshops.filter(w => registeredIds.includes(w.id));
  const attendedWorkshops = workshops.filter(w => attendedIds.includes(w.id));
  const availableWorkshops = workshops.filter(w => !registeredIds.includes(w.id));

  const handleRegisterClick = (workshop) => {
    if (workshop.registered >= workshop.seats) {
      alert("Workshop is full");
      return;
    }
    setSelectedWorkshop(workshop);
    setShowModal(true);
  };

  const handleConfirmRegister = async (e) => {
    e.preventDefault();
    try {
      await registerForWorkshop({ workshopId: selectedWorkshop.id, userName: formData.userName, email: formData.email });
      setShowModal(false);
      setFormData({ userName: "", email: "" });
      
      const notif = { workshopTitle: selectedWorkshop.title, time: new Date().toISOString() };
      const existing = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      existing.unshift(notif);
      localStorage.setItem('userNotifications', JSON.stringify(existing));
      
      alert(`✓ Successfully registered for "${selectedWorkshop.title}"!`);
      loadData();
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  const handleCancel = async (workshop) => {
    if (window.confirm(`Cancel registration for "${workshop.title}"?`)) {
      try {
        await cancelRegistration(workshop.id, currentUser);
        alert("✓ Registration cancelled successfully");
        loadData();
      } catch (err) {
        alert("Failed to cancel registration");
      }
    }
  };

  const isPast = (date) => new Date(date) < new Date();
  const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();

  const filteredAvailable = availableWorkshops
    .filter(w => {
      const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || 
                         w.instructor.toLowerCase().includes(search.toLowerCase());
      if (filter === "upcoming") return matchSearch && !isPast(w.date);
      if (filter === "available") return matchSearch && w.registered < w.seats;
      return matchSearch;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div style={styles.wrapper}>
      <Navbar role="user" />
      <div style={styles.container}>
        <h2 style={styles.title}>User Dashboard</h2>
        <p style={styles.subtitle}>Manage your learning journey</p>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <>
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Registered</div>
                <div style={styles.statNumber}>{myRegistrations.length}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Attended</div>
                <div style={styles.statNumber}>{myAttendance.length}</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statLabel}>Available</div>
                <div style={styles.statNumber}>{availableWorkshops.length}</div>
              </div>
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>My Registered Workshops</h3>
              {myWorkshops.length === 0 ? (
                <div style={styles.empty}>No registered workshops</div>
              ) : (
                <div style={styles.grid}>
                  {myWorkshops.map(w => (
                    <div key={w.id} style={styles.card}>
                      <span style={styles.badge}>Registered</span>
                      <h4 style={styles.cardTitle}>{w.title}</h4>
                      <p style={styles.meta}>Date: {formatDate(w.date)}</p>
                      <p style={styles.meta}>Time: {w.time}</p>
                      <p style={styles.meta}>Instructor: {w.instructor}</p>
                      {isToday(w.date) && w.meetingLink && (
                        <a href={w.meetingLink} target="_blank" rel="noopener noreferrer" style={styles.joinBtn}>
                          Join Session
                        </a>
                      )}
                      <div style={styles.btnRow}>
                        <Link to={`/user/workshop/${w.id}`} style={styles.detailsBtn}>Details</Link>
                        {!attendedIds.includes(w.id) && (
                          <button onClick={() => handleCancel(w)} style={styles.cancelBtn}>Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Attended Workshops</h3>
              {attendedWorkshops.length === 0 ? (
                <div style={styles.empty}>No attended workshops yet</div>
              ) : (
                <div style={styles.grid}>
                  {attendedWorkshops.map(w => (
                    <div key={w.id} style={styles.card}>
                      <span style={styles.badgeAttended}>Attended</span>
                      <h4 style={styles.cardTitle}>{w.title}</h4>
                      <p style={styles.meta}>Date: {formatDate(w.date)}</p>
                      <p style={styles.meta}>Instructor: {w.instructor}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.section}>
              <div style={styles.headerRow}>
                <h3 style={styles.sectionTitle}>Available Workshops</h3>
                <div style={styles.controls}>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                  />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} style={styles.filterSelect}>
                    <option value="all">All</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="available">Has Seats</option>
                  </select>
                </div>
              </div>
              {filteredAvailable.length === 0 ? (
                <div style={styles.empty}>No workshops found</div>
              ) : (
                <div style={styles.grid}>
                  {filteredAvailable.map(w => (
                    <div key={w.id} style={styles.card}>
                      <h4 style={styles.cardTitle}>{w.title}</h4>
                      <p style={styles.description}>{w.description}</p>
                      <p style={styles.meta}>Date: {formatDate(w.date)}</p>
                      <p style={styles.meta}>Time: {w.time}</p>
                      <p style={styles.meta}>Instructor: {w.instructor}</p>
                      <p style={styles.seats}>
                        {w.registered >= w.seats ? "Full" : `${w.seats - w.registered} seats left`}
                      </p>
                      <button 
                        onClick={() => handleRegisterClick(w)} 
                        style={w.registered >= w.seats ? styles.registerBtnDisabled : styles.registerBtn}
                        disabled={w.registered >= w.seats}
                      >
                        {w.registered >= w.seats ? "Full" : "Register"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Register for Workshop</h3>
            <p style={styles.modalSubtitle}>{selectedWorkshop?.title}</p>
            <form onSubmit={handleConfirmRegister}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  required 
                  style={styles.input}
                  value={formData.userName}
                  onChange={(e) => setFormData({...formData, userName: e.target.value})}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  style={styles.input}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelModalBtn}>Cancel</button>
                <button type="submit" style={styles.confirmBtn}>Confirm Registration</button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" },
  controls: { display: "flex", gap: "12px" },
  searchInput: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", width: "180px", color: "#000" },
  filterSelect: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px", background: "white", cursor: "pointer", color: "#000" },
  empty: { background: "white", padding: "40px", textAlign: "center", borderRadius: "8px", color: "#000", fontSize: "15px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" },
  card: { background: "white", borderRadius: "8px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: "1px solid #e0e0e0" },
  badge: { background: "#333", color: "white", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", display: "inline-block", marginBottom: "12px" },
  badgeAttended: { background: "#666", color: "white", padding: "4px 10px", borderRadius: "10px", fontSize: "12px", fontWeight: "600", display: "inline-block", marginBottom: "12px" },
  cardTitle: { fontSize: "17px", fontWeight: "600", color: "#000", margin: "0 0 12px 0" },
  description: { fontSize: "14px", color: "#000", marginBottom: "12px" },
  meta: { fontSize: "14px", color: "#000", margin: "4px 0" },
  seats: { fontSize: "14px", color: "#000", fontWeight: "600", marginTop: "8px" },
  joinBtn: { display: "block", width: "100%", padding: "10px", background: "#000", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600", textAlign: "center", textDecoration: "none", marginTop: "12px" },
  btnRow: { display: "flex", gap: "8px", marginTop: "12px" },
  detailsBtn: { flex: 1, padding: "10px", background: "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600", textAlign: "center", textDecoration: "none", display: "block" },
  cancelBtn: { flex: 1, padding: "10px", background: "#999", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  registerBtn: { width: "100%", padding: "10px", background: "#000", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", fontWeight: "600", marginTop: "12px" },
  registerBtnDisabled: { width: "100%", padding: "10px", background: "#ccc", color: "#666", border: "none", borderRadius: "6px", cursor: "not-allowed", fontSize: "14px", fontWeight: "600", marginTop: "12px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modal: { background: "white", borderRadius: "12px", width: "90%", maxWidth: "500px", padding: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" },
  modalTitle: { margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "#000" },
  modalSubtitle: { fontSize: "15px", color: "#000", marginBottom: "24px" },
  formGroup: { marginBottom: "20px" },
  label: { display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#000" },
  input: { width: "100%", padding: "10px", border: "2px solid #ddd", borderRadius: "6px", fontSize: "14px", boxSizing: "border-box", color: "#000" },
  modalActions: { display: "flex", gap: "12px", marginTop: "24px" },
  cancelModalBtn: { flex: 1, padding: "10px", background: "#999", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  confirmBtn: { flex: 1, padding: "10px", background: "#000", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }
};

export default UserDashboard;
