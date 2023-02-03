import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./items.css";

export const NewItem = ({ purchaseDate }) => {
  const { itemId } = useParams();
  const [editableItem, setEditableItem] = useState({});
  const navigate = useNavigate();
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [selectedProjectId, setSelectedProjectId] = useState(0);
  const [projects, setProjects] = useState([]);
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
          console.log(data);
        });
    }
  }, []);

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
    if (selectedProjectId) {
      fetch(`http://localhost:8089/itemsProjects`, {
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
    }
  };

  const postToItemsNotes = (itemId) => {
    const itemNoteCopy = { ...itemNote };
    itemNoteCopy.itemId = itemId;
    itemNoteCopy.dateTime = Date();
    if (itemNoteCopy.noteText) {
      fetch(`http://localhost:8089/itemsNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemNoteCopy),
      }).then(navigate(`/items/${itemId}`));
    } else {
      navigate(`/items/${itemId}`);
    }
  };

  const handleItemCreation = (event) => {
    event.preventDefault();
    if (userInputs.name && userInputs.type) {
      fetch(`http://localhost:8089/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
      })
        .then((res) => res.json())
        .then((data) => {
          postToItemsProjects(data.id);
          postToItemsNotes(data.id);
        });
    } else {
      alert("Please try again");
    }
  };

  const handleItemEdit = (event) => {
    event.preventDefault();
    if (userInputs.name && userInputs.type) {
      fetch(`http://localhost:8089/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInputs),
      })
        .then((res) => res.json())
        .then((data) => {
          postToItemsProjects(data.id);
          postToItemsNotes(data.id);
        });
    } else {
      alert("Please try again");
    }
  };

  return (
    <div id="newItemContentContainer">
      {itemId ? <h1>Edit Item</h1> : <h1>Add New Item</h1>}

      <form id="newItemForm">
        <fieldset>
          <label className="itemLabel" htmlFor="itemName">
            Name
          </label>
          <input
            className="newItemInputField"
            type="text"
            id="itemName"
            name="name"
            value={userInputs.name}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="itemLabel" htmlFor="itemType">
            Part Type
          </label>
          <input
            className="newItemInputField"
            type="text"
            id="itemType"
            name="type"
            value={userInputs.type}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />
          <label className="itemLabel" htmlFor="itemImage">
            Upload an image
          </label>
          <input
            type="file"
            id="itemImage"
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

          <label className="itemLabel" htmlFor="itemDescription">
            Add a description <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemDescription"
            name="description"
            value={userInputs.description}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>

          <label className="itemLabel" htmlFor="itemProjectSelect">
            Link this item to an ongoing project
            <span className="italic">-- Optional</span>
          </label>
          <select
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

          <label className="itemLabel" htmlFor="itemPrice">
            Purchase Price <span className="italic">-- Optional</span>
          </label>
          <input
            type="number"
            step="any"
            id="itemPrice"
            name="purchasePrice"
            value={userInputs.purchasePrice}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="itemLabel" htmlFor="itemPurchaseDate">
            Purchase date <span className="italic">-- Optional</span>
          </label>
          <input
            type="date"
            id="itemPurchaseDate"
            name="purchaseDate"
            value={userInputs.purchaseDate?.slice(0, 10)}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="itemLabel" htmlFor="itemReview">
            Add review <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemReview"
            name="review"
            value={userInputs.review}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>

          <label className="itemLabel" htmlFor="itemDocumentation">
            Additional documentation <span className="italic">-- Optional</span>
          </label>
          <input
            className="newItemInputField"
            type="text"
            id="itemDocumentation"
            name="documentation"
            value={userInputs.documentation}
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />

          <label className="itemLabel" htmlFor="itemNote">
            Add a note
          </label>
          <input
            className="newItemInputField"
            type="text"
            id="itemNote"
            name="note"
            onChange={(event) => {
              const copy = { ...itemNote };
              copy.noteText = event.target.value;
              setItemNote(copy);
            }}
          />
          {itemId ? (
            <button
              id="newItemSubmitButton"
              onClick={(event) => handleItemEdit(event)}
            >
              Save Edit
            </button>
          ) : (
            <button
              id="newItemSubmitButton"
              onClick={(event) => handleItemCreation(event)}
            >
              Submit
            </button>
          )}
        </fieldset>
      </form>
    </div>
  );
};
