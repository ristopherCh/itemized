import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

export const NavBar = ({ route }) => {
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  if (itemizedUserObject) {
    return (
      <ul id="navbarUL" className="blackBorder darkGreenBackground padding52">
        <div
          className="flexRow padding5 alignItemsCenter height40 spaceBetween"
          id="navTopFlexbox"
        >
          <li className="width180">
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
          <div className="flexRow spaceBetween alignItemsCenter width100">
            <div className="flexRow">
              <li className="">
                <div className="textAlignCenter width101 navLinkHolderMedium">
                  <Link className="navLink" to="/projects">
                    All Projects
                  </Link>
                </div>
              </li>
              <li className="">
                <div className="textAlignCenter width101 navLinkHolder navLinkHolderShort">
                  <Link className="navLink" to="/items">
                    All Items
                  </Link>
                </div>
              </li>
              <li className="">
                <div className="textAlignCenter width150 navLinkHolderLong">
                  <Link className="navLink" to="/projects/new">
                    Create New Project
                  </Link>
                </div>
              </li>
              <li className="">
                <div className="textAlignCenter width120 navLinkHolder">
                  <Link className="navLink" to="/items/new">
                    Add New Item
                  </Link>
                </div>
              </li>
            </div>
            <li className="">
              <div className="textAlignRight navLinkHolderShort">
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
