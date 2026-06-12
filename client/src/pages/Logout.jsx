import { useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
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
       <button> Click to register{" "} <Link to ="/">Register</Link></button>
    </div>
  );
}
export default Logout;