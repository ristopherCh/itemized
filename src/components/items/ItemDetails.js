import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ItemDetails = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const { itemId } = useParams();
  const [item, setItem] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedItemProject, setSelectedItemProject] = useState({
    userId: itemizedUserObject.id,
    itemId: 0,
    projectId: 0,
  });
  const [itemProjects, setItemProjects] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8089/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);

        const copy = { ...selectedItemProject };
        copy.itemId = data.id;
        setSelectedItemProject(copy);
      });

    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}&itemId=${item.id}&_expand=project`
    )
      .then((res) => res.json())
      .then((data) => {
        setItemProjects(data);
      });
  }, [item]);

  const handleAddButtonClick = (event) => {
    let noDuplicates = true;
    for (let itemProject of itemProjects) {
      if (itemProject.projectId === selectedItemProject.projectId) {
        noDuplicates = false;
      }
    }
    if (selectedItemProject.itemId && selectedItemProject.projectId) {
      if (noDuplicates) {
        fetch(`http://localhost:8089/itemsProjects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedItemProject),
        });
      }
    } else {
      alert("Please select a project to associate item with");
    }
  };

  const displayProjectPhoto = () => {
    let selectedProject = projects.find((project) => {
      return project.id === selectedItemProject.projectId;
    });
    return (
      <div>
        <img id="foundProjectImage" src={selectedProject.imageURL} alt=""></img>
      </div>
    );
  };

  return (
    <>
      <h1>{item.name}</h1>
      <div className="itemDetailsContainer">
        <h3>{item.type}</h3>
        <img className="itemImage" src={item.imageURL} alt=""></img>
        <p>Item description: {item.description}</p>
        <p>Purchase price: ${parseFloat(item.purchasePrice).toFixed(2)}</p>
        <p>Purchase date: {new Date(item.purchaseDate).toLocaleDateString()}</p>
        <p>Item review: {item.review}</p>
        {item.documentation ? (
          <a href={item.documentation} target="_blank" rel="noreferrer">
            Link to documentation
          </a>
        ) : (
          ""
        )}
        <p>Personal notes:</p>

        <p>Associated projects:</p>
        <ul className="itemDetailsUL">
          {itemProjects.map((itemProject) => {
            return (
              <li className="itemDetailsLI" key={itemProject.id}>
                <Link to={`/projects/${itemProject.project.id}`}>
                  {itemProject.project?.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <form>
          <div>
            <label>Add this item to a project</label>
          </div>
          {selectedItemProject.projectId ? displayProjectPhoto() : ""}
          <select
            onChange={(event) => {
              const copy = { ...selectedItemProject };
              copy.projectId = parseInt(event.target.value);
              setSelectedItemProject(copy);
            }}
          >
            <option>Choose project</option>
            {projects.map((project) => {
              return (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              );
            })}
          </select>

          <button
            className="itemDetailsAddBtn"
            onClick={(event) => {
              handleAddButtonClick(event);
            }}
          >
            Add
          </button>
        </form>
      </div>
    </>
  );
};
