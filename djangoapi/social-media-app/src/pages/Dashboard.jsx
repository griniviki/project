// social-media-app/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { fetchUser } from "../helpers/axios";

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser()
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to load user:", err));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <p>Welcome, {user.username}</p>
      ) : (
        <p>Loading user...</p>
      )}
    </div>
  );
}

export default Dashboard;


