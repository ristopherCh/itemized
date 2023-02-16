import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [projects, setProjects] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });

    fetch(`http://localhost:8089/itemsProjects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjectItems(data);
      });
  }, []);

  useEffect(() => {
    let topProjectIds = [];
    let topFoundProjects = [];
    if (projects.length > 0 && projectItems.length > 0) {
      for (let i = projectItems.length - 1; i >= 0; i--) {
        if (!topProjectIds.includes(projectItems[i]?.projectId)) {
          topProjectIds.push(projectItems[i]?.projectId);
        }
      }
    }
    topProjectIds.forEach((projectId) => {
      topFoundProjects.push(
        projects.find((project) => {
          return project.id === projectId;
        })
      );
    });

    setTopProjects(topFoundProjects.slice(0, 4));
  }, [projects, projectItems]);

  return (
    <>
      <h1>Your recent projects</h1>
      <div className="marginBottom50 marginTop20">
        <div
          id="homeGrid"
          className="width75 marginBottom50 marginAuto maxWidth1000 "
        >
          {topProjects.map((project) => {
            return (
              <Link
                className=""
                to={`/projects/${project.id}`}
                key={project.id}
              >
                <section className="allProjectsItem height100P">
                  <h2 className="marginBottom5">{project.name}</h2>
                  <div className="marginBottom10">
                    <img
                      className="width75 marginAuto displayBlock"
                      src={project.imageURL}
                      alt=""
                    />
                  </div>
                </section>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};
