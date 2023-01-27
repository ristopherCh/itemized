import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <main>
      <form onSubmit={handleRegister}>
        <fieldset>
          <label htmlFor="fullName">Full Name</label>
          <input
            onChange={updateUser}
            type="text"
            id="fullName"
            className="form-control"
            placeholder="Enter your name"
            required
            autoFocus
          />
        </fieldset>
        <fieldset>
          <label htmlFor="email">Email address</label>
          <input
            onChange={updateUser}
            type="email"
            id="email"
            className="form-control"
            placeholder="Email address"
            required
          />
        </fieldset>
        <fieldset>
          <button type="submit">Register</button>
        </fieldset>
      </form>
    </main>
  );
};
