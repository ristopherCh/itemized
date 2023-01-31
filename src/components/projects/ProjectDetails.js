import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [projectItems, setProjectItems] = useState([]);
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  useEffect(() => {
    fetch(`http://localhost:8089/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      });

    fetch(
      `http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}&projectId=${projectId}&_expand=item`
    )
      .then((res) => res.json())
      .then((data) => {
        setProjectItems(data);
      });
  }, []);

  return (
    <>
      <h1>{project.name}</h1>
      <div className="projectDetailsContainer">
        <div className="projectDetailsLeftColumn">
          <img className="projectImage" src={project.imageURL} alt=""></img>
        </div>
        <div className="projectDetailsRightColumn">
        <h2>Items</h2>
          {projectItems.map((projectItem, index) => {
            return (
              <div
                className="projectDetailsRightColumnSplitter"
                key={projectItem.id}
              >
                <div className="pdrl">{projectItem.item?.type}:</div>
                <div className="pdrr">
                  <Link to={`/items/${projectItem.itemId}`}>
                    {projectItem.item?.name}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
