import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, []);
  return (
    <div>
      <h1>Logging Out...</h1>
      <p>You have been logged out successfully!</p>
    </div>
  );
}
export default Logout;