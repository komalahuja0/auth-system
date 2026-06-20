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
          navigate("/login");
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
        navigate("/login");
      }
    };
    getProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center px-4">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />
      <div
        className="bg-white p-7 rounded-xl border border-black/5 w-full max-w-sm"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <h1
          className="text-xl text-[#0F1B2D] mb-5"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
        >
          Profile
        </h1>

        {user ? (
          <>
            <div className="space-y-2 mb-6 text-sm">
              <p className="text-[#0F1B2D]">
                <span className="text-[#0F1B2D]/40">Name </span>
                {user.name}
              </p>
              <p className="text-[#0F1B2D]">
                <span className="text-[#0F1B2D]/40">Email </span>
                {user.email}
              </p>
              <p className="text-[#0F1B2D]/40 text-xs">{user._id}</p>
            </div>

            <Link
              to="/expenses"
              className="block w-full text-center bg-[#0E7C5A] text-white text-sm font-medium py-2.5 rounded-lg mb-2 hover:bg-[#0E7C5A]/90 transition"
            >
              Go to Expense Tracker
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-[#F4F2EE] text-[#0F1B2D] text-sm font-medium py-2.5 rounded-lg hover:bg-[#0F1B2D]/5 transition border border-black/5"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-sm text-[#0F1B2D]/50">Loading…</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
