let mockWorkshops = [
  { id: 1, title: "React Fundamentals", date: "2026-02-25", time: "10:00 AM", instructor: "John Doe", seats: 30, registered: 15, description: "Learn React basics" },
  { id: 2, title: "Node.js Advanced", date: "2026-03-05", time: "2:00 PM", instructor: "Jane Smith", seats: 25, registered: 20, description: "Advanced Node.js concepts" },
  { id: 3, title: "Python for Data Science", date: "2026-03-12", time: "11:00 AM", instructor: "Mike Johnson", seats: 40, registered: 35, description: "Data analysis with Python" },
  { id: 4, title: "JavaScript ES6+", date: "2026-03-18", time: "3:00 PM", instructor: "Sarah Williams", seats: 35, registered: 10, description: "Modern JavaScript features" },
  { id: 5, title: "AWS Cloud Fundamentals", date: "2026-03-22", time: "1:00 PM", instructor: "David Brown", seats: 30, registered: 8, description: "Introduction to AWS services" }
];

let mockRegistrations = [
  { id: 1, workshopId: 1, userName: "Alice Brown", email: "alice@example.com", registeredAt: "2026-02-10" },
  { id: 2, workshopId: 1, userName: "Bob Wilson", email: "bob@example.com", registeredAt: "2026-02-12" },
  { id: 3, workshopId: 1, userName: "Charlie Davis", email: "charlie@example.com", registeredAt: "2026-02-13" },
  { id: 4, workshopId: 1, userName: "Diana Evans", email: "diana@example.com", registeredAt: "2026-02-14" },
  { id: 5, workshopId: 1, userName: "Eve Foster", email: "eve@example.com", registeredAt: "2026-02-15" },
  { id: 6, workshopId: 2, userName: "Frank Green", email: "frank@example.com", registeredAt: "2026-02-16" },
  { id: 7, workshopId: 2, userName: "Grace Hill", email: "grace@example.com", registeredAt: "2026-02-17" },
  { id: 8, workshopId: 3, userName: "Henry Irving", email: "henry@example.com", registeredAt: "2026-02-18" },
  { id: 9, workshopId: 3, userName: "Iris Jones", email: "iris@example.com", registeredAt: "2026-02-19" },
  { id: 10, workshopId: 3, userName: "Jack King", email: "jack@example.com", registeredAt: "2026-02-20" }
];

let mockResources = [
  { id: 1, workshopId: 1, title: "React Slides.pdf", type: "PDF", url: "https://example.com/react-slides.pdf" },
  { id: 2, workshopId: 1, title: "Session Recording", type: "Video", url: "https://example.com/react-recording.mp4" },
  { id: 3, workshopId: 2, title: "Node.js Guide.pdf", type: "PDF", url: "https://example.com/nodejs-guide.pdf" }
];

export const getWorkshops = () => Promise.resolve([...mockWorkshops]);
export const getWorkshopById = (id) => Promise.resolve(mockWorkshops.find(w => w.id === parseInt(id)));
export const addWorkshop = (workshop) => {
  const newWorkshop = { ...workshop, id: Date.now(), registered: 0 };
  mockWorkshops.push(newWorkshop);
  return Promise.resolve(newWorkshop);
};
export const getRegistrations = () => Promise.resolve([...mockRegistrations]);
export const registerForWorkshop = (data) => {
  const newRegistration = { id: Date.now(), ...data };
  mockRegistrations.push(newRegistration);
  return Promise.resolve(newRegistration);
};
export const getResources = () => Promise.resolve([...mockResources]);
export const uploadResource = (resource) => {
  const newResource = { id: Date.now(), ...resource };
  mockResources.push(newResource);
  return Promise.resolve(newResource);
};
