import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState({});
  useEffect(() => {
    fetch(`http://localhost:8089/items/${itemId}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
      });
  }, []);

  return (
    <>
      <h1>{item.name}</h1>
      <img className="itemImage" src={item.imageURL} alt=""></img>
    </>
  );
};
