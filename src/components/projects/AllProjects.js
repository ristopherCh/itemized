import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterStatus, setFilterStatus] = useState(1);
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));

  useEffect(() => {
    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        data.reverse();
        setProjects(data);
      });
  }, []);

  useEffect(() => {
    let selectedFiltered = projects.map((project) => ({ ...project }));
    if (filterStatus === 1) {
      setFilteredProjects(selectedFiltered);
    } else if (filterStatus === 2) {
      setFilteredProjects(selectedFiltered.reverse());
    } else if (filterStatus === 3) {
      selectedFiltered.sort(compare("name"));
      setFilteredProjects(selectedFiltered);
    }
  }, [projects, filterStatus]);

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

  return (
    <div id="allProjectsContainer">
      <h1>All Projects</h1>
      <div id="allProjectsFilterBar">
        <div>Search</div>
        <div>
          <label>Filter</label>
          <select
            onChange={(event) => {
              setFilterStatus(parseInt(event.target.value));
            }}
          >
            <option value={1} defaultValue>
              Date Created (Newest First)
            </option>
            <option value={2} defaultValue>
              Date Created (Oldest First)
            </option>
            <option value={3}>Alphabetical</option>
          </select>
        </div>
      </div>
      {filteredProjects.map((project) => {
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
