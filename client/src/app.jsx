import { BrowserRouter,ROutes,Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";

function app(){
   return (
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/logout" element={<Logout/>}/>
        </Routes>
        </BrowserRouter>
   )
}
export default app;