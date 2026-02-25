import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getRegistrations } from "../services/api";

function Navbar({ role }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [userNotifications, setUserNotifications] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      getRegistrations().then(setRegistrations);
    } else {
      const notifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
      setUserNotifications(notifs);
    }
  }, [role]);

  const handleLogout = () => {
    navigate("/");
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ago`;
  };

  const adminNotifications = [
    { id: 1, text: `${registrations.length} total registrations received`, time: "Updated", link: "/admin/registrations" },
    ...registrations.slice(-3).reverse().map((r, i) => ({
      id: i + 2,
      text: `New registration: ${r.userName} for workshop`,
      time: getTimeAgo(r.registeredAt),
      link: "/admin/registrations"
    }))
  ];

  const userNotifs = userNotifications.slice(0, 5).map((n, i) => ({
    id: i + 1,
    text: `Successfully registered for ${n.workshopTitle}`,
    time: getTimeAgo(n.time),
    link: "/user"
  }));

  const notifications = role === "admin" ? adminNotifications : userNotifs;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <h2 style={styles.brandText}>Online Workshop Platform</h2>
        <div style={styles.links}>
          {role === "admin" ? (
            <>
              <Link to="/admin" style={styles.link}>Dashboard</Link>
              <Link to="/admin/add-workshop" style={styles.link}>Add Workshop</Link>
              <Link to="/admin/registrations" style={styles.link}>Registrations</Link>
              <Link to="/admin/upload-resources" style={styles.link}>Upload Resources</Link>
              <Link to="/admin/resources" style={styles.link}>View Resources</Link>
            </>
          ) : (
            <>
              <Link to="/user" style={styles.link}>Dashboard</Link>
              <Link to="/user/workshops" style={styles.link}>Workshops</Link>
              <Link to="/user/resources" style={styles.link}>Resources</Link>
            </>
          )}
          <div style={styles.notificationWrapper}>
            <button onClick={() => setShowNotifications(!showNotifications)} style={styles.notificationBtn}>
              🔔
              {notifications.length > 0 && <span style={styles.badge}>{notifications.length}</span>}
            </button>
            {showNotifications && (
              <div style={styles.notificationDropdown}>
                <h4 style={styles.notificationTitle}>Notifications</h4>
                {notifications.length === 0 ? (
                  <div style={styles.emptyNotif}>No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} style={styles.notificationItem} onClick={() => { navigate(n.link); setShowNotifications(false); }}>
                      <p style={styles.notificationText}>{n.text}</p>
                      <span style={styles.notificationTime}>{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: "white", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 },
  container: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", maxWidth: "1400px", margin: "0 auto" },
  brandText: { margin: 0, color: "#000", fontWeight: "700", fontSize: "28px" },
  links: { display: "flex", gap: "24px", alignItems: "center" },
  link: { color: "#000", textDecoration: "none", fontWeight: "500", fontSize: "15px" },
  notificationWrapper: { position: "relative" },
  notificationBtn: { background: "none", border: "none", fontSize: "22px", cursor: "pointer", position: "relative", padding: "8px" },
  badge: { position: "absolute", top: "4px", right: "4px", background: "#000", color: "white", borderRadius: "50%", width: "18px", height: "18px", fontSize: "11px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center" },
  notificationDropdown: { position: "absolute", top: "45px", right: "0", background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "8px", width: "340px", maxHeight: "400px", overflowY: "auto", zIndex: 1000 },
  notificationTitle: { padding: "16px", margin: 0, borderBottom: "1px solid #f0f0f0", fontSize: "16px", fontWeight: "600", color: "#000" },
  notificationItem: { padding: "16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", transition: "background 0.2s" },
  notificationText: { margin: "0 0 4px 0", fontSize: "14px", color: "#000", fontWeight: "500" },
  notificationTime: { fontSize: "12px", color: "#000" },
  emptyNotif: { padding: "20px", textAlign: "center", color: "#000", fontSize: "14px" },
  logoutBtn: { padding: "8px 18px", background: "#000", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }
};

export default Navbar;
