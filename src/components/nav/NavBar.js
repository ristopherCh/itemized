import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = () => {
  const navigate = useNavigate();

  return (
    <ul id="navbarUL" className="darkGreenBackground">
      <div className="navbar">
        <div className="navbarLeft">
          <li className=" width180">
            <div className="navFlexHolder">
              <Link className="navLink" to="/">
                <img
                  className="navLogo"
                  src={require("../../images/itemizedLogoSolid.png")}
                  alt=""
                ></img>
                {/* <div className="navLogo" /> */}
              </Link>
            </div>
          </li>
          <li className="">
            <div className="navFlexHolder width150">
              <Link className="navLink" to="/projects">
                All Projects
              </Link>
            </div>
          </li>
          <li className="">
            <div className="navFlexHolder width120">
              <Link className="navLink" to="/items">
                All Items
              </Link>
            </div>
          </li>
          <li className="">
            <div className="navFlexHolder width180">
              <Link className="navLink" to="/projects/new">
                Create New Project
              </Link>
            </div>
          </li>
          <li className="">
            <div className="navFlexHolder width150">
              <Link className="navLink" to="/items/new">
                Add New Item
              </Link>
            </div>
          </li>
        </div>
        <li className="">
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
