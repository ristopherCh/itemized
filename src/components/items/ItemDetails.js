import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const ItemDetails = () => {
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const { itemId } = useParams();
  const [newTag, setNewTag] = useState("");
  const [itemTags, setItemTags] = useState([]);
  const [item, setItem] = useState({});
  const [projects, setProjects] = useState([]);
  const [itemNotes, setItemNotes] = useState([]);
  const [itemNote, setItemNote] = useState({
    userId: itemizedUserObject.id,
    itemId: itemId,
    noteText: "",
    dateTime: "",
  });
  const [selectedItemProject, setSelectedItemProject] = useState({
    userId: itemizedUserObject.id,
    itemId: 0,
    projectId: 0,
  });
  const [itemProjects, setItemProjects] = useState([]);

  const fetchItemProjects = () => {
    return fetch(
      `http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}&itemId=${item.id}&_expand=project`
    )
      .then((res) => res.json())
      .then((data) => {
        setItemProjects(data);
      });
  };

  const fetchItemNotes = () => {
    return fetch(
      `http://localhost:8089/itemsNotes?userId=${itemizedUserObject.id}&itemId=${item.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setItemNotes(data);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:8089/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        data.description = data.description.split(". ");
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

    fetchAndSetItemTags();
  }, []);

  const fetchAndSetItemTags = () => {
    fetch(
      `http://localhost:8089/tags?userId=${itemizedUserObject.id}&itemId=${itemId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setItemTags(data);
      });
  };

  useEffect(() => {
    fetchItemProjects();

    fetchItemNotes();
  }, [item]);

  const handleAddItemProject = (event) => {
    event.preventDefault();
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
        }).then(() => {
          fetchItemProjects();
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

  const handleAddNoteButton = (event) => {
    event.preventDefault();
    fetch(`http://localhost:8089/itemsNotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemNote),
    }).then(() => {
      fetchItemNotes();
    });
  };

  const handleEditButtonClick = (event) => {
    event.preventDefault();
    navigate(`/items/edit/${item.id}`);
  };

  const handleDeleteButtonClick = (event) => {
    // TODO : Understand why this deletes itemTags too, even though it's not scripted in
    event.preventDefault();
    let promiseArray = [];

    promiseArray.push(
      fetch(`http://localhost:8089/items/${item.id}`, {
        method: "DELETE",
      })
    );

    for (let itemProject of itemProjects) {
      promiseArray.push(
        fetch(`http://localhost:8089/itemsProjects/${itemProject.id}`, {
          method: "DELETE",
        })
      );
    }

    for (let itemNote of itemNotes) {
      promiseArray.push(
        fetch(`http://localhost:8089/itemsNotes/${itemNote.id}`, {
          method: "DELETE",
        })
      );
    }
    Promise.all(promiseArray).then(navigate("/items"));
  };

  const handleAddTag = (event) => {
    event.preventDefault();
    let hasDuplicate = false;
    itemTags.forEach((itemTag) => {
      if (itemTag.tag === newTag) {
        hasDuplicate = true;
      }
    });
    if (!hasDuplicate) {
      fetch(`http://localhost:8089/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: itemizedUserObject.id,
          itemId: parseInt(itemId),
          tag: newTag,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchAndSetItemTags();
          setNewTag("");
        });
    } else {
      setNewTag("");
    }
  };

  const handleTagDelete = (event) => {
    event.preventDefault();
    let tagId = event.target.name;
    fetch(`http://localhost:8089/tags/${tagId}`, {
      method: "DELETE",
    }).then(() => {
      fetchAndSetItemTags();
    });
  };

  const blurFunction = (state) => {
    let containerElement = document.getElementById("main_container");
    let overlayElement = document.getElementById("itemImageLargeDiv");
    // let overlayElementLower = document.getElementById("itemReview");
    let navElement = document.getElementById("navbarUL");
    if (state) {
      overlayElement.style.display = "block";
      // overlayElementLower.style.display = "block";
      containerElement.setAttribute("class", "blur");
      navElement.setAttribute("class", "blur");
    } else {
      overlayElement.style.display = "none";
      // overlayElementLower.style.display = "none";
      containerElement.setAttribute("class", null);
      navElement.setAttribute("class", null);
    }
  };

  return (
    <>
      <div id="itemImageLargeDiv">
        <div>
          <h1 className="smallH1">{item.name}</h1>
          <div onClick={() => blurFunction(0)}>
            <span className="boldPointer close"></span>
          </div>
        </div>
        <img className="itemImageLarge" src={item.imageURL} alt="" />

        <div className="itemReview">
          <span className="justBold">Review:</span>
          <br />
          {item.review}
        </div>
      </div>

      <div id="main_container">
        <div className="itemDetailsContainer">
          <h1>{item.name}</h1>
          <h3 className="itemTypeHeader">{item.type}</h3>
          <div className="itemPhotoFlexbox">
            <img
              className="itemImage"
              src={item.imageURL}
              alt=""
              onClick={() => {
                blurFunction(1);
              }}
            />

            <div className="itemRightColumnBox">
              <div className="itemRightColumnBoxTop">
                <div className="itemRightColumnTopLeft">
                  <div className="itemPriceContainer">
                    <h2 className="itemRightColumnHeader">
                      Purchase Price: ${item.purchasePrice?.toFixed(2)}
                    </h2>
                    <h2 className="itemRightColumnHeader">
                      Purchase Date:{" "}
                      {new Date(item.purchaseDate).toLocaleDateString()}
                    </h2>
                  </div>
                </div>
                <div className="itemRightColumnTopRight">
                  <h2 className="itemRightColumnHeader">
                    This item is a member of:
                  </h2>
                  {itemProjects.length > 0 ? (
                    <>
                      <ul className="itemDetailsUL">
                        {itemProjects.map((itemProject) => {
                          return (
                            <li key={itemProject.id}>
                              <Link to={`/projects/${itemProject.project.id}`}>
                                <span className="itemProjectsLI">{itemProject.project?.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <div>This item is associated with no projects</div>
                  )}
                </div>
              </div>
              <div className="itemDescriptionBox">
                <h2 className="itemRightColumnHeader">Description</h2>
                <div className="itemDescription">
                  <ul className="itemDescriptionUL">
                    {item.description?.map((point, index) => {
                      return <li key={index}>{point}</li>;
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>Tags:</div>
          <ul>
            {itemTags.map((itemTag) => {
              return (
                <div key={itemTag.id}>
                  <li key={itemTag.id} className="skinnyLI">
                    <Link to={`/items/tags/${itemTag.tag}`}>{itemTag.tag}</Link>
                  </li>
                  <button
                    name={itemTag.id}
                    onClick={(event) => {
                      handleTagDelete(event);
                    }}
                  >
                    x
                  </button>
                </div>
              );
            })}
          </ul>
          {item.documentation ? (
            <a href={item.documentation} target="_blank" rel="noreferrer">
              Link to documentation
            </a>
          ) : (
            ""
          )}
          {itemNotes.length > 0 ? (
            <>
              <p>Notes:</p>
              <ul>
                {itemNotes.map((itemNote) => {
                  return (
                    <div key={itemNote.id}>
                      <li>{itemNote.noteText}</li>
                      {itemNote.dateTime ? (
                        <li>
                          {new Date(itemNote.dateTime).toLocaleDateString()}
                        </li>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
              </ul>
            </>
          ) : (
            ""
          )}

          <form>
            <div>
              {itemProjects.length > 0 ? (
                <label>Add this item to another project</label>
              ) : (
                <label>Add this item to a project</label>
              )}
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
                handleAddItemProject(event);
              }}
            >
              Add
            </button>
          </form>

          <form>
            <label htmlFor="addItemTag">Add tag</label>
            <input
              id="addItemTag"
              value={newTag}
              onChange={(event) => {
                setNewTag(event.target.value);
              }}
            />
            <button
              onClick={(event) => {
                handleAddTag(event);
              }}
            >
              +
            </button>
          </form>
          <form>
            <label className="itemLabel" htmlFor="addItemNote">
              Add a note to this item
            </label>
            <textarea
              className="itemTextarea"
              id="addItemNote"
              onChange={(event) => {
                const copy = { ...itemNote };
                copy.noteText = event.target.value;
                copy.dateTime = Date();
                setItemNote(copy);
              }}
            ></textarea>
            <button
              className=""
              onClick={(event) => {
                handleAddNoteButton(event);
              }}
            >
              Add note
            </button>
          </form>

          <button
            className="buttonBlock"
            onClick={(event) => {
              handleEditButtonClick(event);
            }}
          >
            Edit this item
          </button>
          <button
            className="buttonBlock"
            onClick={(event) => {
              handleDeleteButtonClick(event);
            }}
          >
            Delete this item
          </button>
        </div>
      </div>
    </>
  );
};
