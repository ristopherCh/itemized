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
      <div className="flexWrap marginTop20 marginAuto maxWidth1500 alignItemsStart">
        <div className="width40 marginAuto minWidth500 flexColumn">
          <img
            className="displayBlock projectImage borderRadiusLight marginAuto"
            src={project.imageURL}
            alt=""
          />
        </div>
        <div className="widthAuto marginAuto maxWidth750">
          <div id="itemsListDiv">
            <h2 className="underlined">Items</h2>
            <div className="flexRow spaceAround">
              <div id="projectDescriptionLeft" className="marginRight3P">
                {projectItems.map((projectItem) => {
                  return (
                    <div className="noWrap" key={projectItem.id}>
                      {projectItem.item?.type}:
                    </div>
                  );
                })}
              </div>
              <div id="projectDescriptionRight width50">
                {projectItems.map((projectItem) => {
                  return (
                    <div className="noWrap" key={projectItem.id}>
                      <Link to={`/items/${projectItem.itemId}`}>
                        {projectItem.item?.name}
                      </Link>{" "}
                      <button
                        className="borderNone standardBackground marginLeft5 cursorPointer"
                        onClick={(event) => {
                          handleRemoveItem(event, projectItem);
                        }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="marginTop20" id="addItemDiv">
            <form>
              <div className="textCenter">Add an item to this project</div>
              <div>
                {selectedProjectItem.itemId ? displayItemPhoto() : ""}
                <div className="displayBlock marginAuto flexRow justifyCenter">
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
                    className="marginLeft20"
                    onClick={(event) => {
                      handleAddButtonClick(event);
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="marginAuto marginTop20 flexWrap justifyCenter"
        id="projectEditDeleteDiv"
      >
        <button
          className="displayInline width150 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5"
          onClick={(event) => {
            handleEditButtonClick(event);
          }}
        >
          Edit project
        </button>
        <button
          className="displayInline width150 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5"
          onClick={(event) => {
            handleDelete(event);
          }}
        >
          Delete Project
        </button>
      </div>
    </>
  );
};
