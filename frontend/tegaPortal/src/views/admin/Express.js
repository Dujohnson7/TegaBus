import React, { useEffect, useState } from "react";

export default function CardSettings() {
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem("userId");  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-xl">
      <div className="flex items-center gap-4">
        <img
          className="w-32 h-32 rounded-full border-2 border-gray-300 shadow-md object-cover"
          src={`http://localhost:5000/uploads/${user.profile}`} 
          alt={user.fullname}
        />
        <div>
          <h2 className="text-xl font-bold">{user.fullname}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
