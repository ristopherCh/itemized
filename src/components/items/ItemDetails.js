import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ItemDetails = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const { itemId } = useParams();
  const [item, setItem] = useState({});
  const [itemProjects, setItemProjects] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8089/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
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
      <p>Associated projects:</p>
      <ul className="itemDetailsUL">
        {itemProjects.map((itemProject) => {
          return (
            <li className="itemDetailsLI" key={itemProject.id}><Link to={`/projects/${itemProject.project.id}`}>{itemProject.project?.name}</Link></li>
          )
        })}
      </ul>
      </div>
    </>
  );
};
