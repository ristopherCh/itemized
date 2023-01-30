import { useEffect, useState } from "react";
import "./items.css";

export const NewItem = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [userInputs, setUserInputs] = useState({
    userId: itemizedUserObject.id,
    name: "",
    type: "",
    imageURL: "",
    description: "",
    purchasePrice: 0,
    purchaseDate: "",
    review: "",
  });

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

  const handleItemCreation = (event) => {

    if (userInputs.name && userInputs.type && userInputs.imageURL) {
      fetch(`http://localhost:8089/items`, {
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
      <h2>Create New Item</h2>
      <form id="newItemForm">
        <fieldset>
          <label className="itemLabel" htmlFor="itemName">
            Name
          </label>
          <input
            type="text"
            id="itemName"
            name="name"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />
          <label className="itemLabel" htmlFor="itemType">
            Part Type
          </label>
          <input
            type="text"
            id="itemType"
            name="type"
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
          {userInputs.imageURL ? <img id="projectImage" src={userInputs.imageURL} alt={"uploaded"}></img> : ""}
          
          <label className="itemLabel" htmlFor="itemDescription">
            Add a description <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemDescription"
            name="description"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>
          <label className="itemLabel" htmlFor="itemProjectSelect">
            Link this item to an ongoing project{" "}
            <span className="italic">-- Optional</span>
          </label>
          <select>
            <option>Choose a project...</option>
          </select>
          <label className="itemLabel" htmlFor="itemPrice">
            Purchase Price <span className="italic">-- Optional</span>
          </label>
          <input
            type="number"
            id="itemPrice"
            name="purchasePrice"
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
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          />
          <label className="itemLabel" htmlFor="itemReview">
            Add notes/review <span className="italic">-- Optional</span>
          </label>
          <textarea
            className="itemTextarea"
            id="itemReview"
            name="review"
            onChange={(event) => {
              updateFormState(event, event.target.name);
            }}
          ></textarea>
          <button
            id="newItemSubmitButton"
            onClick={(event) => handleItemCreation(event)}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
};
