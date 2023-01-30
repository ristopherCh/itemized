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
      {items.map((item) => {
        return (
          <section className="allItemsItem" key={item.id}>
            <div>{item.name}</div>
            <Link to={`/items/${item.id}`}>More details</Link>
          </section>
        )
      })}
    </div>
  );
}