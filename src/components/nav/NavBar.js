import { Link, useNavigate } from "react-router-dom"
import "./NavBar.css"

export const NavBar = () => {
    const navigate = useNavigate()

    return (
        <ul className="navbar">
            
            <li className="navItem">
                <Link className="navLink" to="/">Home</Link>
            </li>
            <li className="navItem">
                <Link className="navLink" to="/projects">All Projects</Link>
            </li>
            <li className="navItem">
                <Link className="navLink" to="/items">All Items</Link>
            </li>
            <li className="navItem">
                <Link className="navLink" to="/projects/new">Create New Project</Link>
            </li>
            <li className="navItem">
                <Link className="navLink" to="/items/new">Add New Item</Link>
            </li>
            <li className="navItem">
                <Link className="navLink" to="" onClick={() => {
                    localStorage.removeItem("itemized_user")
                    navigate("/", {replace: true})
                }}>Logout</Link>
            </li>

        </ul>
    )
}

