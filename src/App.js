import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import UserDashboard from "./user/UserDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import AddWorkshop from "./admin/AddWorkshop";
import ManageRegistrations from "./admin/ManageRegistrations";
import UploadResources from "./admin/UploadResources";
import AdminResources from "./admin/AdminResources";
import JoinSession from "./user/JoinSession";
import WorkshopDetails from "./user/WorkshopDetails";
import Resources from "./user/Resources";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/workshops" element={<JoinSession />} />
        <Route path="/user/workshop/:id" element={<WorkshopDetails />} />
        <Route path="/user/resources" element={<Resources />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-workshop" element={<AddWorkshop />} />
        <Route path="/admin/registrations" element={<ManageRegistrations />} />
        <Route path="/admin/upload-resources" element={<UploadResources />} />
        <Route path="/admin/resources" element={<AdminResources />} />
      </Routes>
    </Router>
  );
}

export default App;