import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  useEffect(() => {
    fetch(`http://localhost:8089/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      });
  }, []);

  return (
    <>
      <h1>{project.name}</h1>
      <img className="projectImage" src={project.imageURL}  alt=""></img>
    </>
  );
};
