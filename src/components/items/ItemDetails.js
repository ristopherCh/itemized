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
      setItemNote({
        userId: itemizedUserObject.id,
        itemId: itemId,
        noteText: "",
        dateTime: "",
      });
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
      navElement.setAttribute("class", "blur greenBackground");
    } else {
      overlayElement.style.display = "none";
      // overlayElementLower.style.display = "none";
      containerElement.setAttribute("class", null);
      navElement.setAttribute("class", "greenBackground");
    }
  };

  return (
    <>
      <div id="itemImageLargeDiv">
        <div>
          <h1 className="smallH1">{item.name}</h1>
          <div onClick={() => blurFunction(0)}>
            <span className="boldPointer close" />
          </div>
        </div>
        <img className="itemImageLarge" src={item.imageURL} alt="" />
        <div className="itemReview greenBackground boxShadow">
          <span className="justBold underlined">Review</span>
          <br />
          {item.review}
        </div>
      </div>

      <div id="main_container">
        <div className="itemDetailsContainer">
          <h1>{item.name}</h1>
          <h3 className="itemTypeHeader">{item.type}</h3>
          {/* Top flexbox (with photo) */}
          <div className="flexColumn spaceAround alignCenter">
            <img
              className="itemImage boxShadow"
              src={item.imageURL}
              alt=""
              onClick={() => {
                blurFunction(1);
              }}
            />
            <div
              className="flexColumn width75 margin10"
              id="everythingButImage"
            >
              <div className="width100 spaceBetween flexColumn alignCenter tempBorder margin10">
                <h2 className="displayInline">
                  Purchase Price ${item.purchasePrice?.toFixed(2)}{" "}
                </h2>
                <h2 className="displayInline">
                  Purchase Date{" "}
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </h2>
                {item.documentation ? (
                  <a href={item.documentation} target="_blank" rel="noreferrer">
                    <h4 className="displayInline">Documentation</h4>
                  </a>
                ) : (
                  ""
                )}
              </div>

              <div className="tempBorder margin10 alignCenter spaceAround flexRow margin10">
                <div className="marginRight20">
                  <div className="itemDescription boxShadow yellowBackground padding20">
                    <h2 className="underlined">Description</h2>
                    <ul className="itemDescriptionUL">
                      {item.description?.map((point, index) => {
                        return <li key={index}>{point}</li>;
                      })}
                    </ul>
                  </div>
                </div>

                <div className="width50 margin10 flexRow alignItemsCenter spaceAround flexColumn boxShadow yellowBackground padding20">
                  <div className="marginBottom20" id="itemProjectsList">
                    {itemProjects.length > 0 ? (
                      <>
                        <h2 className="displayInline">
                          This item is a member of:
                        </h2>
                        <ul className="itemDetailsUL">
                          {itemProjects.map((itemProject) => {
                            return (
                              <li key={itemProject.id}>
                                <Link
                                  to={`/projects/${itemProject.project.id}`}
                                >
                                  <span className="itemProjectsLI">
                                    {itemProject.project?.name}
                                  </span>
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

                  <form className="">
                    <div className="">
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
                </div>
              </div>

              <div className="tempBorder margin10 boxShadow yellowBackground" id="">
                <h2 className="underlined">Tags</h2>
                <form className="flexRow justifyCenter">
                  <input
                    className=""
                    id="addItemTag"
                    value={newTag}
                    onChange={(event) => {
                      setNewTag(event.target.value);
                    }}
                  />
                  <button
                    className="borderNone standardBackground"
                    onClick={(event) => {
                      handleAddTag(event);
                    }}
                  >
                    <span className="justBold">+</span>
                  </button>
                </form>

                <ul>
                  {itemTags.map((itemTag) => {
                    return (
                      <div className="itemTagsContainer" key={itemTag.id}>
                        <li className="width30" key={itemTag.id}>
                          <Link to={`/items/tags/${itemTag.tag}`}>
                            {itemTag.tag}
                          </Link>
                        </li>
                        <div className="width50">
                          <button
                            className="borderNone standardBackground"
                            name={itemTag.id}
                            onClick={(event) => {
                              handleTagDelete(event);
                            }}
                          >
                            x
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </ul>
              </div>

              <div
                className="flexColumn tempBorder margin10"
                id="itemNotes"
              >
                <div className="width100">
                  {itemNotes.length > 0 ? (
                    <div className="boxShadow yellowBackground padding20">
                      <h2 className="underlined">Notes</h2>
                      <ul>
                        {itemNotes.map((itemNote) => {
                          return (
                            <div
                              className="tempBorder margin10"
                              key={itemNote.id}
                            >
                              <li>
                                <div className="flexRow spaceBetween boxShadow">
                                  <div className="">{itemNote.noteText}</div>
                                  <div className="width30 textAlignRight">
                                    {itemNote.dateTime ? (
                                      <>
                                        {new Date(
                                          itemNote.dateTime
                                        ).toLocaleDateString()}
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              </li>
                            </div>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="margin10">
                  <form className="flexRow spaceAround tempBorder alignCenter">
                    <textarea
                      className="itemTextarea width75"
                      value={itemNote.noteText}
                      id="addItemNote"
                      onChange={(event) => {
                        const copy = { ...itemNote };
                        copy.noteText = event.target.value;
                        copy.dateTime = Date();
                        setItemNote(copy);
                      }}
                    ></textarea>
                    <div>
                      <button
                        className="height50 marginAuto alignCenter justifyCenter"
                        onClick={(event) => {
                          handleAddNoteButton(event);
                        }}
                      >
                        Add note
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <div className="tempBorder margin10 inline boxShadow width40 flexRow padding20 justifyCenter marginAuto">
                <button
                  className="buttonBlock inline marginRight20"
                  onClick={(event) => {
                    handleEditButtonClick(event);
                  }}
                >
                  Edit this item
                </button>
                <button
                  className="buttonBlock inline"
                  onClick={(event) => {
                    handleDeleteButtonClick(event);
                  }}
                >
                  Delete this item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
