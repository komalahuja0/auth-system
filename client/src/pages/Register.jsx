import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/register", form);

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F2EE] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-center mb-6 text-[#0F1B2D]">
          Create account
        </h1>

        <input
          placeholder="Name"
          className="w-full p-3 border border-black/10 rounded-lg mb-3 outline-none focus:border-[#0E7C5A] transition text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full p-3 border border-black/10 rounded-lg mb-3 outline-none focus:border-[#0E7C5A] transition text-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-black/10 rounded-lg mb-4 outline-none focus:border-[#0E7C5A] transition text-sm"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          disabled={loading}
          className="w-full bg-[#0F1B2D] text-white p-3 rounded-lg text-sm font-medium hover:bg-[#0F1B2D]/90 transition disabled:opacity-50"
          onClick={handleSubmit}
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-[#0F1B2D]/60 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#0E7C5A] font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
