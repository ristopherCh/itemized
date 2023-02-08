import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState(0);
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  useEffect(() => {
    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  }, []);

  return (
    <div id="allProjectsContainer">
      <h1>All Projects</h1>
      <div id="allProjectsFilterBar">
        <div>
          <label>Filter</label>
          <select
            onChange={(event) => {
              setFilterStatus(parseInt(event.target.value));
            }}
          >
            <option value={1} defaultValue>
              Recently Created
            </option>
            <option value={6}>Alphabetical</option>

          </select>
        </div>
        <div></div>
      </div>
      {projects.map((project) => {
        return (
          <Link key={project.id} to={`/projects/${project.id}`}>
            <section className="allProjectsItem" key={project.id}>
              <h2>{project.name}</h2>
              <div>
                <img
                  className="allProjectsPhoto"
                  src={project.imageURL}
                  alt=""
                ></img>
              </div>
            </section>
          </Link>
        );
      })}
    </div>
  );
};
