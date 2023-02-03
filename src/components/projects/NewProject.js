import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./projects.css";

export const NewProject = () => {
  const { projectId } = useParams();
  const [editableProject, setEditableProject] = useState({});
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [userInputs, setUserInputs] = useState({
    name: "",
    imageURL: "",
    description: "",
    projectCreationDate: new Date(),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (projectId) {
      fetch(`http://localhost:8089/projects/${projectId}`)
        .then((res) => res.json())
        .then((data) => {
          setEditableProject(data);
        });
    }
  }, []);

  useEffect(() => {
    setUserInputs({
      userId: itemizedUserObject.id,
      name: editableProject.name,
      imageURL: editableProject.imageURL,
      description: editableProject.description,
    });
  }, [editableProject]);

  const fileToImgur = (event) => {
    const formdata = new FormData();
    formdata.append("image", event.target.files[0]);
    fetch("https://api.imgur.com/3/image/", {
      method: "POST",
      headers: {
        Authorization: "Client-ID e20703cad69156a",
      },
      body: formdata,
    })
      .then((res) => res.json())
      .then((data) => {
        const copy = { ...userInputs };
        copy.imageURL = data.data.link;
        setUserInputs(copy);
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
    if (userInputs.name) {
      fetch(`http://localhost:8089/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
      })
        .then((res) => res.json())
        .then((data) => {
          navigate(`/projects/${data.id}`);
        });
    } else {
      alert("Please try again");
    }
  };

  const handleProjectEdit = (event) => {
    event.preventDefault();
    if (userInputs.name) {
      fetch(`http://localhost:8089/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userInputs.name,
          imageURL: userInputs.imageURL,
          description: userInputs.description,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          navigate(`/projects/${projectId}`);
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
    <div id="newProjectContentContainer">
      {projectId ? <h1>Edit Project</h1> : <h1>Create New Project</h1>}

      <form id="newProjectForm">
        <fieldset>
          <label className="projectLabel" htmlFor="projectName">
            Name
          </label>
          <input
            type="text"
            value={userInputs.name}
            id="projectName"
            name="name"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="projectLabel" htmlFor="projectImageInput">
            Upload an image
          </label>
          <input
            type="file"
            id="projectImageInput"
            name="imageURL"
            onChange={(event) => {
              fileToImgur(event);
            }}
          />
          <br />
          {userInputs.imageURL ? (
            <img
              id="uploadedImage"
              src={userInputs.imageURL}
              alt={"uploaded"}
            ></img>
          ) : (
            ""
          )}

          <label className="projectLabel" htmlFor="projectDescription">
            Add a description <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="projectTextarea"
            value={userInputs.description}
            id="projectDescription"
            name="description"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>

          {projectId ? (
            <button
              id="newProjectSubmitButton"
              onClick={(event) => {
                handleProjectEdit(event);
              }}
            >
              Save Edit
            </button>
          ) : (
            <button
              id="newProjectSubmitButton"
              onClick={(event) => handleProjectCreation(event)}
            >
              Submit
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
};
