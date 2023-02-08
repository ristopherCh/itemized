import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <ul id="navbarUL">
      <div className="navbar">
        <li className="navItem">
          <div className="navFlexHolder">
            <Link className="navLink" to="/">
              Home
            </Link>
          </div>
        </li>
        <li className="navItem">
          <div className="navFlexHolder">
            <Link className="navLink" to="/projects">
              All Projects
            </Link>
          </div>
        </li>
        <li className="navItem">
          <div className="navFlexHolder">
            <Link className="navLink" to="/items">
              All Items
            </Link>
          </div>
        </li>
        <li className="navItem">
          <div className="navFlexHolder">
            <Link className="navLink" to="/projects/new">
              Create New Project
            </Link>
          </div>
        </li>
        <li className="navItem">
          <div className="navFlexHolder">
            <Link className="navLink" to="/items/new">
              Add New Item
            </Link>
          </div>
        </li>
        <li className="navItem">
          <div className="navFlexHolder">
            <Link
              className="navLink"
              to=""
              onClick={() => {
                localStorage.removeItem("itemized_user");
                navigate("/", { replace: true });
              }}
            >
              Logout
            </Link>
          </div>
        </li>
      </div>
    </ul>
  );
};
