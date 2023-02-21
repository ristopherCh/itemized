import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const Analytics = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [monthlyPurchases, setMonthlyPurchases] = useState([]);
  const [projects, setProjects] = useState([]);
  const [itemsProjects, setItemsProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(0);
  const [priceData, setPriceData] = useState({
    labels: [],
    datasets: [],
  });
  // const pricesArray = [];
  const pricesArray = useRef([]);
  const [showLegend, setShowLegend] = useState(true);
  const [chartOptions, setChartOptions] = useState({
    plugins: {
      legend: {
        display: true,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  });

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

  const monthColors = [
    "#9BD0F5",
    "Pink",
    "Purple",
    "Green",
    "#B565A7",
    "Orange",
    "Red",
    "Brown",
    "Blue",
    "#88B04B",
    "Gold",
    "#FF6F61",
    "#D65076",
    "#E15D44",
    "#A0DAA9"
  ];

  useEffect(() => {
    fetch(`http://localhost:8089/items?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data);
      });

    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });

    fetch(`http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setItemsProjects(data);
      });
  }, []);

  useEffect(() => {
    if (selectedProjectId === 0) {
      setFilteredItems(items);
    } else if (selectedProjectId === projects.length + 1) {
      let unfoundItems = [];
      items.forEach((item) => {
        let found = false;
        itemsProjects.forEach((itemProject) => {
          if (itemProject.itemId === item.id) {
            found = true;
          }
        });
        if (!found) {
          unfoundItems.push(item);
        }
      });
      setFilteredItems(unfoundItems);
    } else {
      let foundItems = [];
      itemsProjects.forEach((itemProject) => {
        if (itemProject.projectId === selectedProjectId) {
          items.forEach((item) => {
            if (item.id === itemProject.itemId) {
              foundItems.push(item);
            }
          });
        }
      });
      setFilteredItems(foundItems);
    }
  }, [selectedProjectId]);


// ! The below code is functional (I believe) for non-stacked bar charts. Leaving it for now.
  // useEffect(() => {
  //   let allItems = filteredItems?.map((item) => ({ ...item }));
  //   allItems.sort(compare("purchaseDate"));
  //   let pricesArray = [];
  //   let firstPurchase = allItems[0];
  //   let lastPurchase = allItems[allItems.length - 1];
  //   let firstYear = parseInt(firstPurchase?.purchaseDate.slice(0, 4));
  //   let finalYear = parseInt(lastPurchase?.purchaseDate.slice(0, 4));

  //   // ~ make empty purchases array
  //   if (firstYear && finalYear) {
  //     for (let i = firstYear; i <= finalYear; i++) {
  //       for (let j = 1; j <= 12; j++) {
  //         let dateObj = {
  //           year: i.toString(),
  //           month: j.toLocaleString("en-us", { minimumIntegerDigits: 2 }),
  //           purchases: 0,
  //         };
  //         pricesArray.push(dateObj);
  //       }
  //     }
  //   }

  //   // ~ sum up purchases
  //   allItems.forEach((item) => {
  //     pricesArray.forEach((priceObj) => {
  //       if (
  //         priceObj.year === item.purchaseDate.slice(0, 4) &&
  //         priceObj.month === item.purchaseDate.slice(5, 7)
  //       ) {
  //         priceObj.purchases += item.purchasePrice;
  //       }
  //     });
  //   });

  //   // ~ trim white space from ends of array
  //   for (let i = 0; i < pricesArray.length; i++) {
  //     let priceObj = pricesArray[i];
  //     if (priceObj.purchases === 0) {
  //       pricesArray.splice(i, 1);
  //       i--;
  //     } else {
  //       break;
  //     }
  //   }
  //   for (let i = pricesArray.length - 1; i >= 0; i--) {
  //     let priceObj = pricesArray[i];
  //     if (priceObj.purchases === 0) {
  //       pricesArray.splice(i, 1);
  //     } else {
  //       break;
  //     }
  //   }

  //   setMonthlyPurchases(pricesArray);
  // }, [filteredItems]);

  // useEffect(() => {
  //   let formattedPriceData = {
  //     labels: monthlyPurchases?.map((monthlyPurchase) => {
  //       return `${monthlyPurchase.month}-${monthlyPurchase.year}`;
  //     }),
  //     datasets: [
  //       {
  //         label: "$ spent per month",
  //         data: monthlyPurchases?.map((monthlyPurchase) => {
  //           return monthlyPurchase.purchases;
  //         }),
  //         backgroundColor: monthColors,
  //       },
  //     ],
  //   };
  //   setPriceData(formattedPriceData);
  // }, [monthlyPurchases]);

  useEffect(() => {
    pricesArray.current = [];
    let allItems = filteredItems?.map((item) => ({ ...item }));
    allItems.sort(compare("purchaseDate"));
    let firstPurchase = allItems[0];
    let lastPurchase = allItems[allItems.length - 1];
    let firstYear = parseInt(firstPurchase?.purchaseDate.slice(0, 4));
    let finalYear = parseInt(lastPurchase?.purchaseDate.slice(0, 4));

    if (firstYear && finalYear) {
      for (let i = firstYear; i <= finalYear; i++) {
        for (let j = 1; j <= 12; j++) {
          let dateObj = {
            year: i.toString(),
            month: j.toLocaleString("en-us", { minimumIntegerDigits: 2 }),
            purchases: 0,
          };
          pricesArray.current.push(dateObj);
        }
      }
    }

    let totalPricesArray = [];
    projects.forEach((project) => {
      let projectObj = {};
      projectObj[project.name] = pricesArray.current.map((priceThing) => ({
        ...priceThing,
      }));
      totalPricesArray.push(projectObj);
    });
    totalPricesArray.push({
      Unassociated: pricesArray.current.map((priceThing) => ({
        ...priceThing,
      })),
    });

    allItems.forEach((item) => {
      let itemProject = itemsProjects.find((itemProject) => {
        return itemProject.itemId === item.id;
      });
      let foundProject = projects.find((project) => {
        return project.id === itemProject?.projectId;
      });
      if (!foundProject) {
        foundProject = { name: "Unassociated" };
      }

      totalPricesArray.forEach((totalPriceObj, index) => {
        if (totalPriceObj.hasOwnProperty(foundProject?.name)) {
          let totalPriceArray = totalPriceObj[foundProject?.name];

          totalPriceArray.forEach((priceObj) => {
            if (
              priceObj.year === item.purchaseDate.slice(0, 4) &&
              priceObj.month === item.purchaseDate.slice(5, 7)
            ) {
              priceObj.purchases += item.purchasePrice;
            }
          });
        }
      });
    });

    // ~ trim the beginnings
    let earliestUsedIndex = Infinity;
    totalPricesArray.forEach((totalPriceObj) => {
      totalPriceObj[Object.keys(totalPriceObj)[0]].forEach(
        (totalPriceCal, index) => {
          if (totalPriceCal.purchases !== 0) {
            if (index < earliestUsedIndex) {
              earliestUsedIndex = index;
            }
          }
        }
      );
    });
    totalPricesArray.forEach((totalPriceObj) => {
      totalPriceObj[Object.keys(totalPriceObj)[0]].splice(0, earliestUsedIndex);
    });

    // ~ trim the ends
    let lastUsedIndex = 0;
    totalPricesArray.forEach((totalPriceObj) => {
      let totalPriceArray = totalPriceObj[Object.keys(totalPriceObj)[0]];
      for (let i = totalPriceArray.length - 1; i >= 0; i--) {
        let totalPriceItem = totalPriceArray[i];
        if (totalPriceItem.purchases !== 0) {
          if (i > lastUsedIndex) {
            lastUsedIndex = i;
          }
        }
      }
    });
    totalPricesArray.forEach((totalPriceObj) => {
      let totalPriceArray = totalPriceObj[Object.keys(totalPriceObj)[0]];
      totalPriceArray.splice(lastUsedIndex + 1, totalPriceArray.length);
    });

    setMonthlyPurchases(totalPricesArray);
  }, [filteredItems, projects, itemsProjects]);

  useEffect(() => {
    if (monthlyPurchases.length > 0) {
    }
    let formattedPriceData = {};
    if (monthlyPurchases.length > 0) {
      formattedPriceData = {
        labels: monthlyPurchases[0][Object.keys(monthlyPurchases[0])[0]].map(
          (month) => {
            return `${month.month}-${month.year}`;
          }
        ),
        datasets: monthlyPurchases.map((monthlyProjectPurchases, index) => {
          return {
            label: Object.keys(monthlyProjectPurchases)[0],
            data: monthlyProjectPurchases[
              Object.keys(monthlyProjectPurchases)[0]
            ].map((monthlyProjectPurchase) => {
              return monthlyProjectPurchase.purchases;
            }),
            backgroundColor: monthColors[index % monthColors.length],
          };
        }),
      };
    }
    setPriceData(formattedPriceData);
  }, [monthlyPurchases, pricesArray.current]);

  useEffect(() => {
    let options = { ...chartOptions };
    if (showLegend) {
      options.plugins.legend.display = true;
    } else {
      options.plugins.legend.display = false;
    }
    setChartOptions(options);
  }, [showLegend]);

  return (
    <div className="">
      <h1 className="marginTop10">Monthly spending totals</h1>
      <div className="flexRow spaceBetween marginBottom10 marginTop10">
        <div className="flexRow marginLeft15P alignCenter">
          <h3 className="displayInline">Filter by project</h3>
          <select
            className="marginLeft10 height25"
            onChange={(event) => {
              setSelectedProjectId(parseInt(event.target.value));
            }}
          >
            <option value={0}>All Projects</option>
            {projects.map((project) => {
              return (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              );
            })}
            <option value={projects.length + 1}>Unassociated items</option>
          </select>
        </div>
        <div className="marginRight15P displayInline">
          <label>Hide legend</label>
          <input
            className="marginLeft10"
            type="checkbox"
            onClick={(event) => {
              setShowLegend(!event.target.checked);
            }}
          />
        </div>
      </div>
      <div id="barChartDiv" className="width75 maxWidth1500 displayBlock marginAuto">
        <Bar data={priceData} options={chartOptions} />
      </div>
    </div>
  );
};
