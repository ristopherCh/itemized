import { Route, Routes } from "react-router-dom";
import { Analytics } from "../analytics/Analytics";
import { Home } from "../Home/Home";
import { AllItems } from "../items/AllItems";
import { ItemDetails } from "../items/ItemDetails";
import { NewItem } from "../items/NewItem";
import { AllProjects } from "../projects/AllProjects";
import { NewProject } from "../projects/NewProject";
import { ProjectDetails } from "../projects/ProjectDetails";

export const ApplicationViews = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<AllProjects />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/items" element={<AllItems />} />
      <Route path="/items/:itemId" element={<ItemDetails />} />
      <Route path="/projects/new" element={<NewProject />} />
      <Route path="/projects/edit/:projectId" element={<NewProject />} />
      <Route path="/items/new" element={<NewItem />} />
      <Route path="/items/edit/:itemId" element={<NewItem />} />
      <Route path="/items/tags/:itemTag" element={<AllItems />} />
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  );
};
