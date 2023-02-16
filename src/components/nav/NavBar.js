import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = ({ route }) => {
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  if (itemizedUserObject) {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
        <div className="navbar">
          <div className="flexRow alignItemsCenter">
            <li className="width180">
              <div className="navFlexHolder">
                <Link className="navLink width200" to="/">
                  <img
                    className="navLogo"
                    src={require("../../images/itemizedLogoSolid.png")}
                    alt=""
                  />
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
  } else if (route === "login") {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
        <div className="navbar">
          <div className="flexRow alignItemsCenter">
            <li className="">
              <div className="navFlexHolder">
                <img
                  className="navLogoLogin"
                  src={require("../../images/itemizedLogoSolid.png")}
                  alt=""
                ></img>
              </div>
            </li>
          </div>
          <li className="">
            <div className="navFlexHolder">
              <Link className="navLink" to="/register">
                Register
              </Link>
            </div>
          </li>
        </div>
      </ul>
    );
  } else if (route === "register") {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
        <div className="navbar">
          <div className="flexRow alignItemsCenter">
            <li className="">
              <div className="navFlexHolder">
                <img
                  className="navLogoLogin"
                  src={require("../../images/itemizedLogoSolid.png")}
                  alt=""
                ></img>
              </div>
            </li>
          </div>
          <li className="">
            <div className="navFlexHolder">
              <Link className="navLink" to="/login">
                Login
              </Link>
            </div>
          </li>
        </div>
      </ul>
    );
  }
};
