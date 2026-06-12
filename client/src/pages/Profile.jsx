import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
    getProfile();
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>

        {user ? (
          <>
            <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>

            <p className="mb-2">Email: {user.email}</p>

            <p className="mb-6">User ID: {user._id}</p>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-3 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <h3>Loading...</h3>
        )}
      </div>
    </div>
  );
}

export default Profile;
