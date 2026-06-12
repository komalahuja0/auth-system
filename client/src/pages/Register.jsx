import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleSubmit = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      form,
    );
    alert(res.data.message || "Registered");
  };
  return (
    <>
      <h1> Register </h1>
      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button onClick={handleSubmit}>Register</button>
    </>
  );
}
export default Register;
