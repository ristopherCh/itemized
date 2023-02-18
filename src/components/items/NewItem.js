import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./items.css";

export const NewItem = ({ purchaseDate }) => {
  const { itemId } = useParams();
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);
  const [priorTags, setPriorTags] = useState([]);
  const [editableItem, setEditableItem] = useState({});
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [selectedProjectId, setSelectedProjectId] = useState(0);
  const [projects, setProjects] = useState([]);
  const [itemProjects, setItemProjects] = useState([]);
  const [itemNote, setItemNote] = useState({
    userId: itemizedUserObject.id,
    itemId: 0,
    noteText: "",
    dateTime: "",
  });
  const [userInputs, setUserInputs] = useState({
    userId: itemizedUserObject.id,
    name: "",
    type: "",
    imageURL: "",
    description: "",
    purchasePrice: "",
    purchaseDate: "",
    review: "",
    documentation: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
    if (itemId) {
      fetch(`http://localhost:8089/items/${itemId}`)
        .then((res) => res.json())
        .then((data) => {
          setEditableItem(data);
        });
      fetch(
        `http://localhost:8089/itemsProjects?itemId=${itemId}&_expand=project`
      )
        .then((res) => res.json())
        .then((data) => {
          setItemProjects(data);
        });
      fetch(
        `http://localhost:8089/tags?userId=${itemizedUserObject.id}&itemId=${itemId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setPriorTags(data);
        });
    }
  }, []);

  // & When editing, previously set tags are added to the current tags array
  useEffect(() => {
    const priorTagsArray = [];
    priorTags.forEach((tag) => {
      priorTagsArray.push(tag.tag);
    });
    const copy = tags.concat(priorTagsArray);
    setTags(copy);
  }, [priorTags]);

  useEffect(() => {
    setUserInputs({
      userId: itemizedUserObject.id,
      name: editableItem.name,
      type: editableItem.type,
      imageURL: editableItem.imageURL,
      description: editableItem.description,
      purchasePrice: editableItem.purchasePrice,
      purchaseDate: editableItem.purchaseDate?.slice(0, 10),
      review: editableItem.review,
      documentation: editableItem.documentation,
    });
  }, [editableItem]);

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
      copy[property] = parseFloat(event.target.value);
    } else {
      copy[property] = event.target.value;
    }
    setUserInputs(copy);
  };

  const postToItemsProjects = (itemId) => {
    let isDuplicate = false;
    for (let itemProject of itemProjects) {
      if (itemProject.projectId === selectedProjectId) {
        isDuplicate = true;
      }
    }

    if (selectedProjectId && !isDuplicate) {
      return fetch(`http://localhost:8089/itemsProjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: itemizedUserObject.id,
          itemId: itemId,
          projectId: selectedProjectId,
        }),
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve("we have resolved postTOItemsProjects!");
      });
    }
  };

  // const postToItemsNotes = (itemId) => {
  //   const itemNoteCopy = { ...itemNote };
  //   itemNoteCopy.itemId = itemId;
  //   itemNoteCopy.dateTime = Date();
  //   if (itemNoteCopy.noteText) {
  //     fetch(`http://localhost:8089/itemsNotes`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(itemNoteCopy),
  //     });
  //   } else {
  //     navigate(`/items/${itemId}`);
  //   }
  // };

  const postToTags = (itemId) => {
    const promiseArray = [];
    if (tags.length > 0) {
      for (let tag of tags) {
        promiseArray.push(
          fetch(`http://localhost:8089/tags`, {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              userId: itemizedUserObject.id,
              itemId: itemId,
              tag: tag,
            }),
          })
        );
      }
      return Promise.all(promiseArray);
    }
  };

  const erasePriorTags = () => {
    let tagArray = [];
    if (priorTags.length > 0) {
      for (let tag of priorTags) {
        tagArray.push(
          fetch(`http://localhost:8089/tags/${tag.id}`, {
            method: "DELETE",
          })
        );
      }
      return Promise.all(tagArray);
    }
  };

  const displayItemProjects = () => {
    if (itemId) {
      return (
        <>
          <div>Associated projects:</div>
          <ul>
            {itemProjects.map((itemProject) => {
              return <li key={itemProject.id}>{itemProject.project.name}</li>;
            })}
          </ul>
        </>
      );
    } else {
      return "";
    }
  };

  const handleAddTag = (event) => {
    event.preventDefault();
    let hasDuplicate = false;
    tags.forEach((priorTag) => {
      if (priorTag === tag) {
        hasDuplicate = true;
      }
    });
    if (!hasDuplicate) {
      const copy = tags;
      copy.push(tag);
      setTags(copy);
      setTag("");
    } else {
      setTag("");
    }
  };

  const handleDeleteTag = (event, index) => {
    event.preventDefault();
    const copy = tags.slice(0).reverse();
    copy.splice(index, 1);
    setTags(copy);
  };

  const handleItemEdit = (event) => {
    const copy = { ...userInputs };
    copy.description = copy.description.trim();
    event.preventDefault();
    if (userInputs.name && userInputs.type) {
      fetch(`http://localhost:8089/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(copy),
      })
        .then((res) => res.json())
        .then((data) => {
          // ~ HERE
          postToItemsProjects(data.id)
            .then(() => {
              erasePriorTags();
            })
            .then(() => {
              postToTags(data.id);
            })
            .then(() => {
              navigate(`/items/${itemId}`);
            });
        });
    } else {
      alert("Please try again");
    }
  };

  const handleItemCreation = (event) => {
    // TODO : .then() all of those posts together
    event.preventDefault();
    const copy = { ...userInputs };
    if (copy.description) {
      copy.description = copy.description.trim();
    }
    if (userInputs.name && userInputs.type) {
      fetch(`http://localhost:8089/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(copy),
      })
        .then((res) => res.json())
        .then((data) => {
          postToItemsProjects(data.id)
            .then(() => {
              postToTags(data.id);
            })
            .then(() => {
              navigate(`/items/${data.id}`);
            });
        });
    } else {
      alert("Please try again");
    }
  };

  return (
    <div id="newItemContentContainer marginBottom50">
      {itemId ? <h1>Edit Item</h1> : <h1>Add New Item</h1>}
      <form id="newItemForm">
        <fieldset className="flexColumn marginLeft10P">
          <label className="" htmlFor="itemName">
            Name
          </label>
          <input
            className="width400"
            type="text"
            id="itemName"
            name="name"
            value={userInputs.name || ""}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="marginTop10" htmlFor="itemType">
            Part Type
          </label>
          <input
            className="width400"
            type="text"
            id="itemType"
            name="type"
            value={userInputs.type || ""}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />
          <label className="marginTop10" htmlFor="itemImage">
            Upload an image
          </label>
          <input
            type="file"
            className=""
            id="itemImageFile"
            name="imageURL"
            onChange={(event) => {
              fileToImgur(event);
            }}
          />
          {userInputs.imageURL ? (
            <img
              id="uploadedImage"
              src={userInputs.imageURL}
              alt={"uploaded"}
            ></img>
          ) : (
            ""
          )}
          <button
            className="width125 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5 "
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("itemImageFile").click();
            }}
          >
            Choose File
          </button>

          <label className="marginTop10" htmlFor="itemDescription">
            Add a description <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemDescription"
            name="description"
            value={
              userInputs.unEditedDescription
                ? userInputs.unEditedDescription
                : userInputs.description || ""
            }
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>

          <form>
            <label htmlFor="itemTags" className="">
              Tag this item
            </label>
            <div>
              <input
                type="text"
                className="width400"
                id="itemTags"
                name="tag"
                value={tag}
                onChange={(event) => {
                  setTag(event.target.value);
                }}
              />
              <button
                className="marginLeft5"
                onClick={(event) => {
                  handleAddTag(event);
                }}
              >
                +
              </button>
            </div>
          </form>
          <ul>
            {tags
              .slice(0)
              .reverse()
              .map((tag, index) => {
                return (
                  <div className="flexRow" key={index}>
                    <li className="skinnyLI">{tag}</li>
                    <button
                      className="borderNone standardBackground marginLeft10 cursorPointer padding13"
                      name={index}
                      onClick={(event) => handleDeleteTag(event, index)}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                );
              })}
          </ul>

          {displayItemProjects()}
          {itemProjects.length > 0 ? (
            <label className="" htmlFor="itemProjectSelect">
              Add this item to another project
              <span className="italic">-- Optional</span>
            </label>
          ) : (
            <label className="" htmlFor="itemProjectSelect">
              Add this item to a project
              <span className="italic">-- Optional</span>
            </label>
          )}

          <select
            className="width400"
            onChange={(event) => {
              setSelectedProjectId(parseInt(event.target.value));
            }}
          >
            <option>Choose a project...</option>
            {projects.map((project) => {
              return (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              );
            })}
          </select>

          <label className="" htmlFor="itemPrice">
            Purchase Price <span className="italic">-- Optional</span>
          </label>
          <input
            type="number"
            step="any"
            id="itemPrice"
            name="purchasePrice"
            value={userInputs.purchasePrice || ""}
            className="width400"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="" htmlFor="itemPurchaseDate">
            Purchase date <span className="italic">-- Optional</span>
          </label>
          <input
            type="date"
            className="width400"
            id="itemPurchaseDate"
            name="purchaseDate"
            value={userInputs.purchaseDate?.slice(0, 10) || ""}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="" htmlFor="itemReview">
            Add review <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemReview"
            name="review"
            value={userInputs.review || ""}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>

          <label className="" htmlFor="itemDocumentation">
            Additional documentation <span className="italic">-- Optional</span>
          </label>
          <input
            className="width400"
            type="text"
            id="itemDocumentation"
            name="documentation"
            value={userInputs.documentation || ""}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          {/* <label className="" htmlFor="itemNote">
            Add a note
          </label> */}
          <div>
            {/* <input
              className="width400"
              type="text"
              id="itemNote"
              name="note"
              onChange={(event) => {
                const copy = { ...itemNote };
                copy.noteText = event.target.value;
                setItemNote(copy);
              }}
            /> */}
            {itemId ? (
              <button
                id="newItemSubmitButton"
                className="marginTop10 marginBottom10"
                onClick={(event) => handleItemEdit(event)}
              >
                Save Edit
              </button>
            ) : (
              <button
                className="width125 borderRadiusMedium lightBorder darkPurpleBackground whiteFont padding5 marginTop5 cursorPointer"
                onClick={(event) => handleItemCreation(event)}
              >
                Submit
              </button>
            )}
          </div>
        </fieldset>
      </form>
    </div>
  );
};
