import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AllItems = () => {
  const [items, setItems] = useState([]);
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  useEffect(() => {
    fetch(`http://localhost:8089/items?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      });
  }, []);

  return (
    <div id="allItemsContainer">
    <h1>All Items</h1>
      {items.map((item) => {
        return (
          <section className="allItemsItemContainer" key={item.id}>
            <h2>{item.name}</h2>
            <div className="allItemsItem">
              <div className="allItemsDetails">
                <h3>{item.type}</h3>
                
              </div>
              <div className="allItemsRightColumn">
                <img className="allItemsImage" src={item.imageURL} alt=""></img>
                <Link className="allItemsMoreDetailsButton" to={`/items/${item.id}`}>More details</Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};
