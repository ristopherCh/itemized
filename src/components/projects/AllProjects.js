import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const AllProjects = () => {
  const [projects, setProjects] = useState([]);
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
      {projects.map((project) => {
        return (
          <section className="allProjectsItem" key={project.id}>
            <div>{project.name}</div>
            <Link to={`/projects/${project.id}`}>More details</Link>
          </section>
        )
      })}
    </div>
  );
};
