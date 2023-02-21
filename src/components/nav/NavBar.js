import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = ({ route }) => {
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  const createDropFunction = () => {
    document.getElementById("createDropdown").classList.toggle("show");
  };

  const navigateDropFunction = () => {
    document.getElementById("navigateDropdown").classList.toggle("show");
  };

  window.onclick = (e) => {
    if (
      document.getElementById("createDropdown") ||
      document.getElementById("navigateDropdown")
    ) {
      if (!e.target.matches(".createDropbtn")) {
        let myDropdown = document.getElementById("createDropdown");
        if (myDropdown.classList.contains("show")) {
          myDropdown.classList.remove("show");
        }
      }
      if (!e.target.matches(".navigateDropbtn")) {
        let myDropdown = document.getElementById("navigateDropdown");
        if (myDropdown.classList.contains("show")) {
          myDropdown.classList.remove("show");
        }
      }
    }
  };

  if (itemizedUserObject) {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground">
        <div
          className="flexRow alignItemsCenter height40 spaceBetween"
          id="navTopFlexbox"
        >
          <li className="width180 padding5">
            <div className="textAlignCenter">
              <Link className="navLink width200" to="/">
                <img
                  className="width130"
                  id="navLogo"
                  src={require("../../images/itemizedLogoSolid.png")}
                  alt=""
                />
              </Link>
            </div>
          </li>
          <div
            className="flexRow spaceBetween alignItemsCenter width100 height100P"
            id="navLinkItems"
          >
            <div className="flexRow height100P alignItemsCenter">
              <li className="navItem marginAuto height100P flexRow alignItemsCenter justifyCenter textAlignCenter width101 navLinkHolderMedium">
                <Link className="navLink" to="/projects">
                  All Projects
                </Link>
              </li>
              <li className="navItem marginAuto height100P flexRow alignItemsCenter justifyCenter textAlignCenter width101 navLinkHolderShort">
                <Link className="navLink" to="/items">
                  All Items
                </Link>
              </li>
              <li className="navItem marginAuto height100P flexRow alignItemsCenter justifyCenter textAlignCenter width150 navLinkHolderLong">
                <Link className="navLink" to="/projects/new">
                  Create New Project
                </Link>
              </li>
              <li className="navItem marginAuto height100P flexRow alignItemsCenter justifyCenter textAlignCenter width120 navLinkHolder">
                <Link className="navLink" to="/items/new">
                  Add New Item
                </Link>
              </li>
              <li className="navItem marginAuto height100P flexRow alignItemsCenter justifyCenter textAlignCenter width120 navLinkHolder">
                <Link className="navLink" to="/analytics">
                  Analytics
                </Link>
              </li>
            </div>
            <li className="navItem height100P flexRow alignItemsCenter padding5">
              <div className="5textAlignRight navLinkHolderShort">
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
          <div className="navbarDropDiv" id="navBarDropDiv">
            <div className="dropdownDiv">
              <button
                className="createDropbtn dropbtn width125 borderRadiusMedium lightBorder padding5 whiteFont darkPurpleBackground"
                onClick={() => createDropFunction()}
              >
                Create New <i className="fa fa-caret-down"></i>
              </button>
              <div
                className="dropdown-content lightPinkBackground borderRadiusLight boxShadowDiffuse"
                id="createDropdown"
              >
                <div className="textAlignCenter width100">
                  <Link className="navLink padding5" to="/projects/new">
                    Create New Project
                  </Link>
                </div>
                <div className="textAlignCenter width100">
                  <Link className="navLink padding5" to="/items/new">
                    Add New Item
                  </Link>
                </div>
              </div>
            </div>
            <div className="dropdownDiv marginLeft20">
              <button
                className="navigateDropbtn dropbtn width125 borderRadiusMedium lightBorder padding5 whiteFont darkPurpleBackground"
                onClick={() => navigateDropFunction()}
              >
                Navigate <i className="fa fa-caret-down"></i>
              </button>
              <div
                className="dropdown-content lightPinkBackground borderRadiusLight boxShadowDiffuse"
                id="navigateDropdown"
              >
                <div className="textAlignCenter width100">
                  <Link className="navLink padding5" to="/projects">
                    All Projects
                  </Link>
                </div>
                <div className="textAlignCenter width100">
                  <Link className="navLink padding5" to="/items">
                    All Items
                  </Link>
                </div>
                <div className="textAlignCenter width100">
                  <Link className="navLink padding5" to="/analytics">
                    Analytics
                  </Link>
                </div>
                <div className="textAlignCenter width100">
                  <Link
                    className="navLink padding5"
                    to=""
                    onClick={() => {
                      localStorage.removeItem("itemized_user");
                      navigate("/", { replace: true });
                    }}
                  >
                    Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ul>
    );
  } else {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
        <div className="">
          <div className="flexRow alignItemsCenter height40 spaceBetween">
            <li className="width180">
              <div className="textAlignCenter">
                <img
                  className="width130"
                  src={require("../../images/itemizedLogoSolid.png")}
                  alt=""
                ></img>
              </div>
            </li>
            <li className="">
              {route === "register" ? (
                <Link className="navLink" to="/login">
                  Login
                </Link>
              ) : (
                <Link className="navLink" to="/register">
                  Register
                </Link>
              )}
            </li>
          </div>
        </div>
      </ul>
    );
  }
  // else if (route === "register") {
  //   return (
  //     <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
  //       <div className="navbar">
  //         <div className="flexRow alignItemsCenter">
  //           <li className="">
  //             <div className="textAlignCenter">
  //               <img
  //                 className="navLogoLogin"
  //                 src={require("../../images/itemizedLogoSolid.png")}
  //                 alt=""
  //               ></img>
  //             </div>
  //           </li>
  //         </div>
  //         <li className="">
  //           <div className="textAlignCenter">
  //             <Link className="navLink" to="/login">
  //               Login
  //             </Link>
  //           </div>
  //         </li>
  //       </div>
  //     </ul>
  //   );
  // }
};
