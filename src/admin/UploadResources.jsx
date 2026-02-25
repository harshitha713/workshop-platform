import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getWorkshops, uploadResource } from "../services/api";

function UploadResources() {
  const navigate = useNavigate();
  const [workshops, setWorkshops] = useState([]);
  const [formData, setFormData] = useState({ workshopId: "", title: "", type: "PDF" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    getWorkshops().then(setWorkshops);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const resourceData = {
      ...formData,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    uploadResource(resourceData).then(() => {
      alert("Resource uploaded successfully!");
      navigate("/admin/resources");
    });
  };

  return (
    <div style={styles.wrapper}>
      <Navbar role="admin" />
      <div style={styles.container}>
        <h2 style={styles.title}>Upload Training Resources</h2>
        <p style={styles.subtitle}>Add materials for workshop participants</p>
        
        <div style={styles.formCard}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Workshop</label>
              <select name="workshopId" required onChange={handleChange} style={styles.select}>
                <option value="">Choose a workshop...</option>
                {workshops.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Resource Title</label>
              <input name="title" placeholder="e.g., Workshop Slides.pdf" required onChange={handleChange} style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Resource Type</label>
              <select name="type" onChange={handleChange} style={styles.select}>
                <option value="PDF">PDF Document</option>
                <option value="Video">Video Recording</option>
                <option value="Document">Document</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Upload File</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi" 
                required 
                onChange={handleFileChange} 
                style={styles.fileInput} 
              />
              {file && <p style={styles.fileName}>Selected: {file.name}</p>}
            </div>
            <button type="submit" style={styles.submitBtn}>Upload Resource</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { minHeight: "100vh", background: "#f5f7fa" },
  container: { padding: "32px", maxWidth: "700px", margin: "0 auto" },
  title: { color: "#1976d2", fontSize: "24px", fontWeight: "700", margin: "0 0 6px 0" },
  subtitle: { color: "#666", fontSize: "18px", marginBottom: "24px" },
  formCard: { background: "white", borderRadius: "8px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  formGroup: { marginBottom: "18px" },
  label: { display: "block", marginBottom: "6px", fontSize: "17px", fontWeight: "600", color: "#333" },
  input: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box" },
  select: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box", cursor: "pointer" },
  fileInput: { width: "100%", padding: "12px", border: "2px dashed #ddd", borderRadius: "6px", fontSize: "16px", boxSizing: "border-box", cursor: "pointer", background: "#f9f9f9" },
  fileName: { fontSize: "14px", color: "#4caf50", marginTop: "8px", fontWeight: "600" },
  submitBtn: { width: "100%", padding: "13px", background: "#1976d2", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "17px", marginTop: "8px" }
};

export default UploadResources;
