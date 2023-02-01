import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  const itemizedUserObject = JSON.parse(localStorage.getItem("itemized_user"));
  const [projects, setProjects] = useState([]);
  const [topProjects, setTopProjects] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8089/projects?userId=${itemizedUserObject.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      });
  });

  useEffect(() => {
    setTopProjects(projects.slice(0, 4))
  }, [projects]);

  return (
    <>
      <h1>Welcome to Itemized!</h1>
      <h2>Your top projects</h2>
      <div id="homeGrid">
        {topProjects.map(project => {
          return (
            <section className="allProjectsItem" key={project.id}>
            <div>{project.name}</div>
            <div><img className="homePhoto" src={project.imageURL} alt=""></img></div>
            <Link className="allProjectsMoreDetailsButton" to={`/projects/${project.id}`}>More details</Link>
          </section>
          )
        })}
      </div>
    </>
  );
};
