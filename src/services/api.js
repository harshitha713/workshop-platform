let mockWorkshops = [
  { id: 1, title: "Pottery Making Workshop", date: "2026-02-20", time: "10:00 AM", instructor: "Emma Wilson", seats: 20, description: "Learn the art of pottery and ceramic making", meetingLink: "" },
  { id: 2, title: "Watercolor Painting", date: "2026-02-25", time: "3:00 PM", instructor: "Michael Chen", seats: 15, description: "Master watercolor painting techniques", meetingLink: "https://meet.google.com/abc-defg-hij" },
  { id: 3, title: "Yoga & Meditation", date: "2026-03-05", time: "7:00 AM", instructor: "Sarah Kumar", seats: 30, description: "Morning yoga and meditation session", meetingLink: "" },
  { id: 4, title: "Cooking Masterclass", date: "2026-03-10", time: "11:00 AM", instructor: "Chef Antonio", seats: 25, description: "Learn Italian cuisine from a master chef", meetingLink: "" },
  { id: 5, title: "Photography Basics", date: "2026-03-15", time: "3:00 PM", instructor: "David Lee", seats: 20, description: "Introduction to photography and composition", meetingLink: "" }
];

let mockRegistrations = [
  { id: 1, workshopId: 1, userName: "Alice Brown", email: "alice@example.com", registeredAt: "2026-02-10" },
  { id: 2, workshopId: 1, userName: "Bob Wilson", email: "bob@example.com", registeredAt: "2026-02-12" },
  { id: 3, workshopId: 2, userName: "Current User", email: "user@example.com", registeredAt: "2026-02-20" },
  { id: 4, workshopId: 1, userName: "Current User", email: "user@example.com", registeredAt: "2026-02-15" }
];

let mockResources = [
  { id: 1, workshopId: 1, title: "Pottery Techniques Guide.pdf", type: "PDF", url: "demo" }
];

let mockAttendance = [
  { id: 1, workshopId: 1, userName: "Current User", attendedAt: "2026-02-20" }
];

const updateWorkshopCounts = () => {
  mockWorkshops.forEach(w => {
    w.registered = mockRegistrations.filter(r => r.workshopId === w.id).length;
  });
};

updateWorkshopCounts();

export const getWorkshops = () => {
  updateWorkshopCounts();
  return Promise.resolve([...mockWorkshops]);
};

export const getWorkshopById = (id) => {
  updateWorkshopCounts();
  return Promise.resolve(mockWorkshops.find(w => w.id === parseInt(id)));
};

export const addWorkshop = (workshop) => {
  const newWorkshop = { ...workshop, id: Date.now() };
  mockWorkshops.push(newWorkshop);
  updateWorkshopCounts();
  return Promise.resolve(newWorkshop);
};

export const updateWorkshop = (id, updates) => {
  const index = mockWorkshops.findIndex(w => w.id === parseInt(id));
  if (index !== -1) {
    mockWorkshops[index] = { ...mockWorkshops[index], ...updates };
    updateWorkshopCounts();
    return Promise.resolve(mockWorkshops[index]);
  }
  return Promise.reject(new Error("Workshop not found"));
};

export const deleteWorkshop = (id) => {
  const index = mockWorkshops.findIndex(w => w.id === parseInt(id));
  if (index !== -1) {
    mockWorkshops.splice(index, 1);
    mockRegistrations = mockRegistrations.filter(r => r.workshopId !== parseInt(id));
    mockResources = mockResources.filter(r => r.workshopId !== parseInt(id));
    updateWorkshopCounts();
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error("Workshop not found"));
};

export const getRegistrations = () => Promise.resolve([...mockRegistrations]);

export const registerForWorkshop = (data) => {
  const existing = mockRegistrations.find(r => r.workshopId === data.workshopId && r.userName === data.userName);
  if (existing) return Promise.reject(new Error("Already registered"));
  
  const workshop = mockWorkshops.find(w => w.id === data.workshopId);
  const count = mockRegistrations.filter(r => r.workshopId === data.workshopId).length;
  if (count >= workshop.seats) return Promise.reject(new Error("Workshop is full"));
  
  const newRegistration = { id: Date.now(), ...data, registeredAt: new Date().toISOString().split('T')[0] };
  mockRegistrations.push(newRegistration);
  updateWorkshopCounts();
  return Promise.resolve(newRegistration);
};

export const cancelRegistration = (workshopId, userName) => {
  const index = mockRegistrations.findIndex(r => r.workshopId === workshopId && r.userName === userName);
  if (index !== -1) {
    mockRegistrations.splice(index, 1);
    updateWorkshopCounts();
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error("Registration not found"));
};

export const getResources = () => Promise.resolve([...mockResources]);

export const uploadResource = (resource) => {
  const newResource = { id: Date.now(), ...resource };
  mockResources.push(newResource);
  return Promise.resolve(newResource);
};

export const deleteResource = (id) => {
  const index = mockResources.findIndex(r => r.id === parseInt(id));
  if (index !== -1) {
    mockResources.splice(index, 1);
    return Promise.resolve({ success: true });
  }
  return Promise.reject(new Error("Resource not found"));
};

export const getAttendance = () => Promise.resolve([...mockAttendance]);

export const markAttendance = (workshopId, userName) => {
  const existing = mockAttendance.find(a => a.workshopId === workshopId && a.userName === userName);
  if (existing) return Promise.resolve(existing);
  
  const newAttendance = { id: Date.now(), workshopId, userName, attendedAt: new Date().toISOString().split('T')[0] };
  mockAttendance.push(newAttendance);
  return Promise.resolve(newAttendance);
};
