import { useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      alert(res.data.message || "Registered successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
      <h1 className="text-3xl font-bold text-center mb-6">Register</h1>

      <input
        placeholder="Name"
        className="w-full p-3 border rounded-lg mb-4"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Email"
        className="w-full p-3 border rounded-lg mb-4"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
         className="w-full p-3 border rounded-lg mb-4"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button  className="w-full bg-black text-white p-3 rounded-lg" onClick={handleSubmit}>Register</button>
      <p>
  Click to login{" "}
  <Link to="/login">Login</Link>
</p>
    </div>
    </div>
  );
}

export default Register;