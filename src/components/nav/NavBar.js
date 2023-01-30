import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            
            <li className="navItem">
                <Link to="/">Home</Link>
            </li>
            <li className="navItem">
                <Link to="/projects">All Projects</Link>
            </li>
            <li className="navItem">
                <Link to="/items">All Items</Link>
            </li>
            <li className="navItem">
                <Link to="/projects/new">Create New Project</Link>
            </li>
            <li className="navItem">
                <Link to="/items/new">Create New Item</Link>
            </li>
            <li className="navItem">
                <Link to="" onClick={() => {
                    localStorage.removeItem("itemized_user")
                    navigate("/", {replace: true})
                }}>Logout</Link>
            </li>

        </ul>
    )
}

