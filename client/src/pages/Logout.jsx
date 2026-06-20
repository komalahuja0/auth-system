import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    const timer = setTimeout(() => {
      navigate("/login");
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F4F2EE] flex items-center justify-center px-4">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap"
      />
      <div
        className="bg-white p-7 rounded-xl border border-black/5 w-full max-w-sm text-center"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <h1
          className="text-xl text-[#0F1B2D] mb-2"
          style={{ fontFamily: "Fraunces, serif", fontWeight: 600 }}
        >
          Logged out!!
        </h1>
        <p className="text-sm text-[#0F1B2D]/50 mb-5">
          You've been logged out successfully.
        </p>
        <Link
          to="/login"
          className="block w-full text-center bg-[#0F1B2D] text-white text-sm font-medium py-2.5 rounded-lg hover:bg-[#0F1B2D]/90 transition"
        >
          Login again
        </Link>
      </div>
    </div>
  );
}

export default Logout;
