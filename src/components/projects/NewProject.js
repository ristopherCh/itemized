import { useEffect, useState } from "react";
import "./projects.css";

export const NewProject = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [userInputs, setUserInputs] = useState({
    userId: itemizedUserObject.id,
    name: "",
    imageURL: "",
    description: "",
    projectCreationDate: new Date()
  })

  const fileToImgur = (event) => {
    const formdata = new FormData();
    formdata.append("image", event.target.files[0]);
    fetch("https://api.imgur.com/3/image/", {
      method: "POST",
      headers: {
        Authorization: "Client-ID e20703cad69156a"
      },
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        const copy = { ...userInputs }
        copy.imageURL = data.data.link;
        setUserInputs(copy)
      });
  };

  const updateFormState = (event, property) => {
    const copy = { ...userInputs };
    if (event.target.type === "number") {
      copy[property] = parseInt(event.target.value);
    } else if (event.target.type === "date") {
      copy[property] = new Date(event.target.value);
    } else {
      copy[property] = event.target.value;
    }
    setUserInputs(copy);
  };

  const handleProjectCreation = (event) => {
    event.preventDefault();

    if (userInputs.name && userInputs.imageURL) {
      fetch(`http://localhost:8089/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
      });
    } else {
      alert("Please try again");
    }
  };

  useEffect(() => {
    // ~ This is just to monitor the change of state, it's not functional
    // console.log(userInputs);
  }, [userInputs]);
  
  return (
    <>
      <h2>Create New Project</h2>
      <form id="newProjectForm">
        <fieldset>
          <label className="projectLabel" htmlFor="projectName">
            Name
          </label>
          <input type="text" id="projectName" name="name" onChange={(event) => {
              updateFormState(event, event.target.name);
            }} />
          <label className="projectLabel" htmlFor="projectImage">
            Upload an image
          </label>
          <input type="file" id="projectImage" name="imageURL" onChange={(event) => {
              fileToImgur(event);
            }} />
            <br />
          {userInputs.imageURL ? <img id="projectImage" src={userInputs.imageURL} alt={"uploaded"}></img> : ""}
          <label className="projectLabel" htmlFor="projectDescription">
            Add a description <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="projectTextarea"
            id="projectDescription"
            name="description"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>
          <button
            id="newProjectSubmitButton"
            onClick={(event) => handleProjectCreation(event)}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
};