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

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <>
          <h2> Welcome,{user.name}</h2>
          <p> Email: {user.email}</p>
          <p> User ID: {user._id}</p>
          <Link to="/logout">
            <button>Logout</button>
          </Link>
        </>
      ) : (
        <h3> Loading...</h3>
      )}
    </div>
  );
}
export default Profile;
