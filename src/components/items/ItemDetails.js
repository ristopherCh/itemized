import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export const ItemDetails = () => {
  const todaysDate = `${new Date().getFullYear()}-${(
    new Date().getMonth() + 1
  ).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}-${new Date().getDate().toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
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
    dateTime: todaysDate,
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

  const compare = (prop) => {
    return (a, b) => {
      if (a[prop] < b[prop]) {
        return -1;
      }
      if (a[prop] > b[prop]) {
        return 1;
      }
      return 0;
    };
  };

  const fetchItemNotes = () => {
    return fetch(
      `http://localhost:8089/itemsNotes?userId=${itemizedUserObject.id}&itemId=${item.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.forEach((datapoint) => {
          datapoint.dateTime = new Date(datapoint.dateTime)
            .toISOString()
            .slice(0, 10);
        });
        data.sort(compare("dateTime"));

        setItemNotes(data);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:8089/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        data.unEditedDescription = data.description;
        if (data.description) {
          data.description = data.description.split(". ");
        }
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
    fetchItemProjects(item.id);

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
    const copy = { ...itemNote };
    copy.dateTime = copy.dateTime.replace(/-/g, "/");
    fetch(`http://localhost:8089/itemsNotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(copy),
    }).then(() => {
      fetchItemNotes();
      setItemNote({
        userId: itemizedUserObject.id,
        itemId: itemId,
        noteText: "",
        dateTime: todaysDate,
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

  const handleNoteDelete = (event) => {
    fetch(`http://localhost:8089/itemsNotes/${event.currentTarget.value}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchItemNotes();
      });
  };

  const handleNoteEdit = (event) => {
    handleNoteDelete(event);
    const noteToEdit = itemNotes.find((itemNote) => {
      return itemNote.id === parseInt(event.currentTarget.value);
    });
    noteToEdit.dateTime = noteToEdit.dateTime.slice(0, 10);
    setItemNote(noteToEdit);
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
    let tagId = event.currentTarget.name;
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
      navElement.setAttribute("class", "blur darkGreenBackground");
    } else {
      overlayElement.style.display = "none";
      // overlayElementLower.style.display = "none";
      containerElement.setAttribute("class", null);
      navElement.setAttribute("class", "darkGreenBackground");
    }
  };

  return (
    <>
      <div id="itemImageLargeDiv">
        <div className="borderRadius20 pinkBackground">
          <h1 className="smallH1">{item.name}</h1>
          <div onClick={() => blurFunction(0)}>
            <span className="boldPointer close" />
          </div>
        </div>
        <img className="itemImageLarge" src={item.imageURL} alt="" />
        <div className="itemReview borderRadius20 darkGreenBackground">
          <span className="displayBlock justBold underlined textAlignCenter">
            Review
          </span>
          <div className="textAlignCenter">{item.review}</div>
        </div>
      </div>

      <div id="main_container">
        <div className="itemDetailsContainer">
          <h1 className="">{item.name}</h1>
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
              <div className="width100 spaceBetween flexColumn alignCenter margin10">
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

              <div
                className="margin10 alignCenter spaceBetween flexRow"
                id="itemMiddleBox"
              >
                <div
                  id="descriptionBox"
                  className="simpleBorder itemDescription minWidth250 boxShadow yellowBackground padding020 width45"
                >
                  <h2 className="underlined">Description</h2>
                  <ul className="itemDescriptionUL marginBottom10">
                    {item.description?.map((point, index) => {
                      return <li key={index}>{point}</li>;
                    })}
                  </ul>
                </div>

                <div
                  id="projectBox"
                  className="borderRadiusLight simpleBorder width50 margin10 minWidth250 flexRow alignItemsCenter spaceAround flexColumn boxShadow yellowBackground"
                >
                  <div
                    className="marginBottom10 marginTop10 textAlignCenter"
                    id="itemProjectsList"
                  >
                    {itemProjects.length > 0 ? (
                      <>
                        <h2 className="textAlignCenter">
                          This item is a member of:
                        </h2>
                        <ul className="itemDetailsUL marginLeft20 marginRight20">
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
                      <h2 className="displayInline">
                        This item is associated with no projects
                      </h2>
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
                    <div className="marginBottom10">
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
                        className="marginLeft10"
                        onClick={(event) => {
                          handleAddItemProject(event);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div
                id="tagsBox"
                className="boxShadow yellowBackground simpleBorder marginTop20 width75 marginAuto"
              >
                <h2 className="underlined">Tags</h2>
                <form className="flexRow justifyCenter marginBottom10">
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

                <div className="grid marginBottom10" id="tagsContainer">
                  {itemTags.map((itemTag) => {
                    return (
                      <div className="itemTagsContainer" key={itemTag.id}>
                        <div className="width100 textCenter" key={itemTag.id}>
                          <Link to={`/items/tags/${itemTag.tag}`}>
                            {itemTag.tag}
                          </Link>
                          <button
                            className="borderNone standardBackground marginLeft10 cursorPointer padding13 boxShadow"
                            name={itemTag.id}
                            onClick={(event) => {
                              handleTagDelete(event);
                            }}
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className="flexColumn margin10 marginTop20 yellowBackground simpleBorder width75 marginAuto"
                id="itemNotes"
              >
                <div className="width100">
                  {itemNotes.length > 0 ? (
                    <div className="" id="notesBox">
                      <h2 className="underlined">Notes</h2>
                      <ul className="">
                        {itemNotes.map((itemNote) => {
                          return (
                            <div
                              className="margin10 padding52"
                              key={itemNote.id}
                            >
                              <li>
                                <div className="flexRow spaceBetween">
                                  <div className="width85 marginLeft20 marginRight20">
                                    {itemNote.noteText}
                                  </div>
                                  <div className="flexRow" id="notesDateButtons">
                                    <div className="textAlignRight alignSelfCenter">
                                      {itemNote.dateTime ? (
                                        <>
                                          {new Date(
                                            itemNote.dateTime.replace(/-/g, "/")
                                          ).toLocaleDateString()}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                    <div className="flexRow">
                                      <button
                                        value={itemNote.id}
                                        className="height20 borderNone standardBackground marginLeft10 cursorPointer padding13 boxShadow alignSelfCenter"
                                        onClick={(event) => {
                                          handleNoteEdit(event);
                                        }}
                                      >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                      </button>
                                      <button
                                        value={itemNote.id}
                                        className="height20 borderNone standardBackground marginLeft10 cursorPointer padding13 boxShadow alignSelfCenter"
                                        onClick={(event) => {
                                          handleNoteDelete(event);
                                        }}
                                      >
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                <div className="narrowLine" />
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
                  <form
                    className="flexRow justifyCenter alignEnd"
                    id="addNoteBox"
                  >
                    <textarea
                      className="itemTextarea"
                      value={itemNote?.noteText}
                      id="addItemNote"
                      onChange={(event) => {
                        const copy = { ...itemNote };
                        copy.noteText = event.target.value;
                        setItemNote(copy);
                      }}
                    ></textarea>
                    <div className="flexRow marginLeft10">
                      <button
                        className="lightBorder darkPurpleBackground whiteFont cursorPointer padding26 borderRadiusLight boxShadow marginLeft10"
                        id="addNoteButton"
                        onClick={(event) => {
                          handleAddNoteButton(event);
                        }}
                      >
                        Add Note
                      </button>
                      <input
                        value={itemNote?.dateTime || ""}
                        className="borderNone marginLeft10"
                        type="date"
                        onChange={(event) => {
                          const copy = { ...itemNote };
                          console.log(event.target.value);
                          copy.dateTime = event.target.value;
                          setItemNote(copy);
                        }}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div
                className="margin10 inline flexRow padding20 justifyCenter marginAuto deleteButtonDiv"
                id="itemEditDeleteDiv"
              >
                <button
                  className="displayInline width150 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5 marginRight20"
                  onClick={(event) => {
                    handleEditButtonClick(event);
                  }}
                >
                  Edit item
                </button>
                <button
                  className="displayInline width150 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5"
                  onClick={(event) => {
                    handleDeleteButtonClick(event);
                  }}
                >
                  Delete item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
