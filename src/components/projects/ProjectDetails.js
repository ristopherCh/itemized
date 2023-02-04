import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const ProjectDetails = () => {
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [items, setItems] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [selectedProjectItem, setSelectedProjectItem] = useState({
    userId: itemizedUserObject.id,
    itemId: 0,
    projectId: 0,
  });

  const fetchProjectItems = () => {
    return fetch(
      `http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}&projectId=${projectId}&_expand=item`
    )
      .then((res) => res.json())
      .then((data) => {
        setProjectItems(data);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:8089/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);

        const copy = { ...selectedProjectItem };
        copy.projectId = data.id;
        setSelectedProjectItem(copy);
      });

    fetchProjectItems();

    fetch(`http://localhost:8089/items?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      });
  }, []);

  const handleAddButtonClick = (event) => {
    event.preventDefault();
    let noDuplicates = true;
    for (let projectItem of projectItems) {
      if (projectItem.itemId === selectedProjectItem.itemId) {
        noDuplicates = false;
      }
    }

    if (selectedProjectItem.itemId && selectedProjectItem.projectId) {
      if (noDuplicates) {
        fetch(`http://localhost:8089/itemsProjects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedProjectItem),
        }).then(() => {
          fetchProjectItems();
        });
      }
    } else {
      alert("Please select an item to associate project with");
    }
  };

  const displayItemPhoto = () => {
    let selectedItem = items.find((item) => {
      return item.id === selectedProjectItem.itemId;
    });
    return (
      <div>
        <img id="foundItemImage" src={selectedItem.imageURL} alt=""></img>
      </div>
    );
  };

  const handleRemoveItem = (event, projectItem) => {
    event.preventDefault();
    fetch(`http://localhost:8089/itemsProjects/${projectItem.id}`, {
      method: "DELETE",
    }).then(() => {
      fetchProjectItems();
    });
  };

  const handleDelete = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8089/projects/${projectId}`, {
      method: "DELETE",
    }).then(() => {
      let promiseArray = [];
      for (let item of projectItems) {
        promiseArray.push(
          fetch(`http://localhost:8089/itemsProjects/${item.id}`, {
            method: "DELETE",
          })
        );
      }
      Promise.all(promiseArray).then(navigate("/projects"));
    });
  };

  const handleEditButtonClick = (event) => {
    event.preventDefault();
    navigate(`/projects/edit/${project.id}`);
  };

  return (
    <>
      <h1>{project.name}</h1>
      <h3 className="projectDescription">{project.description}</h3>
      <div className="projectDetailsContainer">
        <div className="projectDetailsLeftColumn">
          <img className="projectImage" src={project.imageURL} alt=""></img>
        </div>
        <div className="projectDetailsRightColumn">
          <h2>Items</h2>
          {projectItems.map((projectItem, index) => {
            return (
              <div
                className="projectDetailsRightColumnSplitter"
                key={projectItem.id}
              >
                <div className="pdrl">{projectItem.item?.type}:</div>
                <div className="pdrr">
                  <Link to={`/items/${projectItem.itemId}`}>
                    {projectItem.item?.name}
                  </Link>{" "}
                  <button
                    className="projectRemoveItemBtn"
                    onClick={(event) => {
                      handleRemoveItem(event, projectItem);
                    }}
                  >
                    x
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <form>
        <div>Add an item to this project</div>
        {selectedProjectItem.itemId ? displayItemPhoto() : ""}
        <select
          onChange={(event) => {
            const copy = { ...selectedProjectItem };
            copy.itemId = parseInt(event.target.value);
            setSelectedProjectItem(copy);
          }}
        >
          <option>Select an item</option>
          {items.map((item) => {
            return (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            );
          })}
        </select>
        <button
          onClick={(event) => {
            handleAddButtonClick(event);
          }}
        >
          Add
        </button>
      </form>
      <button className="buttonBlock"
          onClick={(event) => {
            handleEditButtonClick(event);
          }}
        >
          Edit this project
        </button>
      <button
        onClick={(event) => {
          handleDelete(event);
        }}
      >
        Delete Project
      </button>
    </>
  );
};
