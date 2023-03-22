import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export const Register = (props) => {
  const [user, setUser] = useState({
    email: "",
    fullName: "",
  });
  let navigate = useNavigate();

  const registerNewUser = () => {
    return fetch("http://localhost:8089/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((createdUser) => {
        if (createdUser.hasOwnProperty("id")) {
          localStorage.setItem(
            "itemized_user",
            JSON.stringify({
              id: createdUser.id,
            })
          );
          navigate("/");
        }
      });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    return fetch(`http://localhost:8089/users?email=${user.email}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          window.alert("Account with that email address already exists");
        } else {
          registerNewUser();
        }
      });
  };

  const updateUser = (event) => {
    const copy = { ...user };
    copy[event.target.id] = event.target.value;
    setUser(copy);
  };

  return (
    <main className="marginTop40">
      <h2 className="marginBottom10">Register</h2>
      <form
        className="width500 marginAuto blackBorder borderRadiusMedium yellowBackground boxShadowDark"
        onSubmit={handleRegister}
      >
        <fieldset className="">
          <label
            className="displayBlock marginAuto width50 textAlignCenter"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            onChange={updateUser}
            type="text"
            id="fullName"
            className="displayBlock marginAuto"
            placeholder="Enter your name"
            required
            autoFocus
          />
        </fieldset>
        <fieldset className="">
          <label
            className=" displayBlock marginAuto widthAuto textAlignCenter marginTop10"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            onChange={updateUser}
            type="email"
            id="email"
            className=" displayBlock marginAuto"
            placeholder="Email address"
            required
          />
        </fieldset>
        <button
          className="cursorPointer displayBlock marginAuto fontSize17 padding5 marginTop10 width75 whiteFont darkPurpleBackground lightBorder borderRadiusMedium marginBottom10"
          type="submit"
        >
          Register
        </button>
      </form>
    </main>
  );
};
