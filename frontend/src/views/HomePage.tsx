import { Link } from "react-router-dom";
import { logout } from "../utils/auth";

const HomePage = () => {
    return (
        <>
            <h1>Welcome to the application!</h1>
            <button onClick={logout}>Logout</button>
        </>
        
    )
}
export default HomePage;