import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const AllItems = () => {
  const { itemTag } = useParams();
  const [tagObjects, setTagObjects] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const preFilteredItems = useRef([]);
  const [filterStatus, setFilterStatus] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  const initialRender = () => {
    fetch(`http://localhost:8089/items?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
      });

    fetch(
      `http://localhost:8089/tags?userId=${itemizedUserObject.id}&tag=${itemTag}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTagObjects(data);
      });
  };

  useEffect(() => {
    initialRender();
  }, []);

  useEffect(() => {
    initialRender();
  }, [itemTag]);

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

  useEffect(() => {
    // TODO : tags are case insensitive
    if (itemTag) {
      let taggedItems = [];
      items.forEach((item) => {
        tagObjects.forEach((tagObject) => {
          if (item.id === tagObject.itemId) {
            taggedItems.push(item);
          }
        });
      });
      taggedItems.reverse();
      preFilteredItems.current = taggedItems;
      setFilteredItems(taggedItems);
    } else {
      let selectedFiltered = items.map((item) => ({ ...item }));
      selectedFiltered.reverse();
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    }

    if (filterStatus === 1) {
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    } else if (filterStatus === 6) {
      // ^ alphabetical
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      selectedFiltered.sort(compare("name"));
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    } else if (filterStatus === 2) {
      // ^ price, high to low
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      selectedFiltered.sort(compare("purchasePrice")).reverse();
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    } else if (filterStatus === 3) {
      // ^ price, low to high
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      selectedFiltered.sort(compare("purchasePrice"));
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    } else if (filterStatus === 4) {
      // ^ date purchased, recent first
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      selectedFiltered.forEach((item) => {
        item.purchaseDate = new Date(item.purchaseDate);
      });
      selectedFiltered.sort(compare("purchaseDate")).reverse();
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    } else if (filterStatus === 5) {
      // ^ date purchased, oldest first
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      selectedFiltered.forEach((item) => {
        item.purchaseDate = new Date(item.purchaseDate);
      });
      selectedFiltered.sort(compare("purchaseDate"));
      preFilteredItems.current = selectedFiltered;
      setFilteredItems(selectedFiltered);
    }

    if (searchInput) {
      let selectedFiltered = preFilteredItems.current.map((item) => ({
        ...item,
      }));
      let selectedFilteredSearched = selectedFiltered.filter((item) => {
        return (
          item.name?.toLowerCase().indexOf(searchInput.toLowerCase()) > -1 ||
          item.description?.toLowerCase().indexOf(searchInput.toLowerCase()) >
            -1 ||
          item.type?.toLowerCase().indexOf(searchInput.toLowerCase()) > -1
        );
      });
      setFilteredItems(selectedFilteredSearched);
    }
  }, [items, tagObjects, filterStatus, searchInput]);

  return (
    <div id="allItemsContainer" className="marginTop40">
      {itemTag ? <h1>{itemTag}</h1> : <h1>All Items</h1>}
      <div className="" id="allItemsFilterBar">
        <div>
          <label>Search</label>
          <input
            className="marginLeft10"
            type="text"
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
        </div>
        <div>
          <label>Filter</label>
          <select
            className="marginLeft10"
            onChange={(event) => {
              setFilterStatus(parseInt(event.target.value));
            }}
          >
            <option value={1} defaultValue>
              Recently Added
            </option>
            <option value={6}>Alphabetical</option>
            <option value={2}>Price (highest)</option>
            <option value={3}>Price (lowest)</option>
            <option value={4}>Date purchased (newest)</option>
            <option value={5}>Date purchased (oldest)</option>
          </select>
        </div>
      </div>

      {filteredItems.map((item) => {
        return (
          <section
            className="allItemsItemContainer width75 marginAuto"
            key={item.id}
          >
            <Link key={item.id} to={`/items/${item.id}`}>
              <h2>{item.name}</h2>
              <div className="allItemsItem">
                <div className="allItemsDetails">
                  <h3>{item.type}</h3>
                </div>
                <div className="allItemsRightColumn">
                  <img
                    className="allItemsImage"
                    src={item.imageURL}
                    alt=""
                  ></img>
                </div>
              </div>
            </Link>
          </section>
        );
      })}
    </div>
  );
};
