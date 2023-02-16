import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export const Login = () => {
  const [email, setEmail] = useState("chanson8@gmail.com");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();

    return fetch(`http://localhost:8089/users?email=${email}`)
      .then((res) => res.json())
      .then((foundUsers) => {
        if (foundUsers.length === 1) {
          const user = foundUsers[0];
          localStorage.setItem(
            "itemized_user",
            JSON.stringify({
              id: user.id,
            })
          );

          navigate("/");
        } else {
          window.alert("Invalid login");
        }
      });
  };

  return (
    <main>
      <section className=" ">
        <h2 className="marginBottom10">Login</h2>
        <div className="marginAuto blackBorder width500 borderRadiusMedium yellowBackground boxShadowDark">
          <form className="" onSubmit={handleLogin}>
            <fieldset className="">
              <label
                className="marginAuto width50 displayBlock textAlignCenter"
                htmlFor="inputEmail"
              >
                {" "}
                Email address{" "}
              </label>
              <input
                type="email"
                id="inputEmail"
                value={email}
                onChange={(evt) => setEmail(evt.target.value)}
                className="marginAuto displayBlock"
                placeholder="Email address"
                required
                autoFocus
              />
            </fieldset>
            <button
              className="fontSize17 padding5 marginTop10 marginAuto displayBlock width75 whiteFont cursorPointer darkPurpleBackground lightBorder borderRadiusMedium"
              type="submit"
            >
              Log in
            </button>
          </form>
          <div className="line" />
          <Link
            className="marginAuto displayBlock width50 textAlignCenter boxShadow marginTop10 marginBottom10"
            to="/register"
          >
            Create new account
          </Link>
        </div>
      </section>
    </main>
  );
};
